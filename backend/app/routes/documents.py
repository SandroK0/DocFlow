from flask import Blueprint, request, jsonify
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Document, User

documents_bp = Blueprint('documents', __name__)


# Create a new document route
@documents_bp.route('/', methods=['POST'])
@jwt_required()
def create_document():
    current_user_id = get_jwt_identity()
    current_user_id = int(current_user_id)

    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()

    # Check if the required fields are in the request data
    title = data.get('title')
    folder_id = data.get("folder_id")

    if not title:
        return jsonify({"message": "Title and content are required"}), 400

    # Create the document
    document = Document(title=title,
                        folder_id=folder_id, user_id=user.id)

    try:
        # This will raise ValueError if duplicate found
        # Check if a document with the same title already exists for this user
        existing_document = Document.query.filter_by(
            title=document.title, user_id=user.id).first()

        if existing_document:
            raise ValueError(
                "A document with this title already exists in this folder.")

        # If no duplicates, add the document
        db.session.add(document)
        db.session.commit()
        return jsonify({"message": "Document created successfully", "document_id": document.id}), 201
    except ValueError as e:
        # Return the error message for duplicates
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        db.session.rollback()  # Rollback in case of any other error
        return jsonify({"message": "Failed to create document", "error": str(e)}), 500


# Get a document by ID route
@documents_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_document(id):
    current_user_id = get_jwt_identity()  # Get the current user from JWT token
    current_user_id = int(current_user_id)

    document = Document.query.get(id)

    # Check if the document exists
    if not document:
        return jsonify({"message": "Document not found"}), 404

    # Ensure the document belongs to the current user
    if document.user_id != current_user_id:
        return jsonify({"message": "You are not authorized to view this document"}), 403

    return jsonify(document.to_dict()), 200


@documents_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_document(id):
    current_user_id = get_jwt_identity()
    current_user_id = int(current_user_id)

    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    document = Document.query.get(id)
    if not document:
        return jsonify({"message": "Document not found"}), 404

    if document.user_id != user.id:
        return jsonify({"message": "You do not have permission to edit this document"}), 403

    data = request.get_json()

    new_title = data.get('title', document.title)
    new_folder_id = data.get('folder_id', document.folder_id)

    # Check for duplicate document titles in the target folder
    duplicate_document = Document.query.filter_by(
        title=new_title,
        folder_id=new_folder_id,
        user_id=user.id
    ).filter(Document.id != id).first()

    if duplicate_document:
        return jsonify({"message": "A document with the same title already exists in the target folder."}), 400

    # Update document details
    document.title = new_title

    new_content = data.get('content')

    if new_content:
        if user.has_storage_space(new_content):
            document.content = new_content
        else:
            return jsonify({"message": "Not enough storage space"}), 400

    document.folder_id = new_folder_id

    db.session.commit()
    return jsonify({"message": "Document updated successfully"}), 200


# Delete a document route
@documents_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_document(id):
    current_user_id = get_jwt_identity()
    current_user_id = int(current_user_id)

    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    document = Document.query.get(id)
    if not document:
        return jsonify({"message": "Document not found"}), 404
    if document.user_id != user.id:
        return jsonify({"message": "You do not have permission to delete this document"}), 403

    db.session.delete(document)
    db.session.commit()
    return jsonify({"message": "Document deleted successfully"}), 200
