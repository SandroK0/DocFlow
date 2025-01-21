from datetime import datetime, timedelta
import uuid
from flask import Blueprint, request, jsonify
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Document, User, SharedDocument

documents_bp = Blueprint('documents', __name__)


def get_current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    if not user:
        return None, jsonify({"message": "User not found"}), 404
    return user, None

# Create a new document route


@documents_bp.route('/', methods=['POST'])
@jwt_required()
def create_document():
    user, error = get_current_user()
    if error:
        return error

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
            title=document.title, user_id=user.id, folder_id=folder_id).first()

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
    user, error = get_current_user()
    if error:
        return error

    document = Document.query.get(id)

    # Check if the document exists
    if not document:
        return jsonify({"message": "Document not found"}), 404

    # Ensure the document belongs to the current user
    if document.user_id != user.id:
        return jsonify({"message": "You are not authorized to view this document"}), 403

    return jsonify(document.to_dict()), 200


@documents_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_document(id):
    user, error = get_current_user()
    if error:
        return error

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

    document.title = new_title
    new_content = data.get('content')
    document.folder_id = new_folder_id

    if new_content:
        if user.has_storage_space(new_content):
            document.content = new_content
        else:
            return jsonify({"message": "Not enough storage space"}), 400

    db.session.commit()
    return jsonify({"message": "Document updated successfully"}), 200


# Delete a document route
@documents_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_document(id):
    user, error = get_current_user()
    if error:
        return error

    document = Document.query.get(id)
    if not document:
        return jsonify({"message": "Document not found"}), 404
    if document.user_id != user.id:
        return jsonify({"message": "You do not have permission to delete this document"}), 403

    document.in_trash = True
    document.folder_id = None

    db.session.commit()
    return jsonify({"message": "Document deleted successfully"}), 200


@documents_bp.route("/share/<int:id>", methods=["POST"])
@jwt_required()
def share_document(id):
    user, error = get_current_user()
    if error:
        return error

    data = request.get_json()
    role = data.get("role")

    document = Document.query.get(id)
    if not document:
        return jsonify({"message": "Document not found"}), 404
    if document.user_id != user.id:
        return jsonify({"message": "You do not have permission to share this document"}), 403

    # Check if a shared document with the same role already exists
    shared_document = SharedDocument.query.filter_by(
        document_id=document.id, user_id=user.id, role=role).first()

    # Generate share token
    share_token = str(uuid.uuid4())
    expiration = datetime.utcnow() + timedelta(days=7)  # Token valid for 7 days

    if shared_document:
        # If it exists, update the existing shared document
        shared_document.share_token = share_token
        shared_document.expiration = expiration
    else:
        # If it doesn't exist, create a new shared document
        shared_document = SharedDocument(
            document_id=document.id, user_id=user.id, share_token=share_token, role=role, expiration=expiration)
        db.session.add(shared_document)

    db.session.commit()

    return jsonify({"message": "Document shared successfully", "share_token": share_token}), 200


@documents_bp.route("/shared/<string:token>", methods=["GET"])
def view_shared_document(token):
    shared_document = SharedDocument.query.filter_by(share_token=token).first()
    if not shared_document or (shared_document.expiration and shared_document.expiration < datetime.utcnow()):
        return jsonify({"message": "Invalid or expired share link"}), 404

    document = Document.query.filter_by(id=shared_document.document_id).first()

    return jsonify({'document': document.to_dict(), "role": shared_document.role}), 200


@documents_bp.route("/shared/<string:token>", methods=["PUT"])
def update_shared_document(token):

    shared_document = SharedDocument.query.filter_by(share_token=token).first()

    if not shared_document or (shared_document.expiration and shared_document.expiration < datetime.utcnow()):
        return jsonify({"message": "Invalid or expired share link"}), 404

    if shared_document.role != "editor":
        return jsonify({"message": "You Dont have permission to edit this Document"}), 403

    document = Document.query.get(shared_document.document_id)
    owner = User.query.get(document.user_id)
    data = request.get_json()

    new_title = data.get('title', document.title)
    new_folder_id = data.get('folder_id', document.folder_id)

    if new_title != document.title:
        # Check for duplicate document titles in the target folder
        duplicate_document = Document.query.filter_by(
            title=new_title,
            folder_id=new_folder_id,
            user_id=owner.id
        ).filter(Document.id != id).first()

        if duplicate_document:
            return jsonify({"message": "A document with the same title already exists in the target folder."}), 400

        # Update document details
        document.title = new_title

    new_content = data.get('content')

    if new_content:
        if owner.has_storage_space(new_content):
            document.content = new_content
        else:
            return jsonify({"message": "Not enough storage space"}), 400

    document.folder_id = new_folder_id

    db.session.commit()
    return jsonify({"message": "Document updated successfully"}), 200
