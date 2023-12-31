import { useEffect, useState } from 'react'

const tempMovieData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg'
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg'
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg'
  }
]

const tempWatchedData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9
  }
]

const average = arr =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)

const KEY = '7c7fc499'

export default function App () {
  const [movies, setMovies] = useState([])
  const [watched, setWatched] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    async function fetchMovies () {
      setIsLoading(true)
      setError('')

      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        )

        if (!res.ok) throw new Error('Something went wrong!')

        const data = await res.json()

        if (data.Response === 'False') throw new Error(data.Error)
        setMovies(data.Search)
      } catch (error) {
        console.error(error.message)
        setError(error.message)
      }
      setIsLoading(false)
    }
    if (query.length < 3) {
      setMovies([])
      setError('')
      return
    }

    fetchMovies()
  }, [query])

  return (
    <>
      <Nav>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Nav>
      <main className='main'>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          <Summary watched={watched} />
          <WatchedMovieList watched={watched} />
        </Box>
      </main>
    </>
  )
}

function ErrorMessage ({ message }) {
  return (
    <p className='error'>
      <span>⛔</span>
      {message}
    </p>
  )
}

function Loader () {
  return <p className='loader'>Loading...</p>
}
function Logo () {
  return (
    <div className='logo'>
      <span role='img'>🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

function Search ({ query, setQuery }) {
  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  )
}
function NumResults ({ movies }) {
  return (
    <p className='num-results'>
      Found <strong>{movies.length}</strong> results
    </p>
  )
}

function Nav ({ children }) {
  return <nav className='nav-bar'>{children}</nav>
}

function Box ({ children }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen(open => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  )
}

function MovieList ({ movies }) {
  return (
    <ul className='list'>
      {movies.map(movie => (
        <Movie movies={movie} key={movie.imdbID} />
      ))}
    </ul>
  )
}

function Movie ({ movies }) {
  return (
    <li>
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

function Summary ({ watched }) {
  const avgImdbRating = average(watched.map(movie => movie.imdbRating))
  const avgUserRating = average(watched.map(movie => movie.userRating))
  const avgRuntime = average(watched.map(movie => movie.runtime))

  return (
    <div className='summary'>
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}

function WatchedMovieList ({ watched }) {
  return (
    <ul className='list'>
      {watched.map(movie => (
        <WatchedMovie movies={movie} key={movie.imdbID} />
      ))}
    </ul>
  )
}

function WatchedMovie ({ movies }) {
  return (
    <li>
      <img src={movies.Poster} alt={`${movies.Title} poster`} />
      <h3>{movies.Title}</h3>
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
      </div>
    </li>
  )
}
