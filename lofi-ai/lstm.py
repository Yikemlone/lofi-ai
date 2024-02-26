""" This file contains the LSTM model for the lofi-ai project with data preparation and training functions"""
import glob
import pickle
import numpy
from music21 import converter, instrument, note, chord
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

# Testing if GPU is available
# print(tf.test.gpu_device_name())

# Prepare data
def prepare_data():
    """ Prepares all of the midi files for training on the LSTM model"""
    notes = []

    for file in glob.glob("midi_songs/*.mid"):
        midi = converter.parse(file)

        print("Parsing %s" % file)

        notes_to_parse = None

        # Need to understand this
        try: # file has instrument parts
            s2 = instrument.partitionByInstrument(midi)
            notes_to_parse = s2.parts[0].recurse() 
        except: # file has notes in a flat structure
            notes_to_parse = midi.flat.notes

        # Appending the chords to the notes list. May need to rename
        for element in notes_to_parse:
            if isinstance(element, chord.Chord):
                notes.append('.'.join(str(n) for n in element.normalOrder))
                # notes.append(element.normalOrder)
                # print(element.normalOrder) # Array of notes in chord
                # print(element.commonName) # Gives gives chord name

    # Write the notes to binary file
    with open('data/chords.bin', 'wb') as file:
        file.write(pickle.dumps(notes))
                
    return notes

def prepare_sequences(notes, n_vocab):
    """ Prepare the sequences used by the Neural Network """
    sequence_length = 100

    # get all pitch names
    pitchnames = sorted(set(item for item in notes))

    # create a dictionary to match chords to ints   
    note_to_int = dict((note, number) for number, note in enumerate(pitchnames)) # Enumerates the chords EX: 000: '0', 001: '0.1.3.5.8', 002: '0.2', etc

    network_input = [] # What I am training on
    network_output = [] # What I am predicting
    
    # create input sequences and the corresponding outputs
    for i in range(0, len(notes) - sequence_length, 1):
        sequence_in = notes[i:i + sequence_length] # A range of 100 chords
        sequence_out = notes[i + sequence_length] # Should be a single diget, being the next chord in the sequence
        network_input.append([note_to_int[char] for char in sequence_in]) # Appends the sequence of 100 chords to the input as chars // HOW?
        network_output.append(note_to_int[sequence_out]) # Appends the next chord in the sequence to the output as a char

    n_patterns = len(network_input)

    # reshape the input into a format compatible with LSTM layers
    network_input = numpy.reshape(network_input, (n_patterns, sequence_length, 1)) 

    # normalize input
    network_input = network_input / float(n_vocab) # allows for more efficient training. 
    # Normalizes the input to be between 0 and 1, so that it can be easier to train with

    network_output = to_categorical(network_output) # Pads 0s to the left

    return (network_input, network_output) # Makese more sense now

def create_network(network_input, n_vocab):
    """ create the structure of the neural network """
    print(network_input.shape[1], network_input.shape[2])

    model = Sequential()
    model.add(Bidirectional(LSTM(
        512,
        input_shape=(network_input.shape[1], network_input.shape[2]),
        recurrent_dropout=0.3,
        return_sequences=True
    )))
    model.add(Bidirectional(LSTM(512, return_sequences=True, recurrent_dropout=0.3)))
    model.add(Bidirectional(LSTM(512)))
    model.add(BatchNorm())
    model.add(Dropout(0.3))
    model.add(Dense(256))
    model.add(Activation('relu'))
    model.add(BatchNorm())
    model.add(Dropout(0.3))
    model.add(Dense(n_vocab))
    model.add(Activation('softmax'))
    model.compile(loss='categorical_crossentropy', optimizer='rmsprop')
    
    print(tf.test.gpu_device_name())

    return model

notes = prepare_data() 
n_vocab = len(set(notes))
intput, output = prepare_sequences(notes, n_vocab)
model = create_network(intput, n_vocab)

filepath = "weights-improvement-{epoch:02d}-{loss:.4f}-bigger.hdf5"
checkpoint = ModelCheckpoint(
    filepath,
    monitor='loss',
    verbose=0,
    save_best_only=True,
    mode='min'
)
callbacks_list = [checkpoint]

model.fit(intput, output, epochs=400, batch_size=128, callbacks=callbacks_list)