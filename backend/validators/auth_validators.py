from flask import Flask, jsonify, request
from functools import wraps
from wtforms import Form, StringField, DateField, TextAreaField, PasswordField, validators
import wtforms_json

wtforms_json.init()

def validate_registration(request):
    class RegistrationForm(Form):
        username = StringField('username', [validators.Length(min=4, max=25, message=('invalid number of characters')), validators.InputRequired(message=('field required'))])
        email = StringField('email', [validators.Length(min=6, max=35, message=('invalid number of characters')), validators.Email(message=('invalid email format')), validators.InputRequired(message=('field required'))])
        password = PasswordField('password', [validators.Length(min=8, max=25, message=('invalid number of characters')), validators.InputRequired('field required')])
        date_of_birth = DateField('date_of_birth', [validators.InputRequired(message=('field required'))])
        bio = TextAreaField('bio', [validators.Length(max=200, message=('invalid number of characters'))])

    form = RegistrationForm.from_json(request.json)
    
    if request.method == 'PUT' and form.validate():
        # If the form is submitted and data is valid, continue to the next middleware or view function
        return None
    else:
        # If validation fails, return a redirect response to the registration page with the form and error messages
        return jsonify({ 'status': 'error', 'msg': form.errors}), 400

def registration_middleware(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        validation_result = validate_registration(request)
        if validation_result is not None:
            return validation_result
        return f(*args, **kwargs)
    return decorated_function