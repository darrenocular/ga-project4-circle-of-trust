from flask import Flask
import os
from dotenv import load_dotenv
from .extensions import cors, talisman, limiter, jwt, bcrypt

from .controllers.auth import auth_bp

load_dotenv()

# app = Flask(__name__, static_folder='my-app/build', static_url_path='')
app = Flask(__name__)

# App configurations
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

# Register extensions
cors.init_app(app)
talisman.init_app(app)
limiter.init_app(app)
jwt.init_app(app)
bcrypt.init_app(app)

# Register blueprints
app.register_blueprint(auth_bp)

@app.route('/')
def hello_world():
    return "<p>Hello chicken!</p>"

PORT = os.getenv('PORT') or 5000

if __name__ == '__main__':
    app.run(use_reloader=True, port=PORT, threaded=True, debug=True)