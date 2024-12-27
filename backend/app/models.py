from app import db
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


def format_size(bytes_size):
    """
    Format size to the most appropriate unit.
    Returns tuple of (numeric_value, unit)
    """
    units = ['B', 'KB', 'MB', 'GB', 'TB']
    size = float(bytes_size)
    unit_index = 0

    while size >= 1024 and unit_index < len(units) - 1:
        size /= 1024
        unit_index += 1

    return round(size, 2), units[unit_index]


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    documents = db.relationship('Document', backref='user', lazy=True)
    folders = db.relationship('Folder', backref='user', lazy=True)

    MAX_STORAGE_MB = 48  # Maximum storage allowed for each user in MB
    MAX_STORAGE_BYTES = 48 * 1024 * 1024  # Convert MB to bytes

    def __repr__(self):
        return f'<User {self.username}>'

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @property
    def total_storage_used(self):
        """Calculate total storage used by user's documents in bytes."""
        return sum(len(doc.content.encode('utf-8')) if doc.content else 0
                   for doc in self.documents)

    @property
    def formatted_storage_used(self):
        """Return storage used with appropriate unit."""
        value, unit = format_size(self.total_storage_used)
        return f"{value} {unit}"

    @property
    def formatted_storage_remaining(self):
        """Return remaining storage with appropriate unit."""
        remaining_bytes = self.MAX_STORAGE_BYTES - self.total_storage_used
        value, unit = format_size(remaining_bytes)
        return f"{value} {unit}"

    @property
    def storage_summary(self):
        """Return complete storage summary."""
        return {
            "used": self.formatted_storage_used,
            "remaining": self.formatted_storage_remaining,
            "total": f"{self.MAX_STORAGE_MB} MB",
            "percentage_used": round((self.total_storage_used / self.MAX_STORAGE_BYTES) * 100, 2)
        }

    def has_storage_space(self, new_content):
        """Check if user has enough storage space for new content."""
        new_size = len(new_content.encode('utf-8')) if new_content else 0
        return (self.total_storage_used + new_size) <= self.MAX_STORAGE_BYTES

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "storage_summary": self.storage_summary
        }


# Document model for storing rich text documents (HTML content)
class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(MEDIUMTEXT, nullable=True)
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
        """Convert the folder to a dictionary including immediate subfolders and documents."""
        return {
            "id": self.id,
            "name": self.name,
            "parent_id": self.parent_id,
            "user_id": self.user_id,
            "is_empty": self.is_empty,
            "subfolders": [
                {"id": child.id, "name": child.name, "is_empty": child.is_empty}
                for child in self.children
            ],
            "documents": [document.to_dict() for document in self.documents]
        }
