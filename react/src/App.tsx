import { useState } from 'react'
import Chord from './Chord';
import axios from 'axios'
import './index.css'
import MidiPlayer from 'react-midi-player'
import Nav from './Nav';

interface ChordsJSON {
  chord: string,
  notes: string,
  quality: string,
  root: string
}

function App() {
  const [chords, setChords] = useState<ChordsJSON[]>([]);
  const [chordQty, setChordQty] = useState(1);
  const [chordKey, setChordKey] = useState('e_major_scale');
  const [isBusy, setIsBusy] = useState(false);

  const getChords = async () => {
    setIsBusy(true);
    axios.get<ChordsJSON[]>(`http://localhost:5000/predict?chord_qty=${chordQty}&user_scale=${chordKey}`)
    .then((response) => {
      setChords(response.data)
      setIsBusy(false);
    })
  }

  const handleChordQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = (e.target as HTMLInputElement).value;
    const parsedValue = parseInt(inputValue);
    if (!isNaN(parsedValue)) {
      setChordQty(parsedValue);
    }
  }

  const handleChordKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const inputValue = (e.target as HTMLSelectElement).value;
    setChordKey(inputValue);
  }

  return (
    <>
      <Nav/>

      <div className="d-flex flex-column mt-0 border mx-auto" style={{width: '50%'}}>
        <label htmlFor="chord-qty" className="form-label">Chord Quantity: <span>{chordQty}</span></label>

        <input type="range" value={chordQty} className="form-range" min="1" max="16" step="1" 
          id="chord-qty" onChange={(e) => handleChordQtyChange(e)}>
        </input>

        <label htmlFor="chord-key" className="form-label">Select Chord Scale</label>
        <select className="form-select" id="chord-key"
          aria-label="Default select example" onChange={(e) => handleChordKeyChange(e)}>
            <option value={"e_major_scale"}>E Major Scale</option>
            <option value="a_major_scale">A Major Scale</option>
            <option value="d_major_scale">D Major Scale</option>
            <option value="g_major_scale">G Major Scale</option>
            <option value="c_major_scale">C Major Scale</option>
            <option value="e_minor_scale">E Minor Scale</option>
            <option value="a_minor_scale">A Minor Scale</option>
            <option value="d_minor_scale">D Minor Scale</option>
            <option value="g_minor_scale">G Minor Scale</option>
            <option value="c_minor_scale">C Minor Scale</option>
        </select>

        <div className="d-flex justify-content-center">
          <button className='btn btn-light mt-3' style={{ width: '20%' }} onClick={getChords} disabled={isBusy}>Get chords</button>
        </div>
        {isBusy ? <p className='mt-5 mx-auto'>Generating chords...</p> : ""}
        
      </div>

      <div className='mt-5 border'>
        {/* Header */}
        {chords.length === 0 ? <p></p> : <h1>Chords generated using {chordKey.replaceAll("_", " ")}.</h1>}

        {/* MIDI Player */}
        {chords.length === 0 ? "" : 
        <>
          <p>
            Listen to all chords:
          </p>
          <MidiPlayer src={"MIDI/all_chords.mid"}/>
        </>
        }

        {/* Chords */}
        {chords.map((chord: ChordsJSON, index: number) => (
          <Chord key={index} Chord={chord.chord} Root={chord.root} Quality={chord.quality} 
            Notes={chord.notes} />
        ))}
      </div>
    </>
  )
}

export default App