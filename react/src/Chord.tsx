interface Props {
    ChordDetails: string
}

function Chord({ ChordDetails } : Props) {
  return (
    <>
      <div className='card mt-3 ml-5'>      
          <div className="card-body">
              <h5 className="card-title">{ChordDetails}</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a className="btn btn-primary">More Details</a>
          </div>
      </div>  
    </>
  )
}

export default Chord
