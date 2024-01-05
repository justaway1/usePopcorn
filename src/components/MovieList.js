import Movie from './Movie'

export default function MovieList ({ movies, onHandleSelectedMovie }) {
  return (
    <ul className='list list-movies'>
      {movies.map(movie => (
        <Movie
          movies={movie}
          key={movie.imdbID}
          onHandleSelectedMovie={onHandleSelectedMovie}
        />
      ))}
    </ul>
  )
}
