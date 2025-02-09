const OMDB_API_KEY = '9086674e';  
const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const JIKAN_BASE_URL = 'https://api.jikan.moe/v4/anime';

async function getMoviesOrSeries(mood, type) {
    let url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${mood}&type=${type}`;
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data.Search || []; 
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        return [];
    }
}

async function getIMDbDetails(imdbID) {
    let url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=short`;
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching IMDb details:", error);
        return null;
    }
}

async function getAnimeByMood(mood) {
    let url = `${JIKAN_BASE_URL}?q=${mood}&limit=10`;
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data.data || []; 
    } catch (error) {
        console.error("Error fetching anime:", error);
        return [];
    }
}

async function suggestEntertainment() {
    let mood = document.getElementById("moodSelect").value;
    let resultDiv = document.getElementById("result");
    
    resultDiv.innerHTML = "";

    let movies = await getMoviesOrSeries(mood, "movie");
    let series = await getMoviesOrSeries(mood, "series");
    let anime = await getAnimeByMood(mood);

    resultDiv.innerHTML += "<h2>🎬 Movies</h2>";
    if (movies.length === 0) resultDiv.innerHTML += "<p>No movies found for this mood.</p>";
    for (let item of movies.slice(0, 10)) {
        let details = await getIMDbDetails(item.imdbID);
        if (details) {
            resultDiv.innerHTML += `
                <a href="https://www.imdb.com/title/${details.imdbID}/" target="_blank" class="suggestion">
                    <img src="${details.Poster}" alt="Poster">
                    <p><strong>${details.Title}</strong> (${details.Year})</p>
                    <p>⭐ IMDb: ${details.imdbRating || "N/A"}</p>
                    <p>🎭 Genre: ${details.Genre}</p>
                </a>
            `;
        }
    }

    resultDiv.innerHTML += "<h2>📺 Series</h2>";
    if (series.length === 0) resultDiv.innerHTML += "<p>No series found for this mood.</p>";
    for (let item of series.slice(0, 10)) {
        let details = await getIMDbDetails(item.imdbID);
        if (details) {
            resultDiv.innerHTML += `
                <a href="https://www.imdb.com/title/${details.imdbID}/" target="_blank" class="suggestion">
                    <img src="${details.Poster}" alt="Poster">
                    <p><strong>${details.Title}</strong> (${details.Year})</p>
                    <p>⭐ IMDb: ${details.imdbRating || "N/A"}</p>
                    <p>🎭 Genre: ${details.Genre}</p>
                </a>
            `;
        }
    }

    resultDiv.innerHTML += "<h2>🎥 Anime</h2>";
    if (anime.length === 0) resultDiv.innerHTML += "<p>No anime found for this mood.</p>";
    anime.forEach(animeItem => {
        resultDiv.innerHTML += `
            <a href="${animeItem.url}" target="_blank" class="suggestion">
                <img src="${animeItem.images.jpg.image_url}" alt="Anime Poster">
                <p><strong>${animeItem.title}</strong> (${animeItem.year || "N/A"})</p>
                <p>⭐ Score: ${animeItem.score || "N/A"}</p>
                <p>🎭 Genre: ${animeItem.genres.map(g => g.name).join(', ') || "N/A"}</p>
            </a>
        `;
    });
}