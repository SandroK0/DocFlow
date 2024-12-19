from flask import Blueprint, request, jsonify
from app import db
from app.models import Folder
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Document, User


folders_bp = Blueprint('folders', __name__)


@folders_bp.route('/', methods=['POST'])
@jwt_required()
def create_folder():
    current_user_id = get_jwt_identity()
    current_user_id = int(current_user_id)

    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Get folder data from request
    data = request.get_json()
    folder_name = data.get('name')
    # Default to None for root folder
    parent_id = data.get('parent_id', None)

    if not folder_name:
        return jsonify({"message": "Folder name is required"}), 400

    # Check if the parent folder exists and belongs to the current user
    if parent_id:
        parent_folder = Folder.query.get(parent_id)
        if not parent_folder:
            return jsonify({"message": "Parent folder not found"}), 404

        if parent_folder.user_id != current_user_id:
            return jsonify({"message": "Parent folder does not belong to the current user"}), 403

    new_folder = Folder(
        name=folder_name,
        parent_id=parent_id,
        user_id=current_user_id
    )

    # Check if a folder with the same name already exists in the parent folder
    existing_folder = Folder.query.filter_by(
        name=new_folder.name, user_id=user.id, parent_id=new_folder.parent_id).first()

    if existing_folder:
        raise ValueError(
            "A folder with this name already exists in this folder.")

    db.session.add(new_folder)
    db.session.commit()

    return jsonify({
        "message": "Folder created successfully",
        "folder": {
            "id": new_folder.id,
            "name": new_folder.name,
            "parent_id": new_folder.parent_id
        }
    }), 201


@folders_bp.route('/', methods=['GET'])
@folders_bp.route('/<int:folder_id>', methods=['GET'])
@jwt_required()
def get_folder_contents(folder_id=None):
    current_user_id = get_jwt_identity()
    current_user_id = int(current_user_id)

    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    if folder_id is None:
        # Fetch root-level folders and documents
        root_folders = Folder.query.filter_by(
            user_id=user.id, parent_id=None).all()
        root_documents = Document.query.filter_by(
            user_id=user.id, folder_id=None).all()

        return jsonify({
            "folders": [folder.to_dict() for folder in root_folders],
            "documents": [doc.to_dict() for doc in root_documents]
        })
    else:
        # Fetch the requested folder
        folder = Folder.query.filter_by(id=folder_id, user_id=user.id).first()

        if not folder:
            return jsonify({"message": "Folder not found"}), 404

        # Use relationships to get subfolders and documents
        return jsonify({
            "folders": [child.to_dict() for child in folder.children],
            "documents": [doc.to_dict() for doc in folder.documents]
        })


@folders_bp.route('/<int:folder_id>', methods=['DELETE'])
@jwt_required()
def delete_folder(folder_id):
    current_user_id = get_jwt_identity()
    current_user_id = int(current_user_id)

    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    folder = Folder.query.filter_by(id=folder_id, user_id=user.id).first()

    if not folder:
        return jsonify({"message": "Folder not found"}), 404

    # Recursive function to delete nested folders and documents
    def delete_nested_folders(folder):
        for document in folder.documents:
            db.session.delete(document)

        for subfolder in folder.children:
            delete_nested_folders(subfolder)

        db.session.delete(folder)

    delete_nested_folders(folder)

    db.session.commit()

    return jsonify({"message": "Folder and all nested contents deleted successfully"}), 200
