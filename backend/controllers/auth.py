from flask import Blueprint, jsonify, request, redirect
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from ..db import connect_db
from ..extensions import bcrypt
import datetime

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['PUT'])
def register():
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
                    return jsonify({ 'status': 'error', 'msg': 'duplicate user/email'}), 409
                
                password = request.json.get('password')
                date_of_birth = request.json.get('date_of_birth')
                bio = request.json.get('bio')
                # profile_picture = request.json.get('profile_picture')

                # Check if user is above 18 based on birth year only
                birth_year = date_of_birth.split('-')[0]
                if datetime.date.today().year - int(birth_year) < 18:
                    return jsonify({ 'status': 'error', 'msg': 'user is underaged'}), 403

                hash = bcrypt.generate_password_hash(password)

                cur.execute("""
                            INSERT INTO users(username, email, hash, date_of_birth, bio)
                            VALUES (%s, %s, %s, CAST(%s AS DATE), %s)
                            """, (username, email, hash, date_of_birth, bio))
                conn.commit()

            return jsonify({ 'status': 'ok', 'msg': 'user created'})
    except Exception as error:
        return jsonify({ 'status': 'error', 'msg': error }), 400


@auth_bp.route('/login', methods=['POST'])
def login():
    return 'User log in page'

# @app.route('/api/data', methods=['GET'])
# def get_data():
#     data = {'message': 'Hello from Flask!'}
#     return jsonify(data)