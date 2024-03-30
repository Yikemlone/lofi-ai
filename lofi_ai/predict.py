import pickle
import numpy
from music21 import instrument, note, stream, chord
from keras.models import Sequential
from keras.layers import Dense, Activation, LSTM, Dropout, Bidirectional, BatchNormalization as BatchNorm

SCALES = {
    'e_major_scale': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#', 'E'],
    'c_major_scale': ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'],
    'g_major_scale': ['G', 'A', 'B', 'C', 'D', 'E', 'F#', 'G'],
    'd_major_scale': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#', 'D'],
    'a_major_scale': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#', 'A'],
    'e_minor_scale': ['E', 'F#', 'G', 'A', 'B', 'C', 'D', 'E'],
    'c_minor_scale': ['C', 'D', 'E-', 'F', 'G', 'A-', 'B-', 'C'],
    'g_minor_scale': ['G', 'A', 'B-', 'C', 'D', 'E-', 'F', 'G'],
    'd_minor_scale': ['D', 'E', 'F', 'G', 'A', 'B-', 'C', 'D'],
    'a_minor_scale': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'A']
}


class ChordGenerator:

    def __init__(self):
        self.chords = []
        self.chord_names = []
        self.number_of_chords = 0
        self.network_input = []
        self.normalized_input = []
        self.model = None


    def load_notes(self):
        with open('lofi_ai/data/chords.bin', 'rb') as filepath:
            self.chords = pickle.load(filepath)
        self.chord_names = sorted(set(item for item in self.chords))
        self.number_of_chords = len(set(self.chords))

    def prepare_sequences(self):
        """ Prepare the sequences used by the Neural Network """
        sequence_length = 50

        # Create a dictionary to match chords to ints   
        chord_to_int = dict((note, number) for number, note in enumerate(self.chord_names))

        for i in range(0, len(self.chords) - sequence_length, 1):
            sequence_in = self.chords[i:i + sequence_length]
            self.network_input.append([chord_to_int[char] for char in sequence_in])

        n_patterns = len(self.network_input)
        # Reshape the input into a format compatible with LSTM layers
        self.normalized_input = numpy.reshape(self.network_input, (n_patterns, sequence_length, 1))
        # Normalizes the input to be between 0 and 1
        self.normalized_input = self.normalized_input / float(self.number_of_chords)

    def create_network(self):
        """ create the structure of the neural network """
        self.model = Sequential()
        self.model.add(Bidirectional(LSTM(
            512,
            input_shape=(self.normalized_input.shape[1], self.normalized_input.shape[2]),
            return_sequences=True
        )))
        self.model.add(Bidirectional(LSTM(
            512, 
            return_sequences=True, 
        )))
        self.model.add(Bidirectional(LSTM(512)))
        self.model.add(BatchNorm())
        self.model.add(Dropout(0.3))
        self.model.add(Dense(256))
        self.model.add(BatchNorm())
        self.model.add(Dropout(0.3))
        self.model.add(Dense(self.number_of_chords))
        self.model.add(Activation('softmax'))
        self.model.compile(loss='categorical_crossentropy', optimizer='rmsprop')

        self.model.predict(numpy.random.random((1, self.normalized_input.shape[1], self.normalized_input.shape[2])))
        self.model.load_weights('lofi_ai/weights/weights-improvement-400-0.0005-bigger.hdf5')

    def generate_chords(self, user_chord_qty, user_scale):
        """ Generate notes from the neural network based on a sequence of notes """
        # Pick a random sequence from the input as a starting point for the prediction
        start = numpy.random.randint(0, len(self.network_input)-1)

        int_to_note = dict((number, note) for number, note in enumerate(self.chord_names))
        pattern = self.network_input[start]

        chords = []
        total_tries = 0

        while len(chords) < user_chord_qty:
            # Get chord prediction
            prediction_input = numpy.reshape(pattern, (1, len(pattern), 1))
            prediction_input = prediction_input / float(self.number_of_chords)
            prediction = self.model.predict(prediction_input, verbose=0)
            
            index = numpy.argmax(prediction) # Get the index of the highest probability
            result = int_to_note[index] # Get the chord from the index
            parsed_chord = chord.Chord(result) # Parse the chord
 
            # Get chord's notes and remove pitch from the chord
            all_notes = [n.nameWithOctave for n in parsed_chord.notes] 
            all_notes = [note[:-1] for note in all_notes]
            
            if all(note in SCALES[user_scale] for note in all_notes):
                chords.append(parsed_chord)

            # Shift the pattern over by one
            pattern.append(index)
            pattern = pattern[1:len(pattern)]

            total_tries += 1
            
            # Prevent infinite loop if stuck
            if total_tries > 200:
                break
        
        return chords
    
    def create_midi(self, chords):
        """ Convert the output from the prediction to notes and create a midi file
            from the notes """
        offset = 0
        output_chords = []
        chord_durration = 'whole'
        
        for c in chords:
            c.duration.type = chord_durration
            output_chords.append(c)

        # Generate a MIDI file for each chord
        for c in output_chords:      
            formatted_chord_name = c.pitchedCommonName.replace(' ', '_')
            midi_stream = stream.Stream([instrument.ElectricGuitar(), c])
            midi_stream.write('midi', fp=f'react/public/MIDI/{formatted_chord_name}.mid')
            midi_stream.write('musicxml', fp=f'react/public/MIDI-XML/{formatted_chord_name}.xml')
        
        all_chords_output = []

        for c in chords:
            new_chord = chord.Chord(c, type=chord_durration)
            new_chord.offset = offset
            all_chords_output.append(new_chord)
            offset += 4

        # Create all the chords in a single MIDI file
        all_chords_output.insert(0, instrument.ElectricGuitar())  
        midi_stream = stream.Stream(all_chords_output)
        midi_stream.write('midi', fp='react/public/MIDI/all_chords.mid')

    def prepare_chords(self, chords):
        """Prepare the chords with extra details for JSON serialization"""
        detailed_chords = []
        for chord in chords:
            chord_data = {}
            chord_data['chord'] = chord.pitchedCommonName
            chord_data['notes'] = ' '.join(n.nameWithOctave for n in chord.notes)
            chord_data['root'] = chord.root().nameWithOctave
            chord_data['quality'] = chord.quality
            detailed_chords.append(chord_data)
        return detailed_chords

    def set_up(self):
        self.load_notes()
        self.prepare_sequences()
        self.create_network()

if __name__ == '__main__':
    chord_generator = ChordGenerator()
    chord_generator.set_up()
    chords = chord_generator.generate_chords(4, 'e_major_scale')
    chord_generator.create_midi(chords)
    detailed_chords = chord_generator.prepare_chords(chords)