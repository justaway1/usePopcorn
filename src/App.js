import { useEffect, useState, useRef } from 'react'
import StarRating from './StarRating'
import { useMovies } from './useMovies'
import { useLocalStorageState } from './useLocalStorageState'

const KEY = '7c7fc499'

const average = arr =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)

export default function App () {
  const [watched, setWatched] = useLocalStorageState([], 'watched')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const { movies, isLoading, error } = useMovies(query)

  function handleSelectedMovie (id) {
    setSelectedId(selectedId => (selectedId === id ? null : id))
  }

  function handleCloseMovie () {
    setSelectedId(null)
  }

  function handleAddWatched (movie) {
    setWatched(watched => [...watched, movie])
  }

  function handleDeleteMovies (id) {
    setWatched(watchedMovies => watchedMovies.filter(m => m.imdbID !== id))
  }

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
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onHandleSelectedMovie={handleSelectedMovie}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onHandleCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onHandleDeleteMovies={handleDeleteMovies}
              />
            </>
          )}
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
  const inputEl = useRef(null)

  useEffect(() => {
    function callBack (e) {
      if (document.activeElement === inputEl.current) return
      if (e.code === 'Enter') {
        inputEl.current.focus()
        setQuery('')
      }
    }
    document.addEventListener('keydown', callBack)

    return () => document.removeEventListener('keydown', callBack)
  }, [setQuery])

  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={e => setQuery(e.target.value)}
      ref={inputEl}
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

function MovieList ({ movies, onHandleSelectedMovie }) {
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

function Movie ({ movies, onHandleSelectedMovie }) {
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
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}

function MovieDetails ({
  selectedId,
  onHandleCloseMovie,
  onAddWatched,
  watched
}) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState('')

  const countRating = useRef(0)

  useEffect(() => {
    if (userRating) countRating.current += 1
  }, [userRating])

  const {
    Year: year,
    Title: title,
    Poster: poster,
    Plot: plot,
    Runtime: runtime,
    imdbRating,
    Released: released,
    Genre: genre,
    Actors: actors,
    Director: director
  } = movie

  const isAlreadyWatched = watched.some(m => m.imdbID === selectedId)
  const ratedUserRating = watched.find(m => m.imdbID === selectedId)?.userRating

  function handleAddWatched () {
    const watchedMovie = {
      imdbID: selectedId,
      year,
      title,
      poster,
      userRating,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      countRating: countRating.current
    }

    onAddWatched(watchedMovie)

    onHandleCloseMovie()
  }

  useEffect(() => {
    function callBack (e) {
      if (e.code === 'Escape') {
        onHandleCloseMovie()
        console.log('Closing!')
      }
    }
    document.addEventListener('keydown', callBack)
    return () => {
      document.removeEventListener('keydown', callBack)
    }
  }, [onHandleCloseMovie])

  useEffect(() => {
    if (!title) return
    document.title = `Movie | ${title}`
    return () => {
      document.title = `usePopcorn`
    }
  }, [title])

  useEffect(() => {
    async function fetchMovieDetails () {
      setIsLoading(true)
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      )
      const data = await res.json()
      setMovie(data)
      setIsLoading(false)
    }
    fetchMovieDetails()
  }, [selectedId])
  return (
    <div className='details'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className='btn-back' onClick={onHandleCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of the ${movie} movie`} />
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <span>⭐{imdbRating} IMDb Rating</span>
            </div>
          </header>
          <section>
            <div className='rating'>
              {isAlreadyWatched ? (
                <p>
                  Already Rated with {ratedUserRating} <span>⭐</span>
                </p>
              ) : (
                <StarRating
                  maxRating={10}
                  size={24}
                  color='yellow'
                  onSetRating={setUserRating}
                />
              )}
              {userRating > 0 && (
                <button className='btn-add' onClick={handleAddWatched}>
                  + add to list
                </button>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  )
}

function WatchedMovieList ({ watched, onHandleDeleteMovies }) {
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

function WatchedMovie ({ movies, onHandleDeleteMovies }) {
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
