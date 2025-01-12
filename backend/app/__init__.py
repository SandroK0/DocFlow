from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
from flask_migrate import Migrate
from dotenv import load_dotenv

# Initialize the extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    load_dotenv()
    print("DATABASE_URL:", os.getenv('DATABASE_URL'))

    # Load configuration from environment variables
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Enable CORS for all routes
    CORS(app)

    # Register blueprints (routes)
    from app.routes.user import user_bp
    from app.routes.documents import documents_bp
    from app.routes.folders import folders_bp
    from app.routes.trash import trash_bp

    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(documents_bp, url_prefix='/documents')
    app.register_blueprint(folders_bp, url_prefix='/folders')
    app.register_blueprint(trash_bp, url_prefix='/trash')

    return app
