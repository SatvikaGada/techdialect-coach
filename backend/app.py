from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import tempfile

app = Flask(__name__)
CORS(app)

# Load Whisper model once when the server starts
model = whisper.load_model("base")

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
