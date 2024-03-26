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
    user_scale = request.args.get('user_scale')
    chords = ai_model.generate_chords(chord_qty, user_scale)
    detailed_chords = ai_model.prepare_chords(chords)
    return jsonify(detailed_chords)
