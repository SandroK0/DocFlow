from flask import Blueprint, request, jsonify
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from app.models import User

user_bp = Blueprint('user', __name__)


# Register route
@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 400
    user = User(username=username, email=email)
    print("user id", user.id)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    user.create_default_folder()
    return jsonify({"msg": "User created"}), 201


# Login route
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Retrieve the user from the database
    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({"msg": "Invalid credentials"}), 401

    # Create JWT token with user ID as the subject (identity)
    access_token = create_access_token(
        identity=str(user.id))  # Convert user.id to string
    return jsonify(access_token=access_token), 200
