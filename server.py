from flask import Flask, request, jsonify
from lofi_ai.predict import ChordGenerator
from flask_cors import CORS
from flask import send_file

app = Flask(__name__)
CORS(app)

ai_model = ChordGenerator()
ai_model.set_up()

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    # Get user inputs
    chord_qty = int(request.args.get('chord_qty'))
    user_scale = request.args.get('user_scale')
    # Generate chords
    chords = ai_model.generate_chords(chord_qty, user_scale)
    # Create MIDI files
    ai_model.create_midi(chords)
    # Prepare detailed chords
    detailed_chords = ai_model.prepare_chords(chords)
    # Return the detailed chords
    return jsonify(detailed_chords)


@app.route('/midi', methods=['GET'])
def send_midi():
    # Send the MIDI file as a response
    return send_file('test_output.mid', mimetype='audio/midi', as_attachment=False)