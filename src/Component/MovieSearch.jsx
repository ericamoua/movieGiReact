import React, { useState } from 'react';
import axios from 'axios';

const MovieSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZTRkNzQ5NWQ1MTY2Njk3YWVmZWFhZjQzOWUxZDc4YiIsInN1YiI6IjY2Njc3YTVjNzRhODY3NTllNGU5ZGYzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.T_kWE69THs1-5aVNYr6-zXhjqDxLffHeg9_l8QpBxHI'
        }
    };

    const searchMovie = () => {
        if (!query.trim()) {
            alert('Please enter a movie title.');
            return;
        }

        axios.get(`https://api.themoviedb.org/3/search/movie?query=${(query)}&include_adult=false&language=en-US&page=1`, options)
            .then(response => {
                displayResults(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('Failed to fetch data. Please try again later.');
            });
    };

    const displayResults = (data) => {
        if (data.results && data.results.length > 0) {
            let posterPromises = data.results.map(movie =>
                axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/images`, options)
                    .then(response => {
                        if (response.data.posters && response.data.posters.length > 0) {
                            return response.data.posters[0].file_path;
                        } else {
                            return null;
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching poster for movie:', error);
                        return null;
                    })
            );

            Promise.all(posterPromises)
                .then(posterPaths => {
                    const updatedResults = data.results.map((movie, index) => ({
                        ...movie,
                        posterPath: posterPaths[index]
                    }));
                    setResults(updatedResults);
                })
                .catch(error => {
                    console.error('Error fetching poster paths:', error);
                    setError('Failed to fetch poster paths. Please try again later.');
                });
        } else {
            setResults([]);
            setError('No results found.');
        }
    };

    return (
        <div>
            <div className='input-container'>
            <div>
                <h1 className='search-title'>Movie Search App</h1>
            </div>
            <input
                className="input-container"
                type="text"
                id="searchInput"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button className="input-container" onClick={searchMovie}>Search</button>
            </div>
            <div id="movieResults">
                {error && <p>{error}</p>}
                {results.map(movie => (
                    <div key={movie.id} className="movie">
                        <h2 className="movie-title">{movie.title}</h2>
                        <img
                            className="movie-poster"
                            src={`https://image.tmdb.org/t/p/original${movie.posterPath || ''}`}
                            alt={`${movie.title} Poster`}
                        />
                        <p className="movie-release-date">Release Date: {movie.release_date}</p>
                        <p className="movie-overview">{movie.overview}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieSearch;
