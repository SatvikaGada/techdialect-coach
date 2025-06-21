from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import tempfile
import random
from pymongo import MongoClient
from urllib.parse import quote_plus
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Whisper model (load once)
model = whisper.load_model("base")
username = quote_plus(os.getenv("MONGO_USERNAME"))
password = quote_plus(os.getenv("MONGO_PASSWORD"))

MONGO_URI = f"mongodb+srv://{username}:{password}@techdialect-cluster.rhy1kiz.mongodb.net/?retryWrites=true&w=majority&appName=techdialect-cluster"
client = MongoClient(MONGO_URI)
db = client["techdialect"]
collection = db["questions"]

@app.route('/question', methods=['GET'])
def get_random_question():
    questions = list(collection.find({}, {'_id': 0}))
    if not questions:
        return jsonify({"error": "No questions found"}), 404
    random_question = random.choice(questions)
    return jsonify(random_question)

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    audio = request.files["audio"]
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio:
        audio.save(temp_audio.name)
        result = model.transcribe(temp_audio.name)
        return jsonify({"transcript": result["text"]})

if __name__ == '__main__':
    app.run(debug=True, port=8000)
