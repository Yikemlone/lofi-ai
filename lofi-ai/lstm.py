""" This file contains the LSTM model for the lofi-ai project with data preparation and training functions"""
import glob
import pickle
import numpy
from music21 import converter, instrument, note, chord, tablature
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import Dropout
from keras.layers import LSTM
from keras.layers import Activation
from keras.layers import BatchNormalization as BatchNorm
from keras.utils import to_categorical
from keras.callbacks import ModelCheckpoint
import tensorflow as tf
from keras.layers import Bidirectional

# Prepare data
def prepare_data():
    """ Parses all chords from MIDI files and writes them to a binary file"""
    chords = []

    for file in glob.glob("lofi_ai/midi_songs/*.mid"):
        midi = converter.parse(file)

        print("Parsing %s" % file)

        chord_to_parse = None

        s2 = instrument.partitionByInstrument(midi)
        chord_to_parse = s2.parts[0].recurse() 
        fret_board = tablature.ChordWithFretBoard('E')

        # Change instrument to guitar
        for element in chord_to_parse:
            if isinstance(element, note.Note):
                print(element.nameWithOctave)
            elif isinstance(element, chord.Chord):
                print(element.orderedPitchClasses)
                print(element.normalOrder)
                print("Chord:", ' '.join(n.nameWithOctave for n in element.notes))

        # Appending the chords to the notes list.
        for element in chord_to_parse:
            if isinstance(element, chord.Chord):
                chords.append('.'.join(str(n) for n in element.normalOrder))

        # chord2 = [int(note) for note in pattern.split('.')]
        # c = chord.Chord(chord2)
        
    # Write the notes to binary file
    with open('lofi_ai/data/chords.bin', 'wb') as file:
        file.write(pickle.dumps(chords))
                
    return chords

def prepare_sequences(chords, number_of_chords):
    """ Prepare the sequences used by the Neural Network """
    sequence_length = 100

    # Sort all the unique chords
    chords_sorted = sorted(set(item for item in chords))

    # Create a dictionary to match chords to ints   
    # Enumerates the chords EX: 000: '0', 001: '0.1.3.5.8', 002: '0.2', etc
    chord_to_int = dict((chord, number) for number, chord in enumerate(chords_sorted)) 

    network_input = [] # What I am training on
    network_output = [] # What I am predicting
    
    # Create input sequences and the corresponding outputs
    for i in range(0, len(chords) - sequence_length, 1):
        sequence_in = chords[i:i + sequence_length] # A range of 100 chords
        sequence_out = chords[i + sequence_length] # A single digit, being the next chord in the sequence
        network_input.append([chord_to_int[char] for char in sequence_in]) # Appends the sequence of 100 chords to the input as chars // HOW?
        network_output.append(chord_to_int[sequence_out]) # Appends the next chord in the sequence to the output as a char

    n_patterns = len(network_input)

    # reshape the input into a format compatible with LSTM layers
    network_input = numpy.reshape(network_input, (n_patterns, sequence_length, 1)) 

    # Normalizes the input to be between 0 and 1, so that it can be easier to train with
    network_input = network_input / float(number_of_chords)

    # Pads 0s in the array
    network_output = to_categorical(network_output) 

    return (network_input, network_output)

def create_network(network_input, number_of_chords):
    """ Create the structure of the neural network """
    model = Sequential()  # Create a sequential model

    # Add a bidirectional LSTM layer with 512 units
    model.add(Bidirectional(LSTM(
        512, # Number of units/nodes per layer
        input_shape=(network_input.shape[1], network_input.shape[2]), # Shape of the input data
        recurrent_dropout=0.3, # 30% of the recurrent connections will be dropped to prevent overfitting
        return_sequences=True # Return output to the next layer
    )))

    # Add another bidirectional LSTM layer with 512 units 
    model.add(Bidirectional(LSTM(512, return_sequences=True, recurrent_dropout=0.3)))

    # Add a bidirectional LSTM layer with 512 units
    # - This layer does not have return_sequences=True, so it will output a single vector
    model.add(Bidirectional(LSTM(512)))
    model.add(BatchNorm())  # Add a batch normalization layer
    model.add(Dropout(0.3))  # Add a dropout layer with a dropout rate of 30%
    model.add(Dense(256))  # Add a fully connected dense layer with 256 units
    model.add(Activation('relu'))  # Add a ReLU activation function
    model.add(BatchNorm())  # Add another batch normalization layer
    model.add(Dropout(0.3))  # Add another dropout layer with a dropout rate of 30%
    model.add(Dense(number_of_chords))  # Add a fully connected dense layer with n_vocab units
    model.add(Activation('softmax'))  # Add a softmax activation function
    model.compile(loss='categorical_crossentropy', optimizer='rmsprop')  # Compile the model with categorical crossentropy loss and rmsprop optimizer

    return model

def train(model, intput, output):
    """ Train the neural network """
    # Filepath were the weights will be saved
    filepath = "lofi_ai/weights/weights-improvement-{epoch:02d}-{loss:.4f}-bigger.hdf5"

    # Checkpoint to save the best weights
    checkpoint = ModelCheckpoint(
        filepath,
        monitor='loss',
        verbose=0,
        save_best_only=True,
        mode='min'
    )

    # List of callbacks to be used in the training
    callbacks_list = [checkpoint]

    # Train the model
    model.fit(intput, output, epochs=400, batch_size=64, callbacks=callbacks_list) 
    # Changed size of network because of memory issues. Was 128 before

def train_network():  
    """ Prepare data, sequences and train the network"""
    notes = prepare_data() 
    number_of_chords = len(set(notes))
    intput, output = prepare_sequences(notes, number_of_chords)
    model = create_network(intput, number_of_chords)
    train(model, intput, output)

if __name__ == "__main__":
    train_network()
    print("Training complete")