import MidiPlayer from 'react-midi-player'

interface Props {
    Chord: string,
    Notes: string,
    Quality: string,
    Root: string
}

function Chord({ Chord, Notes, Quality, Root } : Props) {
  const PATH : string= "MIDI/";
  const formatted_midi : string = PATH + Chord.replace(/ /g, '_') + ".mid";
  
  // const [midiFile, setMidiFile] = useState<string | null>(null);

  // useEffect(() => {
  //   const formattedChord = Chord.replace(/ /g, '_') + ".mid";
  //   fetch(`/getMidi/${formattedChord}`)
  //     .then(response => response.blob())
  //     .then(blob => {
  //       const url = URL.createObjectURL(blob);
  //       setMidiFile(url);
  //     });
  // }, []);

  return (
    <>
      <div className='col'>
      <div className='card mt-3 mx-1 shadow p-3 my-2 rounded' style={{backgroundColor: "#FEEDF0"}}>      
          <div className="card-body">
              <h4 className="card-title"><span>{ Quality === "other" ? "" : Quality } { Root } </span></h4>
              <p className="card-text"> Full Name: { Chord } </p>
              <p><span className="card-text"> { Notes } </span></p>
              <MidiPlayer src={formatted_midi}/>
              <a className="btn btn-primary">More Details</a>
          </div>
      </div>  
      </div>
    </>
  )
}

export default Chord
