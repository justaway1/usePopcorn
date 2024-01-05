import { useState, useEffect } from 'react'
const KEY = '7c7fc499'

export function useMovies (query) {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    async function fetchMovies () {
      setIsLoading(true)
      setError('')

      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal }
        )

        if (!res.ok) throw new Error('Something went wrong!')

        const data = await res.json()

        if (data.Response === 'False') throw new Error(data.Error)
        setMovies(data.Search)
        setError('')
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
    // handleCloseMovie()
    fetchMovies()
    return () => {
      controller.abort()
      console.log('Aborted')
    }
  }, [query])

  return { movies, isLoading, error }
}
