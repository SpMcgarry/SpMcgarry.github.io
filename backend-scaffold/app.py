"""
Career Advocate v2 Microservice Application Factory
"""
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from agents.career_advocate_v2 import CareerAdvocateV2

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for GitHub Pages and local test runners
    CORS(app, resources={r"/api/*": {"origins": Config.ALLOWED_ORIGINS}}, supports_credentials=False)

    # Initialize Advocate Agent
    advocate = CareerAdvocateV2(Config.KNOWLEDGE_BASE_PATH)

    @app.route('/healthz', methods=['GET'])
    def healthz():
        """Lightweight health check for Railway and frontend uptime probing"""
        return jsonify({
            'status': 'healthy',
            'service': 'career-advocate-v2',
            'agent_ready': advocate.client is not None
        }), 200

    @app.route('/api/v2/chat', methods=['POST'])
    def chat_v2():
        """
        Career Advocate chat endpoint.
        Zero server retention: no databases, no logs of conversation contents.
        """
        data = request.get_json(silent=True) or {}
        message = data.get('message', '').strip()
        history = data.get('history', [])

        if not message:
            return jsonify({'success': False, 'error': 'No message provided'}), 400

        try:
            answer = advocate.respond(message, chat_history=history)
            return jsonify({
                'success': True,
                'response': answer
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
