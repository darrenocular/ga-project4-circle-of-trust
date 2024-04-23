from flask import Flask, jsonify, request
from functools import wraps
from wtforms import Form, StringField, DateField, TextAreaField, PasswordField, validators
import wtforms_json

wtforms_json.init()

def validate_registration(request):
    class RegistrationForm(Form):
        username = StringField('username', [validators.Length(min=4, max=50, message=('invalid number of characters')), validators.InputRequired(message=('field required'))])
        email = StringField('email', [validators.Email(message=('invalid email format')), validators.InputRequired(message=('field required'))])
        password = PasswordField('password', [validators.Length(min=8, max=50, message=('invalid number of characters')), validators.InputRequired('field required')])
        date_of_birth = DateField('date_of_birth', [validators.InputRequired(message=('field required'))])
        bio = TextAreaField('bio', [validators.InputRequired(message=('field required'))])

    form = RegistrationForm.from_json(request.json)
    
    if request.method == 'PUT' and form.validate():
        return None
    else:
        return jsonify({ 'status': 'error', 'msg': form.errors}), 400

def registration_middleware(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        validation_result = validate_registration(request)
        if validation_result is not None:
            return validation_result
        return f(*args, **kwargs)
    return decorated_function