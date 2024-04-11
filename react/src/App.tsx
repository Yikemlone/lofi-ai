import { useState } from 'react'
import Chord from './Chord';
import axios from 'axios'
import './index.css'
import MidiPlayer from 'react-midi-player'
import Nav from './Nav';
import { scroller, Element } from 'react-scroll';

interface ChordsJSON {
  chord: string,
  notes: string,
  quality: string,
  root: string
}


function App() {
  const [chords, setChords] = useState<ChordsJSON[]>([]);
  const [chordQty, setChordQty] = useState(4);
  const [scaleKey, setChordKey] = useState('e_major_scale');
  const [isBusy, setIsBusy] = useState(false);
  const [scaleImage, setScaleImg] = useState("scales/e_major_scale_open.png");
  const [instrument, setInstrument] = useState("guitar");
  
  const getChords = async () => {
    scroller.scrollTo('generatingChords', {
      duration: 300,
      delay: 0,
      smooth: 'easeInOutQuart'
    });

    setIsBusy(true);
    axios.get<ChordsJSON[]>(`/api/predict?chord_qty=${chordQty}&user_scale=${scaleKey}&instrument=${instrument}`)
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

  const handleInstrumentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const inputValue = (e.target as HTMLSelectElement).value;
    console.log(inputValue);
    setInstrument(inputValue);
  }

  return (
    <>
      <Nav/>

      <div className="card shadow rounded mx-auto px-5 py-5" style={{width: '60%'}}>
        <label htmlFor="chord-qty" className="form-label my-2">Chord Quantity: {chordQty}</label>
        <input type="range" value={chordQty} className="form-range my-2" min="1" max="16" step="1" 
          id="chord-qty" onChange={(e) => handleChordQtyChange(e)}  >
        </input>
        <label htmlFor="instrument" className="form-label my-2">Select Instrument</label>
        <select className="form-select my-2" id="instrument"
          aria-label="Instrument" onChange={(e) => handleInstrumentChange(e)}>
            <option value={"guitar"}>Guitar</option>
            <option value="electric_guitar">Electric Guitar</option>
            <option value="secret">Secret</option>
        </select>
        <label htmlFor="chord-key" className="form-label my-2">Select Chord Scale</label>
        <select className="form-select my-2" id="chord-key"
          aria-label="Chord Key" onChange={(e) => handleChordKeyChange(e)}>
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
          <button className='btn btn-none border mt-5 px-5' onClick={getChords} disabled={isBusy}>Get chords</button>
        </div>     
      </div>

      {isBusy ? <Element name="generatingChords"><div className='mx-auto px-5 py-5 text-center'><h1>Generating chords...</h1></div></Element>: <Element name="generatingChords"></Element>}

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
                Notes={chord.notes} Scale={scaleKey} />
            ))}
          </div>
        </div>
      }
    </>
  )
}

export default App