from flask import Blueprint, jsonify, request
from ..db import connect_db
from flask_jwt_extended import jwt_required, get_jwt

comments_bp = Blueprint('comments', __name__, url_prefix='/comments')

@comments_bp.route('/parent', methods=['POST'])
@jwt_required()
def get_comments_by_parent():
    try:
        conn = connect_db()

        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
        
        with conn.cursor() as cur:
            pass
        return jsonify({ 'status': 'ok', 'msg': 'successfully fetched all comments by parent', 'data': data }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'error fetching comments'}), 400