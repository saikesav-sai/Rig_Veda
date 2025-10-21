from flask import Blueprint, jsonify, request
from middleware import require_api_key

from .llm_handler import get_answer

chat_bot = Blueprint("chat_bot", __name__)


@chat_bot.route("/api/chat/intent", methods=["POST"])
@require_api_key
def chat_intent():
    query = request.get_json().get("query", "")
    if not query:
        return jsonify({"error": "Missing query"}), 400

    result = get_answer(query)
    return jsonify(result)

@chat_bot.route("/api/chat/", methods=["GET"])
def home():
    return "Welcome to the Chat Bot API"
