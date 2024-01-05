import { useEffect, useState } from 'react'
// Custom HOOKS
import { useMovies } from './useMovies'
import { useLocalStorageState } from './useLocalStorageState'
// COMPONENTS
import Search from './components/Search'
import MovieList from './components/MovieList'
import MovieDetails from './components/MovieDetails'
import WatchedMovieList from './components/WatchedMovieList'
// UI COMPONENTS
import Logo from './UI/Logo'
import Loader from './UI/Loader'
import ErrorMessage from './UI/ErrorMessage'
import Nav from './UI/Nav'
import Box from './UI/Box'
import Summary from './UI/Summary'
import NumResults from './UI/NumResults'

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

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched))
  }, [watched])

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
