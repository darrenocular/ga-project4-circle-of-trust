from flask import Flask, jsonify, request
from functools import wraps
from wtforms import Form, StringField, validators
import wtforms_json

wtforms_json.init()

def validate_thread(request):
    class ThreadForm(Form):
        title = StringField('title', [validators.Length(max=255, message=('exceeds character limit for title')), validators.InputRequired(message=('field required'))])
    
    form = ThreadForm.from_json(request.json)

    if request.method in ['PUT', 'PATCH'] and form.validate():
        return None
    else:
        return jsonify({ 'status': 'error', 'msg': form.errors }), 406

def validate_thread_middleware(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        validation_result = validate_thread(request)
        if validation_result is not None:
            return validation_result
        return f(*args, **kwargs)
    return decorated_function