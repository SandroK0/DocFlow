from flask import Blueprint, request, jsonify
from app import db
from datetime import timedelta
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from app.models import User

user_bp = Blueprint('user', __name__)


def get_current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    if not user:
        return None, jsonify({"message": "User not found"}), 404
    return user, None


# Register route
@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Validate input data
    if not username or not password:
        return jsonify({"error": "Missing required fields", "message": "Username, and password are required to register."}), 400

    if len(password) < 8:
        return jsonify({"error": "Weak password", "message": "Password must be at least 8 characters long."}), 400

    # Check if the username already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Conflict", "message": "The username is already taken."}), 409

    # Create and save the user
    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registration successful",
        "user": {"id": user.id, "username": user.username}
    }), 201


# Login route
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing required fields", "message": "Both username and password are required."}), 400

    # Retrieve the user from the database
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"error": "Invalid credentials", "message": "The username you entered does not exist."}), 401

    if not user.check_password(password):
        return jsonify({"error": "Invalid credentials", "message": "The password you entered is incorrect."}), 401

    # Create JWT token with user ID as the subject (identity)
    access_token = create_access_token(
        identity=str(user.id), expires_delta=timedelta(days=1)
    )
    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": user.to_dict()
    }), 200


@user_bp.route('/storage_info', methods=['GET'])
@jwt_required()
def get_user_storage_info():

    user, error = get_current_user()
    if error:
        return error

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "storage": user.storage_summary
    }), 200
