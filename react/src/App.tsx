import { useState } from 'react'
import Chord from './Chord';
import axios from 'axios'
import './index.css'
import MidiPlayer from 'react-midi-player'

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

  const getChords = async () => {
    axios.get<ChordsJSON[]>(`http://localhost:5000/predict?chord_qty=${chordQty}&user_scale=${chordKey}`)
    .then((response) => {
      setChords(response.data)
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

    <div className="d-flex flex-column mt-0">
      <label htmlFor="chord-qty" className="form-label">Chord Quantity: {chordQty} </label>

      <input type="range" value={chordQty} className="form-range" min="1" max="16" step="1" 
        id="chord-qty" onChange={(e) => handleChordQtyChange(e)}></input>

      <label htmlFor="chord-key" className="form-label">Select Chord Key</label>
      <select className="form-select" id="chord-key"
        aria-label="Default select example" onChange={(e) => handleChordKeyChange(e)}>
          <option value={"e_major_scale"}>E Major</option>
          <option value="a_major_scale">A Major</option>
          <option value="d_major_scale">D Major</option>
          <option value="g_major_scale">G Major</option>
          <option value="c_major_scale">C Major</option>
          <option value="e_minor_scale">E Minor</option>
          <option value="a_minor_scale">A Minor</option>
          <option value="d_minor_scale">D Minor</option>
          <option value="g_minor_scale">G Minor</option>
          <option value="c_minor_scale">C Minor</option>
      </select>

      <button className='btn btn-primary mt-3' onClick={getChords}>Get chords</button>

      {chords.length === 0 ? <p></p> : ''}
      {chords.length === 0 ? "" : <MidiPlayer src={"MIDI/all_chords.mid"}/> }
      {chords.map((chord: ChordsJSON, index: number) => (
        <Chord key={index} Chord={chord.chord} Root={chord.root} Quality={chord.quality} 
          Notes={chord.notes} />
      ))}
    </div>
  )
}

export default App