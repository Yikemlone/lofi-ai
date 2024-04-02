import os
from flask import Flask, request, jsonify, send_from_directory
from lofi_ai.predict import ChordGenerator
from flask_cors import CORS, cross_origin
# from flask import send_file
from dotenv import load_dotenv

app = Flask(__name__, static_folder='react/build', static_url_path='')
CORS(app)
load_dotenv()

flask_env = os.getenv('FLASK_ENV')
app.config["FLASK_ENV"] = flask_env

ai_model = ChordGenerator()
ai_model.set_up()

@app.route('/api/predict', methods=['GET', 'POST'])
@cross_origin()
def predict():  
    print('Predicting chords...')
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

@app.route('/midi/<filename>')
def send_midi(filename):
    return send_from_directory('midi_files', filename, as_attachment=False, mimetype='audio/midi')

@app.route('/test')
def test():
    return "Test"

@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run()