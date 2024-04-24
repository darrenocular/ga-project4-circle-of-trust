from flask import Blueprint, jsonify, request
from ..db import connect_db
from flask_jwt_extended import jwt_required, get_jwt

threads_bp = Blueprint('threads', __name__, url_prefix='/threads')

@threads_bp.route('/circle', methods=['POST'])
@jwt_required()
def get_threads_by_circle():
    try:
        conn = connect_db()

        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
        
        with conn.cursor() as cur:
            circle_id = request.json.get('circle_id')
            cur.execute("""
                        SELECT * FROM threads
                        WHERE circle_id = %s
                        """, (circle_id,))
            data = cur.fetchall()
        return jsonify({ 'status': 'ok', 'msg': 'successfully fetched all threads by circle', 'data': data }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'error fetching threads'}), 400