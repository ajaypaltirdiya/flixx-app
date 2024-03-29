const global = {
    currentPage:window.location.pathname,
}

function showSpiner(){
    document.querySelector('.spinner').classList.add('show')
}
function hideSpiner(){
    document.querySelector('.spinner').classList.remove('show');
}

async function fetchApiData(endpoint){
    showSpiner()
    const API_KEY = '528578cd41mshb795a75df9dbe02p1b5be0jsnbcbbf5baf55c';
    const API_URL = 'https://movies-api14.p.rapidapi.com/';

    const response = await fetch(`${API_URL}${endpoint}`,{
        method:'GET',
        headers: {
            'X-RapidAPI-Key': '528578cd41mshb795a75df9dbe02p1b5be0jsnbcbbf5baf55c',
            'X-RapidAPI-Host': 'movies-api14.p.rapidapi.com'
        }
    });
    const data = await response.json();
    hideSpiner()
    return data
}



async function displayPopularMovies(){
    const {movies:results} = await fetchApiData('movies');
    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
          <a href="movie-details.html?id=${movie._id}">
            ${movie.poster_path ?
                `<img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
              />`:`<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="Movie Title"
            />`}
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
        `;

        document.querySelector('#popular-movies').appendChild(div)
    })
}

async function displayPopularTvShows(){
    const {movies:results} = await fetchApiData('shows');

    results.forEach(show => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
          <a href="tv-details.html?id=${show._id}">
            ${show.poster_path ?
                `<img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.title}"
              />`:`<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="show Title"
            />`}
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${show.first_air_date}</small>
            </p>
          </div>
        `;

        document.querySelector('#popular-shows').appendChild(div)
    })
}

async function displayMovieDetails(){
const location = window.location.search;
const id = location.split('=')[1];

const {movie,similarMovies} = await fetchApiData(`movie/${id}`)
const div = document.createElement('div');
document.querySelector('.movie_show_backDrop').style.backgroundImage = `url(${movie.backdrop_path})`

div.innerHTML = `
<div class="details-top">
          <div>
            <img
              src="${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${parseInt(movie.vote_average)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
            ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${movie.genres.map(genre => `<li>${genre}</li>`).join(',')}
            </ul>
            <a href="${movie.youtube_trailer}" target="_blank" class="btn">Watch Trailer</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Similar Movies</h2>
        </div>
`;
similarMovies.slice(0,4).forEach(movie => {
    const similarMovieDiv = document.createElement('div');
    similarMovieDiv.classList.add('card')
    similarMovieDiv.innerHTML = `
            <a href="movie-details.html?id=${movie._id}">
                ${movie.poster_path ?
                    `<img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    class="card-img-top"
                    alt="${movie.title}"
                  />`:`<img
                  src="../images/no-image.jpg"
                  class="card-img-top"
                  alt="Movie Title"
                />`}
              </a>
              <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                  <small class="text-muted">Release: ${movie.release_date}</small>
                </p>
              </div>
    `;

    document.querySelector('#similar-movies').appendChild(similarMovieDiv)
})


document.querySelector('#movie-details').appendChild(div)

}

async function displayTvShowDetails(){
    const location = window.location.search;
    const id = location.split('=')[1];
    const {show,similarMovies} = await fetchApiData(`show/${id}`)
    const div = document.createElement('div');
    
    document.querySelector('.show_show_backDrop').style.backgroundImage = `url(${show.backdrop_path})`
    
    div.innerHTML = `
    <div class="details-top">
              <div>
                <img
                  src="${show.poster_path}"
                  class="card-img-top"
                  alt="${show.title}"
                />
              </div>
              <div>
                <h2>${show.title}</h2>
                <p>
                  <i class="fas fa-star text-primary"></i>
                  ${parseInt(show.vote_average)} / 10
                </p>
                <p class="text-muted">Release Date: ${show.release_date}</p>
                <p>
                ${show.overview}
                </p>
                <h5>Genres</h5>
                <ul class="list-group">
                ${show.genres.map(genre => `<li>${genre}</li>`).join(',')}
                </ul>
                <a href="${show.youtube_trailer}" target="_blank" class="btn">Watch Trailer</a>
              </div>
            </div>
           
    `;
   
    document.querySelector('#show-details').appendChild(div)
    
 }

 async function nowPlayingMovies(){
    const nowPlayingMovies = await fetchApiData('home');
    let newMovie = nowPlayingMovies[1].movies
    newMovie.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('swiper-slide');
        div.innerHTML =`
        <a href="movie-details.html?id=${movie._id}">
              <img src="${movie.poster_path}" alt="${movie.title}" />
        </a>
        `;
        document.querySelector('.swiper-wrapper').appendChild(div)

        initSwiper()
    })
 }

 function initSwiper(){
    const swiper = new Swiper('.swiper', {
        spaceBetween: 30,
        slidesPerView: 1,
        freeMode:true,
        loop: true,
        autoPlay:{
            delay:5000,
            disableOnInteraction:false
        },
        
        breakpoints: {
            500: {
              slidesPerView: 2,
              spaceBetween: 20
            },
            700: {
              slidesPerView: 3,
              spaceBetween: 20
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 20
            }
          },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
 }

 async function searchMovieShow(){
    const searchInput = document.querySelector('#search-term').value;
    const searchBtn = document.querySelector('#search-btn')
    const location = window.location.search;
    const params = location.split('=')[1]

    if(!params){
        alert('Please enter search term')
        return;
    }

    const {contents:searchResult} = await fetchApiData(`search?query=${params}`)
    console.log(searchResult)

    searchResult.length>0 ? searchResult.forEach(result => {
        const div = document.createElement('div');
        div.classList.add('card')

        div.innerHTML = `
          <a href="${result.contentType === 'movie' ? `movie-details.html?id=${result._id}` : `tv-details.html?id=${result._id}`}">
          ${result.poster_path ?
          `<img src="${result.poster_path}" class="card-img-top" alt="${result.title}" />`:`<img src="../images/no-image.jpg" class="card-img-top" alt="${result.title}" />`}
          </a>
          <div class="card-body">
            <h5 class="card-title">${result.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${result.release_date}</small>
            </p>
          </div>
        `;
        document.querySelector('#search-results').appendChild(div)
    }): document.querySelector('#search-results').innerHTML = `<h1 class="text-center">No Result Found</h1>`
  
 }

// Hightlight Active Link
function hightlightActiveLink(){
  const link = document.querySelector(`a.nav-link[href="${global.currentPage}"]`)
  if(link){
    link.classList.add('active')
  }
}


function init(){
    switch(global.currentPage){
        case '/':
        case '/index.html':
            nowPlayingMovies()
            displayPopularMovies()
            break
        case '/shows.html':
            displayPopularTvShows()
            break
        case '/movie-details.html':
            displayMovieDetails()
            break
        case '/tv-details.html':
            displayTvShowDetails()
            break
        case '/search.html':
            searchMovieShow()
            break
        default:
            console.log('404')
    }

    hightlightActiveLink()
}

document.addEventListener('DOMContentLoaded',init)
