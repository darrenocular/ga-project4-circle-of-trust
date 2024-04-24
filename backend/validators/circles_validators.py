from flask import Flask, jsonify, request
from functools import wraps
from wtforms import Form, StringField, DateTimeField, IntegerField, TextAreaField, validators
import wtforms_json

wtforms_json.init()

def validate_add_circle(request):
    class AddCircleForm(Form):
        title = StringField('title', [validators.Length(max=100, message=('exceeds character limit for title')), validators.InputRequired(message=('field required'))])
        description = TextAreaField('description', [validators.InputRequired(message=('field required'))])
        participants_limit = IntegerField('participants_limit', [validators.NumberRange(min=0, max=250, message=('invalid participants limit'))])
        start_date = DateTimeField('start_date', [validators.InputRequired(message=('input required'))])
    
    form = AddCircleForm.from_json(request.json)

    if request.method == 'PUT' and form.validate():
        return None
    else:
        return jsonify({ 'status': 'error', 'msg': form.errors}), 406

def add_circle_middleware(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        validation_result = validate_add_circle(request)
        if validation_result is not None:
            return validation_result
        return f(*args, **kwargs)
    return decorated_function

def validate_update_circle(request):
    class UpdateCircleForm(Form):
        title = StringField('title', [validators.Length(max=100, message=('exceeds character limit for title'))])
        participants_limit = IntegerField('participants_limit', [validators.Optional(), validators.NumberRange(min=0, max=250, message=('invalid participants limit'))])
    
    form = UpdateCircleForm.from_json(request.json)

    if request.method == 'PATCH' and form.validate():
        return None
    else: 
        return jsonify({ 'status': 'error', 'msg': form.errors}), 406

def update_circle_middleware(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        validation_result = validate_update_circle(request)
        if validation_result is not None:
            return validation_result
        return f(*args, **kwargs)
    return decorated_function
    