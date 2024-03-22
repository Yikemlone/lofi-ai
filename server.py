from flask import Flask, request, jsonify
from lofi_ai.predict import ChordGenerator
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

ai_model = ChordGenerator()
ai_model.init()

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    chord_qty = int(request.args.get('chord_qty'))
    chords = ai_model.generate_chords(chord_qty)
    return jsonify(chords)

    # scale_key = request.args.get('scale_key')