import StarRating from '../StarRating'
import { useState, useEffect, useRef } from 'react'
import { useKey } from '../useKey'
import Loader from '../UI/Loader'

const KEY = '7c7fc499'

export default function MovieDetails ({
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

  useKey('Escape', onHandleCloseMovie)

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
