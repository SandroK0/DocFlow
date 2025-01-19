from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
from flask_migrate import Migrate
from dotenv import load_dotenv
import pymysql
from sqlalchemy.exc import OperationalError
from sqlalchemy import text

# Initialize the extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    # Install pymysql to replace MySQLdb
    pymysql.install_as_MySQLdb()

    load_dotenv()

    # Load configuration from environment variables
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Check if the database connection is successful
    try:
        with app.app_context():
            # Try querying the database
            db.session.execute(text('SELECT 1'))  # simple query to test connection
            db.session.remove()  # Close the session after the check
        print("Database connection succeeded!")
    except OperationalError as e:
        print(f"Database connection failed: {e}")

    CORS(app, resources={r"/*": {"origins": "*"}})

    # Register blueprints (routes)
    from app.routes.user import user_bp
    from app.routes.documents import documents_bp
    from app.routes.folders import folders_bp
    from app.routes.trash import trash_bp

    @app.route("/")
    def index():
        return "This is python backend server for DockFlow."

    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(documents_bp, url_prefix='/documents')
    app.register_blueprint(folders_bp, url_prefix='/folders')
    app.register_blueprint(trash_bp, url_prefix='/trash')

    return app
