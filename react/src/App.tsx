import { useState } from 'react'
import Chord from './Chord';
import axios from 'axios'
import './index.css'

function App() {
  const [chords, setChords] = useState([]);
  const [chordQty, setChordQty] = useState(1);
  const [chordKey, setChordKey] = useState('E');

  const getChords = async () => {
    axios.get(`http://localhost:5000/predict?chord_qty=${chordQty}&chord_key=${chordKey}`)
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
          <option defaultValue={"E"}>E</option>
          <option value="A">A</option>
          <option value="D">D</option>
          <option value="G">G</option>
          <option value="C">C</option>
      </select>

      <button className='btn btn-primary mt-3' onClick={getChords}>Get chords</button>

      {chords.length === 0 ? <p></p> : ''}
      {chords.map((chord, index) => (
        <Chord key={index} ChordDetails={chord} />
      ))}
    </div>
  )
}

export default App
