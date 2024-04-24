from flask import Flask
import os
from dotenv import load_dotenv
from datetime import timedelta
from .extensions import cors, talisman, limiter, jwt, bcrypt

from .controllers.auth import auth_bp
from .controllers.follow_relationships import follow_rs_bp
from .controllers.circles import circles_bp
from .controllers.threads import threads_bp
from .controllers.comments import comments_bp

load_dotenv()

# app = Flask(__name__, static_folder='my-app/build', static_url_path='')
app = Flask(__name__)

# App configurations
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

# Register extensions
cors.init_app(app)
talisman.init_app(app)
limiter.init_app(app)
jwt.init_app(app)
bcrypt.init_app(app)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(follow_rs_bp)
app.register_blueprint(circles_bp)
app.register_blueprint(threads_bp)
app.register_blueprint(comments_bp)

PORT = os.getenv('PORT') or 5000

if __name__ == '__main__':
    app.run(use_reloader=True, port=PORT, threaded=True, debug=True)