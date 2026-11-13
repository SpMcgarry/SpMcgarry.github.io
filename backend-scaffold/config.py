"""
Configuration for Career Advocate v2 API
Decoupled backend service intended for Railway.
"""
import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    PORT = int(os.getenv('PORT', 5000))
    # Allow GitHub Pages origins + local testing
    ALLOWED_ORIGINS = [
        "https://spmcgarry.github.io",
        "http://localhost:8000",
        "http://localhost:5000",
        "http://127.0.0.1:8000"
    ]
    KNOWLEDGE_BASE_PATH = os.path.join(basedir, 'knowledge', 'ground_truth_resume.md')
