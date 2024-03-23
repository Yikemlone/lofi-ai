interface Props {
    Chord: string,
    Notes: string,
    Quality: string,
    Root: string
}

function Chord({ Chord, Notes, Quality, Root } : Props) {
  return (
    <>
      <div className='card mt-3 ml-5'>      
          <div className="card-body">
              <h4 className="card-title"> { Quality === "other" ? "" : Quality } { Root } </h4>
              <p className="card-text"> Full Name: { Chord } </p>
              <p className="card-text"> { Notes } </p>
              <a className="btn btn-primary">More Details</a>
          </div>
      </div>  
    </>
  )
}

export default Chord
