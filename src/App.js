import React, {useEffect, useState} from 'react'
import './App.css'
import Loader from 'react-loader-spinner'

const API_KEY = process.env.REACT_APP_TMDB_API_KEY

const getPopularMoviesURL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
const getTopRatedMoviesURL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
const getUpcomingMoviesURL = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
const searchMoviesURL = (query, page = 1) =>
  `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=${page}`

const App = () => {
  const [popularMovies, setPopularMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [upcomingMovies, setUpcomingMovies] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [apiStatus, setApiStatus] = useState('INITIAL')
  const [activePage, setActivePage] = useState('Popular')

  useEffect(() => {
    fetchMovies(getPopularMoviesURL, setPopularMovies)
    fetchMovies(getTopRatedMoviesURL, setTopRatedMovies)
    fetchMovies(getUpcomingMoviesURL, setUpcomingMovies)
  }, [])

  const fetchMovies = async (url, setState) => {
    setApiStatus('IN_PROGRESS')
    try {
      const response = await fetch(url)
      const data = await response.json()
      setState(data.results)
      setApiStatus('SUCCESS')
    } catch (error) {
      setApiStatus('FAILURE')
      console.error('Error fetching data:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchInput) return
    setApiStatus('IN_PROGRESS')
    try {
      const response = await fetch(searchMoviesURL(searchInput))
      const data = await response.json()
      setSearchResults(data.results)
      setApiStatus('SUCCESS')
    } catch (error) {
      setApiStatus('FAILURE')
      console.error('Error searching data:', error)
    }
  }

  const renderMoviesList = movies => {
    return (
      <ul className='row p-0 ms-0 me-0 mt-3'>
        {movies.map(movie => (
          <li
            key={movie.id}
            className='col-6 col-md-3 col-lg-2 text-center p-2'
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className='img-thumbnail'
            />
            <h3>{movie.title}</h3>
            <p>Rating: {movie.vote_average}</p>
            <button className='btn btn-primary'>View Details</button>
          </li>
        ))}
      </ul>
    )
  }

  const renderContent = () => {
    if (apiStatus === 'IN_PROGRESS') {
      return <Loader type='ThreeDots' color='#000' height={80} width={80} />
    }
    if (apiStatus === 'FAILURE') {
      return <div>Error occurred. Please try again.</div>
    }
    if (apiStatus === 'SUCCESS') {
      switch (activePage) {
        case 'Popular':
          return renderMoviesList(popularMovies)
        case 'Top Rated':
          return renderMoviesList(topRatedMovies)
        case 'Upcoming':
          return renderMoviesList(upcomingMovies)
        default:
          return renderMoviesList(searchResults)
      }
    }
    return null
  }

  return (
    <div className='container'>
      <header>
        <h1>movieDB</h1>
        <h2>Popular</h2>
        <h2>Top Rated</h2>
        <h2>Upcoming</h2>
      </header>
      <div className='search-bar'>
        <input
          type='text'
          placeholder='Search for a movie...'
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {renderContent()}
    </div>
  )
}

export default App
