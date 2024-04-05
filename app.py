import os
from flask import Flask, request, jsonify, send_from_directory
from lofi_ai.predict import ChordGenerator
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv

# Initialize the Flask app
app = Flask(__name__, static_folder='react/build', static_url_path='')
CORS(app)
load_dotenv()

# Set the Flask environment
flask_env = os.getenv('FLASK_ENV')
app.config["FLASK_ENV"] = flask_env

# Initialize the AI model
ai_model = ChordGenerator()
ai_model.set_up()

@app.route('/api/predict', methods=['GET', 'POST'])
@cross_origin()
def predict():  
    """ Generate chords and return the details to the user as JSON """
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
@cross_origin()
def send_midi(filename):
    """ Send the MIDI file to the user """
    return send_from_directory('midi', filename, as_attachment=True, mimetype='audio/midi')

@app.route('/')
@cross_origin()
def serve():
    """ Serve the React app"""
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='172.26.136.249', port=5000, debug=False)