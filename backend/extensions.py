from flask_cors import CORS
from flask_talisman import Talisman
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

cors = CORS(resources={r"/*": {
        "origins": "*",
        "allow_headers": [
            "Content-Type", "Authorization", "Access-Control-Allow-Credentials"
        ],
        "supports_credentials": True,
        "methods": ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"]
    }})
talisman = Talisman()
limiter = Limiter(
    get_remote_address,
    default_limits=['1000 per 15 minutes'],
    storage_uri='memory://'
)
jwt = JWTManager()
bcrypt = Bcrypt()