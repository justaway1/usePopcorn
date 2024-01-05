export default function WatchedMovie ({ movies, onHandleDeleteMovies }) {
  return (
    <li>
      <img src={movies.poster} alt={`${movies.title} poster`} />
      <h3>{movies.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movies.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movies.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movies.runtime} min</span>
        </p>
        <button
          className='btn-delete'
          onClick={() => onHandleDeleteMovies(movies.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  )
}
