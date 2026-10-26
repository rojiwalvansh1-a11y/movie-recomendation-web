// Set up API URL
const apiKey = '7cada1bc35d7234ffd9cfdc59a01f791';
const baseUrl = 'https://api.themoviedb.org/3/';
const genreUrl = `${baseUrl}genre/movie/list?api_key=${apiKey}&language=en-US`;

// Elements
const movieInput = document.getElementById('movie-input');
const searchButton = document.getElementById('search-btn');
const recommendationsDiv = document.getElementById('recommendations');
const genreFilter = document.getElementById('genre-filter');
const yearFilter = document.getElementById('year-filter');
const ratingFilter = document.getElementById('rating-filter');

// Load genres and populate genre filter
async function loadGenres() {
    try {
        const response = await fetch(genreUrl);
        const data = await response.json();
        const genres = data.genres;

        // Populate genre select dropdown
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreFilter.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading genres:", error);
    }
}

// Fetch movie data based on search and filters
async function searchMovies() {
    const query = movieInput.value;
    const genre = genreFilter.value;
    const year = yearFilter.value;
    const rating = ratingFilter.value;

    // Construct the search URL
    let searchUrl = `${baseUrl}search/movie?api_key=${apiKey}&query=${query}&language=en-US&page=1&include_adult=false`;

    // Apply filters
    if (genre) searchUrl +=`&with_genres=${genre}`;
    if (year) searchUrl += `&year=${year}`;
    if (rating) searchUrl += `&vote_average.gte=${rating}`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movie data:', error);
        recommendationsDiv.innerHTML = "<p>No results found. Please try again.</p>";
    }
}

// Display movie results
function displayMovies(movies) {
    if (movies.length === 0) {
        recommendationsDiv.innerHTML = "<p>No movies found with these filters. Try something else.</p>";
        return;
    }

    recommendationsDiv.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const movieImage = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=No+Image';

        movieCard.innerHTML = `
            <img src="${movieImage}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Rating: ${movie.vote_average}</p>
        `;

        recommendationsDiv.appendChild(movieCard);
    });
}

// Event listeners
searchButton.addEventListener('click', searchMovies);
movieInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMovies();
});

// Load genres when the page loads
loadGenres();