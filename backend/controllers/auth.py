from flask import Blueprint, jsonify, request, redirect
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, get_jwt
from ..db import connect_db
from ..extensions import bcrypt
from ..validators.auth_validators import registration_middleware
import datetime

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# Register admin (only from backend)
@auth_bp.route('/register/admin', methods=['PUT'])
def register_admin():
    try:
        if request.method == 'PUT':
            conn = connect_db()
            username = request.json.get('username')
            email = request.json.get('email')

            if not conn:
                raise Exception('unable to connect to db')
            
            with conn.cursor() as cur:
                # check for existing user
                cur.execute("""
                            SELECT * FROM users
                            WHERE username=%s OR email=%s
                            """, (username, email))
                
                if cur.fetchone():
                    return jsonify({ 'status': 'error', 'msg': 'duplicate username/email'}), 409
                
                password = request.json.get('password')
                date_of_birth = request.json.get('date_of_birth')
                bio = request.json.get('bio')
                # profile_picture = request.json.get('profile_picture')

                # Check if user is above 18 based on birth year only
                birth_year = date_of_birth.split('-')[0]
                if datetime.date.today().year - int(birth_year) < 18:
                    return jsonify({ 'status': 'error', 'msg': 'user is underaged'}), 403

                hash = bcrypt.generate_password_hash(password).decode('utf-8')

                cur.execute("""
                            INSERT INTO users(username, email, hash, date_of_birth, bio, role)
                            VALUES (%s, %s, %s, CAST(%s AS DATE), %s, 'admin')
                            """, (username, email, hash, date_of_birth, bio))
                conn.commit()

            return jsonify({ 'status': 'ok', 'msg': 'admin created'}), 200
    except Exception as error:
        return jsonify({ 'status': 'error', 'msg': error }), 400

@auth_bp.route('/register', methods=['PUT'])
@registration_middleware
def register():
    try:
        if request.method == 'PUT':
            conn = connect_db()
            username = request.json.get('username')
            email = request.json.get('email')

            if not conn:
                raise Exception('unable to connect to db')
            
            with conn.cursor() as cur:
                # check for duplicate user
                cur.execute("""
                            SELECT * FROM users
                            WHERE username=%s OR email=%s
                            """, (username, email))
                
                if cur.fetchone():
                    return jsonify({ 'status': 'error', 'msg': 'duplicate username/email'}), 409
                
                password = request.json.get('password')
                date_of_birth = request.json.get('date_of_birth')
                bio = request.json.get('bio')
                # profile_picture = request.json.get('profile_picture')

                # Check if user is above 18 based on birth year only
                birth_year = date_of_birth.split('-')[0]
                if datetime.date.today().year - int(birth_year) < 18:
                    return jsonify({ 'status': 'error', 'msg': 'user is underaged'}), 403

                hash = bcrypt.generate_password_hash(password).decode('utf-8')

                cur.execute("""
                            INSERT INTO users(username, email, hash, date_of_birth, bio)
                            VALUES (%s, %s, %s, CAST(%s AS DATE), %s)
                            """, (username, email, hash, date_of_birth, bio))
                conn.commit()

            return jsonify({ 'status': 'ok', 'msg': 'user created'}), 200
    except Exception as error:
        return jsonify({ 'status': 'error', 'msg': error }), 400


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        if request.method == 'POST':
            conn = connect_db()
            username = request.json.get('username')

            if not conn:
                raise Exception('unable to connect to db')
            
            with conn.cursor() as cur:
                # check for existing user
                cur.execute("""
                            SELECT * FROM users
                            WHERE username=%s OR email=%s
                            """, (username, username))
                
                existing_user = cur.fetchone()
                if not existing_user:
                    return jsonify({ 'status': 'error', 'msg': 'invalid credentials'}), 401
                
                # compare hash using bcrypt
                password = request.json.get('password')
                is_valid = bcrypt.check_password_hash(existing_user['hash'], password)

                if not is_valid:
                    return jsonify({ 'status': 'error', 'msg': 'invalid credentials'}), 401
                
                additional_claims = {
                    'id': existing_user['id'],
                    'role': existing_user['role']
                }
                access_token = create_access_token(identity=username, additional_claims=additional_claims, fresh=True)
                refresh_token = create_refresh_token(identity=username, additional_claims=additional_claims)
                return jsonify(access_token=access_token, refresh_token=refresh_token), 200
    except Exception as error:
        return jsonify({ 'status': 'error', 'msg': error }), 400
    

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    try:
        identity = get_jwt_identity()
        claims = get_jwt()
        additional_claims = {
            'id': claims['id'],
            'role': claims['role']
        }
        access_token = create_access_token(identity=identity, additional_claims=additional_claims, fresh=False)
        return jsonify(access_token=access_token), 200
    except Exception as error:
        return jsonify({ 'status': 'error', 'msg': error})