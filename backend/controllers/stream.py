from flask import Blueprint, jsonify, request
import os
from ..db import connect_db
from flask_jwt_extended import jwt_required, get_jwt
from getstream import Stream

stream_bp = Blueprint('stream', __name__, url_prefix='/stream')

@stream_bp.route('/token', methods=['GET'])
@jwt_required()
def get_stream_token():
    try:
        client = Stream(api_key=os.getenv('STREAM_API_KEY'), api_secret=os.getenv('STREAM_SECRET_KEY'), timeout=3.0)
        return client
    except Exception as error:
        return jsonify({ 'status': 'error', 'msg': error }), 400