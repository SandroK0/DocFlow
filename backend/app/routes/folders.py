from flask import Blueprint, request, jsonify
from app import db
from app.models import Folder
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Document


folders_bp = Blueprint('folders', __name__)


@folders_bp.route('/', methods=['POST'])
@jwt_required()
def create_folder():
    current_user_id = get_jwt_identity()
    current_user_id = int(current_user_id)

    # Get folder data from request
    data = request.get_json()
    folder_name = data.get('name')
    parent_id = data.get('parent_id', None)  # default to None for root folder

    if not folder_name:
        return jsonify({"message": "Folder name is required"}), 400

    # Create a new folder
    new_folder = Folder(
        name=folder_name,
        parent_id=parent_id,
        user_id=current_user_id
    )

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


@folders_bp.route('/<int:folder_id>', methods=['GET'])
@jwt_required()
def get_folder_contents(folder_id):
    current_user_id = get_jwt_identity()
    current_user_id = int(current_user_id)

    # Get folder by ID and check if it's the user's folder
    folder = Folder.query.filter_by(
        id=folder_id, user_id=current_user_id).first()

    if not folder:
        return jsonify({"message": "Folder not found"}), 404

    # Fetch documents and subfolders within the specified folder
    subfolders = Folder.query.filter_by(parent_id=folder_id).all()
    documents = Document.query.filter_by(folder_id=folder_id).all()

    return jsonify({
        "folder": folder.name,
        "subfolders": [subfolder.name for subfolder in subfolders],
        "documents": [{"id": doc.id, "title": doc.title} for doc in documents]
    })


@folders_bp.route('/root', methods=['GET'])
@jwt_required()
def get_root_folder_contents():
    # Get current logged-in user
    current_user_id = get_jwt_identity()
    current_user_id = int(current_user_id)

    # Fetch the root folder for the user
    root_folder = Folder.query.filter_by(
        user_id=current_user_id, parent_id=None).first()

    if not root_folder:
        return jsonify({"message": "Root folder not found"}), 404

    # Get all documents and subfolders inside the root folder
    folders = Folder.query.filter_by(
        user_id=current_user_id, parent_id=root_folder.id).all()
    documents = Document.query.filter_by(
        user_id=current_user_id, folder_id=root_folder.id).all()

    return jsonify({
        "folders": [folder.name for folder in folders],
        "documents": [{"id": doc.id, "title": doc.title} for doc in documents]
    })
