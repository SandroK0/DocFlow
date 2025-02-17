from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import SharedDocument, User, Folder, Document, db
from app.routes.documents import share_document

trash_bp = Blueprint('trash', __name__)


# def handle_delete_document(document):
#     sharings = SharedDocument.query.filter_by(
#         document_id=document.id
#     ).all()

#     for sharing in sharings:
#         db.session.delete(sharing)
#     db.session.delete(document)


# def delete_nested_folders(folder):
#     """Recursively delete all nested folders and documents."""
#     for document in folder.documents:
#         handle_delete_document(document)
#     for subfolder in folder.children:
#         delete_nested_folders(subfolder)
#     db.session.delete(folder)


@trash_bp.route('/', methods=['GET'])
@jwt_required()
def get_trash():
    user = User.get_current_user()
    if not user:
        return jsonify({"message": "User not found"}), 404

    root_folders = Folder.query.filter_by(
        user_id=user.id, parent_id=None, in_trash=True).all()
    root_documents = Document.query.filter_by(
        user_id=user.id, folder_id=None, in_trash=True).all()

    return jsonify({
        "folders": [folder.to_dict() for folder in root_folders],
        "documents": [doc.to_dict() for doc in root_documents]
    })


@trash_bp.route('/delete/document/<int:id>', methods=['POST'])
@jwt_required()
def delete_document(id):
    user = User.get_current_user()
    if not user:
        return jsonify({"message": "User not found"}), 404

    document = Document.query.get(id)
    if not document:
        return jsonify({"message": "Document not found"}), 404
    if document.user_id != user.id:
        return jsonify({"message": "Permission denied for this document"}), 403

    Document.handle_delete_document(document)
    db.session.commit()
    return jsonify({"message": "Document deleted successfully"}), 200


@trash_bp.route('/restore/document/<int:id>', methods=['POST'])
@jwt_required()
def restore_document(id):
    user = User.get_current_user()
    if not user:
        return jsonify({"message": "User not found"}), 404

    document = Document.query.get(id)
    if not document:
        return jsonify({"message": "Document not found"}), 404
    if document.user_id != user.id:
        return jsonify({"message": "Permission denied for this document"}), 403

    document.in_trash = False
    db.session.commit()
    return jsonify({"message": "Document restored successfully"}), 200


@trash_bp.route('/delete/folder/<int:folder_id>', methods=['POST'])
@jwt_required()
def delete_folder(folder_id):
    user = User.get_current_user()
    if not user:
        return jsonify({"message": "User not found"}), 404

    folder = Folder.query.filter_by(id=folder_id, user_id=user.id).first()
    if not folder:
        return jsonify({"message": "Folder not found"}), 404

    Folder.delete_nested_folders(folder)
    db.session.commit()
    return jsonify({"message": "Folder and all nested contents deleted successfully"}), 200


@trash_bp.route('/restore/folder/<int:folder_id>', methods=['POST'])
@jwt_required()
def restore_folder(folder_id):
    user = User.get_current_user()
    if not user:
        return jsonify({"message": "User not found"}), 404

    folder = Folder.query.filter_by(id=folder_id, user_id=user.id).first()
    if not folder:
        return jsonify({"message": "Folder not found"}), 404

    folder.in_trash = False
    db.session.commit()
    return jsonify({"message": "Folder and all nested contents restored successfully"}), 200


@trash_bp.route('/delete_all', methods=['POST'])
@jwt_required()
def delete_all():
    user = User.get_current_user()
    if not user:
        return jsonify({"message": "User not found"}), 404

    root_folders = Folder.query.filter_by(
        user_id=user.id, parent_id=None, in_trash=True).all()

    root_documents = Document.query.filter_by(
        user_id=user.id, folder_id=None, in_trash=True).all()

    for folder in root_folders:
        Folder.delete_nested_folders(folder, user.id)
    for document in root_documents:
        Document.handle_delete_document(document)

    db.session.commit()
    return jsonify({"message": "Trash cleaned successfully"}), 200


@trash_bp.route('/restore_all', methods=['POST'])
@jwt_required()
def restore_all():
    user = User.get_current_user()
    if not user:
        return jsonify({"message": "User not found"}), 404

    root_folders = Folder.query.filter_by(
        user_id=user.id, parent_id=None, in_trash=True).all()
    root_documents = Document.query.filter_by(
        user_id=user.id, folder_id=None, in_trash=True).all()

    for folder in root_folders:
        folder.in_trash = False
    for document in root_documents:
        document.in_trash = False

    db.session.commit()
    return jsonify({"message": "Everything from trash restored successfully"}), 200
