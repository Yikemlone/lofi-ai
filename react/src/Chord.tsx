import MidiPlayer from 'react-midi-player'

interface Props {
    Chord: string,
    Notes: string,
    Quality: string,
    Root: string
}

function Chord({ Chord, Notes, Quality, Root } : Props) {
  const PATH : string= "MIDI/";
  const formatted_midi : string = PATH + Chord.replaceAll(' ', '_') + ".mid";

  return (
    <>
      <div className='card mt-3 ml-5'>      
          <div className="card-body">
              <h4 className="card-title"> { Quality === "other" ? "" : Quality } { Root } </h4>
              <p className="card-text"> Full Name: { Chord } </p>
              <p className="card-text"> { Notes } </p>
              <MidiPlayer src={formatted_midi}/>
              <a className="btn btn-primary">More Details</a>
          </div>
      </div>  
    </>
  )
}

export default Chord
