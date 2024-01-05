import WatchedMovie from './WatchedMovie'

export default function WatchedMovieList ({ watched, onHandleDeleteMovies }) {
  return (
    <ul className='list'>
      {watched.map(movie => (
        <WatchedMovie
          movies={movie}
          key={movie.imdbID}
          onHandleDeleteMovies={onHandleDeleteMovies}
        />
      ))}
    </ul>
  )
}
