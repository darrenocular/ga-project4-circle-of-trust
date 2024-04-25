from flask import Flask, jsonify, request
from functools import wraps
from wtforms import Form, TextAreaField, validators
import wtforms_json

wtforms_json.init()

def validate_comment(request):
    class CommentForm(Form):
        comment = TextAreaField('comment', [validators.InputRequired(message=('field required'))])
    
    form = CommentForm.from_json(request.json)

    if request.method in ['PUT', 'PATCH'] and form.validate():
        return None
    else:
        return jsonify({ 'status': 'error', 'msg': form.errors }), 406

def validate_comment_middleware(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        validation_result = validate_comment(request)
        if validation_result is not None:
            return validation_result
        return f(*args, **kwargs)
    return decorated_function