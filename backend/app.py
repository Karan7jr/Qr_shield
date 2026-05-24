from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes.scan_routes import scan_bp
from routes.history_routes import history_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    app.register_blueprint(scan_bp)
    app.register_blueprint(history_bp)

    with app.app_context():
        db.create_all()

    @app.route("/api/health")
    def health():
        return {"status": "ok", "app": "QR Shield API"}, 200

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000) 