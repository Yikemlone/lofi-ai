import { useState } from 'react'
import MidiPlayer from 'react-midi-player'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'

interface Props {
    Chord: string,
    Notes: string,
    Quality: string,
    Root: string,
    Scale: string
}

const SCALES = {
  'e_major_scale': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#', 'E'], 
  'a_major_scale': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#', 'A'], 
  'd_major_scale': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#', 'D'], 
  'g_major_scale': ['G', 'A', 'B', 'C', 'D', 'E', 'F#', 'G'], 
  'c_major_scale': ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'], 
  'e_minor_scale': ['E', 'F#', 'G', 'A', 'B', 'C', 'D', 'E'], 
  'a_minor_scale': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'A'], 
  'd_minor_scale': ['D', 'E', 'F', 'G', 'A', 'B-', 'C', 'D'], 
  'g_minor_scale': ['G', 'A', 'B-', 'C', 'D', 'E-', 'F', 'G'], 
  'c_minor_scale': ['C', 'D', 'E-', 'F', 'G', 'A-', 'B-', 'C'], 
}

function Chord({ Chord, Notes, Quality, Root, Scale} : Props) {
  const PATH : string= "midi/";
  const formatted_midi : string = PATH + Chord.replace(/ /g, '_').replace("#", "_sharp_") + ".mid";
  const formatted_scale : string = Scale.replace(/_/g, ' ');
  const [openNotes, setOpenNotes] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openRoot, setOpenRoot] = useState(false);

  return (
    <div className='col d-flex justify-content-center'>
      <div className='card mt-3 mx-1 shadow p-3 my-2 rounded' style={{backgroundColor: "#FEEDF0"}}>      
          <div className="card-body mx-auto">

              <h4 className="card-title"> { Quality === "other" ? "" : Quality } { Root } Chord</h4>
              <p><MidiPlayer src={formatted_midi}/></p>

              <button className="btn btn-primary" onClick={() => setOpenDetails(true)}>More Details</button>
              <Popup open={openDetails} closeOnDocumentClick={false} onClose={() => setOpenDetails(false)} modal>
                <div className="px-5 py-5">

                  <h4 className="card-title">{ Quality === "other" ? "" : Quality } { Root } Chord</h4>
                   
                  <p className="card-text"> Full Name: { Chord } 
                    <button className="btn btn-outline-primary mx-1" onClick={() => setOpenRoot(true)}>?</button>
                    <Popup open={openRoot} closeOnDocumentClick={false} onClose={() => setOpenRoot(false)} modal>
                      <div className="mx-5 px-5 py-5">
                        <p>This is a {Root} Chord, because {Root} is the lowest in pitch note in the chord.</p>
                        <button onClick={() => setOpenRoot(false)} className="btn btn-danger mx-1">Close</button>
                      </div>
                    </Popup>
                  </p>

                  <p><span className="card-text"><b>Notes</b> - { Notes }</span>
                    <button className="btn btn-outline-primary mx-1" onClick={() => setOpenNotes(true)}>?</button>
                    <Popup open={openNotes} closeOnDocumentClick={false} onClose={() => setOpenNotes(false)} modal>
                      <div className="mx-5 px-5 py-5">
                        <p>This chord is in the key of <b style={{fontWeight:"bolder"}}>{formatted_scale}</b> because all of the notes are within the scale.</p>
                        <p>The {formatted_scale} contains all these notes:</p> 
                        <p>{(SCALES as any)[Scale].join(' ')}</p>
                        <p>These are the notes in the chord: {Notes}</p>
                        <button onClick={() => setOpenNotes(false)} className="btn btn-danger mx-1">Close</button>
                      </div>
                    </Popup>
                  </p>

                  <p><MidiPlayer src={formatted_midi}/></p>

                  <a href={formatted_midi} download>
                    <button className="btn btn-secondary">Download MIDI</button>
                  </a>
                  
                  <br></br>

                  <button className="btn btn-danger mt-3" onClick={() => setOpenDetails(false)}>Close</button>
                </div>
              </Popup>
          </div>
      </div>  
    </div>
  )
}


export default Chord; 