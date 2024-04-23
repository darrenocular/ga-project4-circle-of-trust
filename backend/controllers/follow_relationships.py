from flask import Blueprint, jsonify, request
from ..db import connect_db
from flask_jwt_extended import jwt_required

follow_rs_bp = Blueprint('follow_rs', __name__, url_prefix='/user')

@follow_rs_bp.route('/follow', methods=['PUT'])
def add_follow_rs():
    try:
        if request.method == 'PUT':
            conn = connect_db()
            user_id = request.json.get('user_id')
            follower_id = request.json.get('follower_id')

            if not conn:
                raise Exception('unable to connect to db')
            
            with conn.cursor() as cur:
                cur.execute("""
                            INSERT INTO follow_relationships(user_id, follower_id)
                            VALUES (CAST(%s AS INTEGER), CAST(%s AS INTEGER))
                            """, (user_id, follower_id))
                conn.commit()

            return jsonify({ 'status': 'ok', 'msg': 'user follow relationship created'}), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'unable to add follow relationship'}), 400

@follow_rs_bp.route('/follow', methods=['DELETE'])
def delete_follow_rs():
    try:
        if request.method == 'DELETE':
            conn = connect_db()
            user_id = request.json.get('user_id')
            follower_id = request.json.get('follower_id')

            if not conn:
                raise Exception('unable to connect to db')
            
            with conn.cursor() as cur:
                cur.execute("""
                            DELETE FROM follow_relationships
                            WHERE user_id=CAST(%s AS INTEGER) AND follower_id=CAST(%s AS INTEGER)
                            """, (user_id, follower_id))
                conn.commit()

            return jsonify({ 'status': 'ok', 'msg': 'user follow relationship deleted'}), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'unable to delete follow relationship'}), 400