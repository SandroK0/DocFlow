from app import db
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


# User model with JWT auth
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    documents = db.relationship('Document', backref='user', lazy=True)
    folders = db.relationship('Folder', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


# Document model for storing rich text documents (HTML content)
class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    folder_id = db.Column(db.Integer, db.ForeignKey(
        'folder.id'), nullable=True)  # Document belongs to a folder

    def __repr__(self):
        return f'<Document {self.title}>'

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "user_id": self.user_id,
            "folder_id": self.folder_id
        }


# Folder model to organize documents and other folders
class Folder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey(
        'folder.id'), nullable=True)  # Parent folder (for hierarchy)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Relationships to build tree structure
    parent = db.relationship('Folder', remote_side=[
                             id], backref='children', lazy=True)
    documents = db.relationship('Document', backref='folder', lazy=True)

    @property
    def is_empty(self):
        """Check if the folder is empty (no subfolders and no documents)."""
        return len(self.children) == 0 and len(self.documents) == 0

    def __repr__(self):
        return f'<Folder {self.name}>'

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "parent_id": self.parent_id,
            "user_id": self.user_id,
            "is_empty": self.is_empty,
        }
