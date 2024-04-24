from flask import Blueprint, jsonify, request
from ..db import connect_db
from flask_jwt_extended import jwt_required, get_jwt
from ..validators.circles_validators import add_circle_middleware, update_circle_middleware

circles_bp = Blueprint('circles', __name__, url_prefix='/circles')

# Main circles endpoints
@circles_bp.route('/all')
@jwt_required()
def get_all_circles():
    try:
        conn = connect_db()

        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
        
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT * FROM circles
                        """)
            data = cur.fetchall()
        
        return jsonify({ 'status': 'ok', 'msg': 'successfully fetched all circles', 'data': data }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'error getting all circles'}), 400

@circles_bp.route('/get', methods=['POST'])
@jwt_required()
def get_circle_by_id():
    try:
        conn = connect_db()

        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
        
        with conn.cursor() as cur:
            circle_id = request.json.get('circle_id')
            cur.execute("""
                        SELECT * FROM circles
                        WHERE id = %s
                        """, (circle_id,))
            data = cur.fetchone()

            if not data:
                return jsonify({ 'status': 'error', 'msg': 'circle does not exist'})
        
        return jsonify({ 'status': 'ok', 'msg': 'successfully fetched circle details', 'data': data }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'error getting circle details'}), 400

@circles_bp.route('/user', methods=['POST'])
@jwt_required()
def get_circles_by_user():
    try:
        conn = connect_db()

        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
        
        with conn.cursor() as cur:
            host_id = request.json.get('host_id')
            cur.execute("""
                        SELECT * FROM circles
                        WHERE host_id = %s
                        """, (host_id,))
            data = cur.fetchall()

            if not data:
                return jsonify({ 'status': 'ok', 'msg': 'user has no circles'}), 200
        
        return jsonify({ 'status': 'ok', 'msg': 'successfully fetched all circles by user', 'data': data }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'error getting circles by user'}), 400

@circles_bp.route('/add', methods=['PUT'])
@jwt_required()
@add_circle_middleware
def add_circle():
    try:
        # check if user creating circle is logged in user
        claims = get_jwt()
        logged_in_user_id = claims['id']
        host_id = request.json.get('host_id')

        if request.method == 'PUT' and logged_in_user_id == int(host_id):
            conn = connect_db()

            if not conn:
                return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
            
            with conn.cursor() as cur:
                title = request.json.get('title')
                description = request.json.get('description')
                participants_limit = request.json.get('participants_limit', 100)
                start_date = request.json.get('start_date')

                cur.execute("""
                            INSERT INTO circles(host_id, title, description, participants_limit, start_date)
                            VALUES (%s, %s, %s, %s, %s)
                            """, (host_id, title, description, participants_limit, start_date))
                conn.commit()  
            return jsonify({ 'status': 'ok', 'msg': 'circle created' }), 200
        else:
            return jsonify({ 'status': 'error', 'error': 'creation of new circle unauthorized' }), 403
    except:
        return jsonify({ 'status': 'error', 'msg': 'error creating circle'}), 400

@circles_bp.route('/edit', methods=['PATCH'])
@jwt_required()
@update_circle_middleware
def edit_circle():
    try:
        claims = get_jwt()
        logged_in_user_id = claims['id']

        conn = connect_db()

        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
        
        with conn.cursor() as cur:
            circle_id = request.json.get('circle_id')
            cur.execute("""
                        SELECT * FROM circles
                        WHERE id = %s
                        """, (circle_id,))
            circle = cur.fetchone()

            # check if logged_in_user is host
            if not circle:
                return jsonify({ 'status': 'error', 'msg': 'no circle found' }), 400
            elif logged_in_user_id != circle['host_id']:
                return jsonify({ 'status': 'error', 'msg': 'edit circle unauthorized'}), 403
            
            title = request.json.get('title') or circle['title']
            description = request.json.get('description') or circle['description']
            participants_limit = request.json.get('participants_limit') or circle['participants_limit']
            start_date = request.json.get('start_date') or circle['start_date']

            print(title)
            print(start_date)

            cur.execute("""
                        UPDATE circles
                        SET title = %s, description = %s, participants_limit = %s, start_date = %s
                        WHERE id = %s
                        """, (title, description, participants_limit, start_date, circle_id))
            conn.commit()
        return jsonify({ 'status': 'error', 'msg': 'succesfully edited circle'}), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'unable to edit circle'}), 400

@circles_bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_circle():
    try:
        claims = get_jwt()
        logged_in_user_id = claims['id']
        logged_in_user_role = claims['role']

        conn = connect_db()

        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
        
        with conn.cursor() as cur:
            circle_id = request.json.get('circle_id')
            cur.execute("""
                        SELECT host_id FROM circles
                        WHERE id = %s
                        """, (circle_id,))
            circle = cur.fetchone()

            # check if logged in user is circle host or admin
            if not circle:
                return jsonify({ 'status': 'error', 'msg': 'no circle found' }), 400
            elif logged_in_user_id != circle['host_id'] and logged_in_user_role != 'admin':
                return jsonify({ 'status': 'error', 'msg': 'delete circle unauthorized'}), 403
            
            cur.execute("""
                        DELETE FROM circles
                        WHERE id = %s
                        """, (circle_id,))
            
            conn.commit()
        return jsonify({ 'status': 'ok', 'msg': 'circle deleted'}), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'unable to delete circle'}), 400

# Tags endpoints
@circles_bp.route('/tags', methods=['POST'])
@jwt_required()
def get_tags_by_circle():
    try:
        if request.method == 'POST':
            conn = connect_db()

            if not conn:
                return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404

            with conn.cursor() as cur:
                circle_id = request.json.get('circle_id')
                cur.execute("""
                            SELECT tag FROM circle_tags
                            WHERE circle_id = %s
                            """, (circle_id,))
                results = cur.fetchall()
                data = []
                for tag in results:
                    data.append(tag['tag'])
            return jsonify({ 'status': 'ok', 'msg': 'succesfully fetched tags', 'data': data }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'unable to get tags for circle'}), 400
    
@circles_bp.route('/tags/all')
@jwt_required()
def get_all_tags():
    try:
        conn = connect_db()

        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404

        with conn.cursor() as cur:
            cur.execute("SELECT * FROM tags")
            results = cur.fetchall()
            data = []
            for tag in results:
                data.append(tag['tag'])
        return jsonify({ 'status': 'ok', 'msg': 'succesfully fetched all tags', 'data': data }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'unable to get all tags'}), 400

@circles_bp.route('/tags', methods=['PUT', 'DELETE'])
@jwt_required()
def manage_tags():
    try:
        claims = get_jwt()
        logged_in_user_id = claims['id']

        conn = connect_db()

        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
        
        with conn.cursor() as cur:
            circle_id = request.json.get('circle_id')
            cur.execute("""
                        SELECT host_id FROM circles
                        WHERE id = %s
                        """, (circle_id,))
            circle = cur.fetchone()

            # check if logged_in_user is host
            if not circle:
                return jsonify({ 'status': 'error', 'msg': 'no circle found' }), 400
            elif logged_in_user_id != circle['host_id']:
                return jsonify({ 'status': 'error', 'msg': 'manage tag unauthorized'}), 403

            if request.method == 'PUT':
                for tag in request.json.get('tags'):
                    cur.execute("""
                                INSERT INTO circle_tags(circle_id, tag)
                                VALUES (%s, %s)
                                """, (circle_id, tag))
                conn.commit()
                return jsonify({ 'status': 'ok', 'msg': 'tag(s) added' }), 200
            elif request.method == 'DELETE':
                cur.execute("""
                            DELETE FROM circle_tags
                            WHERE circle_id = %s AND tag = %s
                            """, (circle_id, request.json.get('tag')))
                conn.commit()
                return jsonify({ 'status': 'ok', 'msg': 'tag deleted'}), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'manage tag error'}), 400

# Flags endpoints
@circles_bp.route('/flags', methods=['PUT'])
@jwt_required()
def add_flag():
    try:
        if request.method == 'PUT':
            conn = connect_db()

            if not conn:
                return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404

            with conn.cursor() as cur:
                circle_id = request.json.get('circle_id')
                flag_user_id = request.json.get('flag_user_id')
                cur.execute("""
                            INSERT INTO flags(circle_id, flag_user_id)
                            VALUES (%s, %s)
                            """, (circle_id, flag_user_id))
                conn.commit()
            return jsonify({ 'status': 'ok', 'msg': 'flag successfully created'}), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'unable to add flag'}), 400

@circles_bp.route('/flags', methods=['GET', 'DELETE'])
@jwt_required()
def manage_flags():
    try:
        claims = get_jwt()
        logged_in_user_role = claims['role']

        # check that logged in user is admin
        if logged_in_user_role != 'admin':
            return jsonify({ 'status': 'error', 'msg': 'unauthorized operation'}), 403
        
        conn = connect_db()

        if not conn:
            return jsonify({ 'status': 'error', 'msg': 'cannot access db'}), 404
        
        with conn.cursor() as cur:
            if request.method == 'GET':
                cur.execute("""
                            SELECT circles.*, COUNT(circles.id) AS flag_count FROM circles
	                        JOIN flags ON flags.circle_id = circles.id
                            GROUP BY circles.id
                            ORDER BY flag_count DESC
                            """)
                data = cur.fetchall()
                return jsonify({ 'status': 'ok', 'msg': 'successfully fetched all flagged circles', 'data': data }), 200
            elif request.method == 'DELETE':
                circle_id = request.json.get('circle_id')
                cur.execute("""
                            DELETE FROM flags
                            WHERE circle_id = %s
                            """, (circle_id,))
                conn.commit()
                return jsonify({ 'status': 'ok', 'msg': 'successfully deleted all flags relating to a circle' }), 200
    except:
        return jsonify({ 'status': 'error', 'msg': 'unable to manage flag(s)'}), 400