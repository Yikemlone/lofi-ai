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

// const scaleImages : any = {
//   "e_major_scale": 'public/scales/e-major-scale.png',
//   "a_major_scale": 'Scales/a-major-scale.png',
//   "d_major_scale": 'Scales/d-major-scale.png',
//   "g_major_scale": 'Scales/g-major-scale.png',
//   "c_major_scale": 'Scales/c-major-scale.png',
//   "e_minor_scale": 'Scales/e-minor-scale.png',
//   "a_minor_scale": 'Scales/a-minor-scale.png',
//   "d_minor_scale": 'Scales/d-minor-scale.png',
//   "g_minor_scale": 'Scales/g-minor-scale.png',
//   "c_minor_scale": 'Scales/c-minor-scale.png'
// }

function App() {
  const [chords, setChords] = useState<ChordsJSON[]>([]);
  const [chordQty, setChordQty] = useState(4);
  const [chordKey, setChordKey] = useState('e_major_scale');
  const [isBusy, setIsBusy] = useState(false);
  const [scaleImage, setScaleImg] = useState("scales/e_major_scale_open.png");

  const getChords = async () => {
    setIsBusy(true);
    axios.get<ChordsJSON[]>(`/api/predict?chord_qty=${chordQty}&user_scale=${chordKey}`)
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
    setScaleImg(`scales/${inputValue + "_open"}.png`);
  }

  return (
    <>
      <Nav/>

      <div className="card shadow rounded mx-auto px-5 py-5" style={{width: '60%'}}>

        <label htmlFor="chord-qty" className="form-label my-2">Chord Quantity: {chordQty}</label>
        <input type="range" value={chordQty} className="form-range my-2" min="1" max="16" step="1" 
          id="chord-qty" onChange={(e) => handleChordQtyChange(e)}  >
        </input>

        <label htmlFor="chord-key" className="form-label my-2">Select Chord Scale</label>
        <select className="form-select my-2" id="chord-key"
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

        <div className="mx-auto pt-3" style={{width: "300px"}}>
          <img src={scaleImage} style={{width: "300px", height:"400px"}} className="mx-auto img-fluid w-100" alt='Scale'/>
        </div>

        <div className="d-flex justify-content-center ">
          <button className='btn btn-none border mt-5 px-5'onClick={getChords} disabled={isBusy}>Get chords</button>
        </div>
        
      </div>

      {isBusy ? <div className='mx-auto px-5 py-5 text-center'><h2>Generating chords...</h2></div>: ""}

      { chords.length === 0 ? '' :  
        <div className='card shadow rounded px-5 py-5 mx-5 my-5'>

          {/* Header */}
          {chords.length === 0 ? '' : <h1 className='mb-5 mx-auto'>Chords generated</h1>}

          {chords.length === 0 ? "" : 
          <>
            <h4>
              All Chords:
              <span className='mx-3'><MidiPlayer src={"midi/all_chords.mid"}/></span>
            </h4>
          </>
          } 

          <div className='row'>
            {/* Chords */}
            {chords.map((chord: ChordsJSON, index: number) => (
              <Chord key={index} Chord={chord.chord} Root={chord.root} Quality={chord.quality} 
                Notes={chord.notes} />
            ))}
          </div>
        </div>
      }
    </>
  )
}

export default App