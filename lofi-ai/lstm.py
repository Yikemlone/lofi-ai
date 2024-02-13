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

# Testing if GPU is available
print(tf.test.gpu_device_name())

# Prepare data
def prepare_data():
    """ Prepares all of the midi files for training on the LSTM model"""
    notes = []

    for file in glob.glob("midi_songs/*.mid"):
        midi = converter.parse(file)

        print("Parsing %s" % file)

        notes_to_parse = None

        # try: # file has instrument parts
        s2 = instrument.partitionByInstrument(midi)
        notes_to_parse = s2.parts[0].recurse() 
        # except: # file has notes in a flat structure
        #     notes_to_parse = midi.flat.notes

        for element in notes_to_parse:
            # if isinstance(element, note.Note):
            #     notes.append(str(element.pitch))
            if isinstance(element, chord.Chord):
                notes.append('.'.join(str(n) for n in element.normalOrder))
            # elif isinstance(element, note.Rest):
            #     notes.append('r')


    # with open('data/notes', 'wb') as filepath:
    #     pickle.dump(notes, filepath)
    print(notes)
    return notes

    pass 

prepare_data()