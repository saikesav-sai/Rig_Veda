import os
from functools import wraps
from flask import jsonify, request
def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        valid_api_key = os.getenv('API_KEY')
        
        if not valid_api_key:
            return jsonify({
                'error': 'Server configuration error',
                'message': 'API key not configured on server'
            }), 500
        
        provided_api_key = request.headers.get('X-API-Key')
        
        if not provided_api_key:
            return jsonify({
                'error': 'Authentication required',
                'message': 'API key is missing from request headers'
            }), 401
        
        if provided_api_key != valid_api_key:
            return jsonify({
                'error': 'Authentication failed',
                'message': 'Invalid API key'
            }), 403
        
        return f(*args, **kwargs)
    
    return decorated_function
