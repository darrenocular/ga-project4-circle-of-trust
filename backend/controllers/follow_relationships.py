from flask import Blueprint, jsonify, request
from ..db import connect_db
from flask_jwt_extended import jwt_required, get_jwt

follow_rs_bp = Blueprint('follow_rs', __name__, url_prefix='/user')

@follow_rs_bp.route('/follow', methods=['PUT'])
@jwt_required()
def add_follow_rs():
    try:
        # check if logged in user is the user making the follow request
        claims = get_jwt()
        logged_in_user_id = claims['id']
        follower_id = int(request.json.get('follower_id'))

        if request.method == 'PUT' and logged_in_user_id == follower_id:
            conn = connect_db()
            user_id = request.json.get('user_id')

            if not conn:
                raise Exception('unable to connect to db')
            
            with conn.cursor() as cur:
                cur.execute("""
                            INSERT INTO follow_relationships(user_id, follower_id)
                            VALUES (CAST(%s AS INTEGER), CAST(%s AS INTEGER))
                            """, (user_id, follower_id))
                conn.commit()

            return jsonify({ 'status': 'ok', 'msg': 'user follow relationship created'}), 200
        else:
            return jsonify({ 'status': 'error', 'msg': 'unauthorized to follow'}), 403
    except:
        return jsonify({ 'status': 'error', 'msg': 'unable to add follow relationship'}), 400

@follow_rs_bp.route('/follow', methods=['DELETE'])
@jwt_required()
def delete_follow_rs():
    try:
        # check if logged in user is the user making the request to delete follow relationship
        claims = get_jwt()
        logged_in_user_id = claims['id']
        follower_id = int(request.json.get('follower_id'))

        if request.method == 'DELETE' and logged_in_user_id == follower_id:
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
        else:
            return jsonify({ 'status': 'error', 'msg': 'unauthorized to unfollow'}), 403
    except:
        return jsonify({ 'status': 'error', 'msg': 'unable to delete follow relationship'}), 400

@follow_rs_bp.route('/followers', methods=['POST'])
@jwt_required()
def get_followers():
    try:
        if request.method == 'POST':
            user_id = request.json.get('user_id')
            
            conn = connect_db()

            if not conn:
                raise Exception('unable to connect to db')
            
            with conn.cursor() as cur:
                cur.execute("""
                            SELECT users.id, users.username FROM users
                            JOIN follow_relationships ON users.id = follow_relationships.follower_id
                            WHERE follow_relationships.user_id = %s;
                            """, (user_id,))
                data = cur.fetchall()

            return jsonify({ 'status': 'ok', 'msg': 'successfully fetched all followers', 'data': data }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'error fetching all followers' }), 400

@follow_rs_bp.route('/following', methods=['POST'])
@jwt_required()
def get_following():
    try:
        if request.method == 'POST':
            follower_id = request.json.get('follower_id')
            
            conn = connect_db()

            if not conn:
                raise Exception('unable to connect to db')
            
            with conn.cursor() as cur:
                cur.execute("""
                            SELECT users.id, users.username FROM users
                            JOIN follow_relationships ON users.id = follow_relationships.user_id
                            WHERE follow_relationships.follower_id = %s;
                            """, (follower_id,))
                data = cur.fetchall()

            return jsonify({ 'status': 'ok', 'msg': 'successfully fetched all accounts followed by user', 'data': data }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'error fetching all accounts followed by user' }), 400