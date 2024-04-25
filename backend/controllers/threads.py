from flask import Blueprint, jsonify, request
from ..db import connect_db
from flask_jwt_extended import jwt_required, get_jwt
from ..validators.threads_validators import validate_thread_middleware
from datetime import datetime

threads_bp = Blueprint('threads', __name__, url_prefix='/threads')

@threads_bp.route('/get', methods=['POST'])
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

@threads_bp.route('/add', methods=['PUT'])
@jwt_required()
@validate_thread_middleware
def add_thread():
    try:
        claims = get_jwt()
        conn = connect_db()

        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
        
        with conn.cursor() as cur:
            circle_id = request.json.get('circle_id')
            author_id = claims['id']
            title = request.json.get('title')
            
            cur.execute("""
                        INSERT INTO threads(circle_id, author_id, title)
                        VALUES (%s, %s, %s)
                        """, (circle_id, author_id, title))
            conn.commit()
        return jsonify({ 'status': 'ok', 'msg': 'thread added' }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'error adding thread'}), 400

@threads_bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_thread():
    try:
        claims = get_jwt()
        logged_in_user_id = claims['id']
        logged_in_user_role = claims['role']

        conn = connect_db()
        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
        
        with conn.cursor() as cur:
            thread_id = request.json.get('thread_id')

            # check if thread exists
            cur.execute("""
                        SELECT * FROM threads
                        WHERE id = %s
                        """, (thread_id,))
            thread = cur.fetchone()

            if not thread:
                return jsonify({ 'status': 'error', 'msg': 'thread does not exist' }), 404
            
            # check if logged in user is admin or thread author
            if logged_in_user_id != thread['author_id'] and logged_in_user_role != 'admin':
                return jsonify({ 'status': 'error', 'msg': 'unauthorized operation' }), 404
            
            cur.execute("""
                        DELETE FROM threads
                        WHERE id = %s
                        """, (thread_id,))
            conn.commit()
        return jsonify({ 'status': 'ok', 'msg': 'thread deleted' }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'error deleting thread'}), 400

@threads_bp.route('/edit', methods=['PATCH'])
@jwt_required()
@validate_thread_middleware
def edit_thread():
    try:
        claims = get_jwt()
        logged_in_user_id = claims['id']
        logged_in_user_role = claims['role']

        conn = connect_db()
        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
        
        with conn.cursor() as cur:
            thread_id = request.json.get('thread_id')

            # check if thread exists
            cur.execute("""
                        SELECT * FROM threads
                        WHERE id = %s
                        """, (thread_id,))
            thread = cur.fetchone()

            if not thread:
                return jsonify({ 'status': 'error', 'msg': 'thread does not exist' }), 404
            
            # check if logged in user is admin or thread author
            if logged_in_user_id != thread['author_id'] and logged_in_user_role != 'admin':
                return jsonify({ 'status': 'error', 'msg': 'unauthorized operation' }), 404
            
            title = request.json.get('title') or thread['title']
            updated_date = datetime.now().strftime(f'%Y-%m-%d %H:%M:%S')
            cur.execute("""
                        UPDATE threads
                        SET title = %s, updated_date = %s
                        WHERE id = %s
                        """, (title, updated_date, thread_id))
            conn.commit()
        return jsonify({ 'status': 'ok', 'msg': 'thread updated' }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'error updating thread'}), 400