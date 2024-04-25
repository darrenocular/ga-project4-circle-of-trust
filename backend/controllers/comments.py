from flask import Blueprint, jsonify, request
from ..db import connect_db
from flask_jwt_extended import jwt_required, get_jwt
from ..validators.comments_validators import validate_comment_middleware
from datetime import datetime

comments_bp = Blueprint('comments', __name__, url_prefix='/comments')

@comments_bp.route('/get', methods=['POST'])
@jwt_required()
def get_comments_by_thread():
    try:
        conn = connect_db()

        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
        
        with conn.cursor() as cur:
            thread_id = request.json.get('thread_id')
            cur.execute("""
                        SELECT * FROM comments
                        WHERE thread_id = %s
                        ORDER BY parent_id, created_date;
                        """, (thread_id,))
            data = cur.fetchall()
        return jsonify({ 'status': 'ok', 'msg': 'successfully fetched all comments by thread', 'data': data }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'error fetching comments'}), 400

@comments_bp.route('/add', methods=['PUT'])
@jwt_required()
@validate_comment_middleware
def add_comment():
    try:
        claims = get_jwt()
        conn = connect_db()

        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
        
        with conn.cursor() as cur:
            thread_id = request.json.get('thread_id')
            parent_id = request.json.get('parent_id') or None
            author_id = claims['id']
            comment = request.json.get('comment')

            cur.execute("""
                        INSERT INTO comments(thread_id, parent_id, author_id, comment)
                        VALUES (%s, %s, %s, %s)
                        """, (thread_id, parent_id, author_id, comment))
            conn.commit()
        return jsonify({ 'status': 'ok', 'msg': 'comment added' }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'error adding comment'}), 400

@comments_bp.route('/edit', methods=['PATCH'])
@jwt_required()
@validate_comment_middleware
def edit_comment():
    try:
        claims = get_jwt()
        logged_in_user_id = claims['id']
        logged_in_user_role = claims['role']

        conn = connect_db()
        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
        
        with conn.cursor() as cur:
            comment_id = request.json.get('comment_id')

            # check if thread exists
            cur.execute("""
                        SELECT * FROM comments
                        WHERE id = %s
                        """, (comment_id,))
            comment_result = cur.fetchone()

            if not comment_result:
                return jsonify({ 'status': 'error', 'msg': 'comment does not exist' }), 404
            
            # check if logged in user is admin or thread author
            if logged_in_user_id != comment_result['author_id'] and logged_in_user_role != 'admin':
                return jsonify({ 'status': 'error', 'msg': 'unauthorized operation' }), 404
            
            comment = request.json.get('comment') or comment_result['comment']
            updated_date = datetime.now().strftime(f'%Y-%m-%d %H:%M:%S')
            cur.execute("""
                        UPDATE comments
                        SET comment = %s, updated_date = %s
                        WHERE id = %s
                        """, (comment, updated_date, comment_id))
            conn.commit()
        return jsonify({ 'status': 'ok', 'msg': 'comment updated' }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'error updating comment'}), 400

@comments_bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_comment():
    try:
        claims = get_jwt()
        logged_in_user_id = claims['id']
        logged_in_user_role = claims['role']

        conn = connect_db()
        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
        
        with conn.cursor() as cur:
            comment_id = request.json.get('comment_id')

            # check if thread exists
            cur.execute("""
                        SELECT * FROM comments
                        WHERE id = %s
                        """, (comment_id,))
            comment = cur.fetchone()

            if not comment:
                return jsonify({ 'status': 'error', 'msg': 'comment does not exist' }), 404
            
            # check if logged in user is admin or thread author
            if logged_in_user_id != comment['author_id'] and logged_in_user_role != 'admin':
                return jsonify({ 'status': 'error', 'msg': 'unauthorized operation' }), 404
            
            cur.execute("""
                        DELETE FROM comments
                        WHERE id = %s
                        """, (comment_id,))
            conn.commit()
        return jsonify({ 'status': 'ok', 'msg': 'comment deleted' }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'error deleting comment'}), 400