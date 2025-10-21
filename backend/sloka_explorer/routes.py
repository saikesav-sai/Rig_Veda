import json,os,requests
from io import BytesIO
from flask import Blueprint, abort, jsonify, send_file
from middleware import require_api_key

veda_bp = Blueprint("veda_bp", __name__)
BASE_PATH = f"data/dataset"

# GitHub raw content base URL for audio files
GITHUB_AUDIO_BASE_URL = "https://raw.githubusercontent.com/saikesav-sai/rig_veda_audio_files/main"

# Optional: Local cache directory for downloaded audio files
CACHE_DIR = os.path.join(os.path.dirname(__file__), "..", "cache", "audio")
os.makedirs(CACHE_DIR, exist_ok=True)

def load_index():
    index_path = os.path.join(BASE_PATH, 'rig_veda_index.json')
    with open(index_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_mandala(mandala_num):
    mandala_path = os.path.join(BASE_PATH, f'mandala_{mandala_num}.json')
    try:
        with open(mandala_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return None


@veda_bp.route('/api/index/<int:mandala_num>')
@require_api_key
def get_index_for_mandala(mandala_num):
    index = load_index()
    mandalas = index.get('mandalas', [])
    mandala_info = next((m for m in mandalas if m['mandala_number'] == mandala_num), None)
    if not mandala_info:
        abort(404, description="Mandala not found in index")
    
    hymns_summary = []
    for hymn in mandala_info.get('hymns', []):
        hymns_summary.append({
            'hymn_number': hymn.get('hymn_number'),
            'total_stanzas': hymn.get('total_slokas') 
        })
    return jsonify({
        'mandala': mandala_num,
        'total_hymns': len(mandala_info.get('hymns', [])),
        'hymns': hymns_summary
    })
 
@veda_bp.route('/api/sloka/<int:mandala_num>/<int:hymn_num>/<int:stanza_num>')
@require_api_key
def get_sloka(mandala_num, hymn_num, stanza_num):
    mandala_data = load_mandala(mandala_num)
    if not mandala_data:
        abort(404, description="Mandala data not found")
    
    hymn = next((h for h in mandala_data.get('hymns', []) if h['hymn_number'] == hymn_num), None)
    if not hymn:
        abort(404, description="Hymn not found")

    stanza = next((s for s in hymn.get('stanzas', []) if s['stanza_number'] == stanza_num), None)
    if not stanza:
        abort(404, description="Stanza not found")

    return jsonify(stanza)

@veda_bp.route('/api/audio/<int:mandala_num>/<int:hymn_num>/<int:stanza_num>')
def get_audio(mandala_num, hymn_num, stanza_num):
    """
    Serve audio files from GitHub repository with local caching
    """
    audio_filename = f"Stanza_{stanza_num}.mp3"
    github_path = f"{GITHUB_AUDIO_BASE_URL}/{mandala_num}/Hymn_{hymn_num}/{audio_filename}"
    
    cache_file_path = os.path.join(CACHE_DIR, str(mandala_num), f"Hymn_{hymn_num}", audio_filename)
    
    if os.path.exists(cache_file_path):
        return send_file(cache_file_path, mimetype='audio/mpeg')
    
    # Otherwise, fetch from GitHub
    try:
        response = requests.get(github_path, timeout=10)
        
        if response.status_code == 404:
            return jsonify({
                'error': 'Audio file not found',
                'mandala': mandala_num,
                'hymn': hymn_num,
                'stanza': stanza_num,
                'github_url': github_path
            }), 404
        
        response.raise_for_status()
        
        os.makedirs(os.path.dirname(cache_file_path), exist_ok=True)
        with open(cache_file_path, 'wb') as f:
            f.write(response.content)
        
        return send_file(
            BytesIO(response.content),
            mimetype='audio/mpeg',
            as_attachment=False,
            download_name=audio_filename
        )
        
    except requests.RequestException as e:
        return jsonify({
            'error': 'Failed to fetch audio file from GitHub',
            'details': str(e),
            'github_url': github_path
        }), 500

