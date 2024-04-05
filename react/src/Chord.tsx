import MidiPlayer from 'react-midi-player'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'

interface Props {
    Chord: string,
    Notes: string,
    Quality: string,
    Root: string
}

function Chord({ Chord, Notes, Quality, Root } : Props) {
  const PATH : string= "midi/";
  const formatted_midi : string = PATH + Chord.replace(/ /g, '_').replace("#", "_sharp_") + ".mid";
  
  return (
    <>
      <div className='col'>
      <div className='card mt-3 mx-1 shadow p-3 my-2 rounded' style={{backgroundColor: "#FEEDF0"}}>      
          <div className="card-body mx-auto">

              <h4 className="card-title"> { Quality === "other" ? "" : Quality } { Root } Chord</h4>
              <MidiPlayer src={formatted_midi}/>

              <Popup  trigger={<button className="btn btn-primary">More Details</button>} modal>
                <div className="px-5 py-5">
                  <h4 className="card-title">{ Quality === "other" ? "" : Quality } { Root } Chord</h4>
                  <p className="card-text"> Full Name: { Chord } </p>
                  <p><span className="card-text"><b>Notes</b> - { Notes }</span></p>
                  <p><MidiPlayer src={formatted_midi}/></p>
                  <button className='btn btn-secondary'>Download MIDI</button>
                </div>
              </Popup>

          </div>
      </div>  
      </div>
    </>
  )
}

export default Chord
