from flask import Flask, request, jsonify
from lofi_ai.predict import ChordGenerator
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

ai_model = ChordGenerator()
ai_model.set_up()

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    chord_qty = int(request.args.get('chord_qty'))
    scale_key = request.args.get('scale_key')
    chords = ai_model.generate_chords(chord_qty) # Add scale_key as an argument later
    return jsonify(chords)
