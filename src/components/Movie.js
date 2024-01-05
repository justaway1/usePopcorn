export default function Movie ({ movies, onHandleSelectedMovie }) {
  return (
    <li onClick={() => onHandleSelectedMovie(movies.imdbID)}>
      <img src={movies.Poster} alt={`${movies.Title} poster`} />
      <h3>{movies.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movies.Year}</span>
        </p>
      </div>
    </li>
  )
}
