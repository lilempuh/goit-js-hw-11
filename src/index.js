import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const axios = require('axios');


const refs = {
  form: document.querySelector(".search-form"),
  input: document.querySelector('input[name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
  continButton: document.querySelector('.load-more'),
};

const KEY_ID = "28235819-d60a9d1543261a6c36de31755";
const URL = "https://pixabay.com/api";
const IMAGE_TYPE = "photo";
const ORIENTATION = "horizontal";
const SAFE_SEARCH = true;
const PER_PAGE = 40;
let page = 1;

function checkPage() {
  if (page === 1) {
    refs.continButton.classList.add('hidden');
  }
};

checkPage();

refs.form.addEventListener("submit", onSubmit);
refs.continButton.addEventListener('click', getAddImage);

function onSubmit(e) {
    
    if (!refs.continButton.classList.contains('hidden') && page > 1) {
    refs.continButton.classList.add('hidden');
    
  }
  clearMarkup();

  resetPage();
  
  getImagesForSearch(e);   
};


function getImagesForSearch(e) {
  e.preventDefault();

  const searchInputWorld = refs.input.value;
    console.log(searchInputWorld)

 requestImages(searchInputWorld)
     .then(response => {
        receivedGallery(response)
   
    })
    .catch(error => console.log(error.message));
};


function receivedGallery(response) {
  const photoArray = response.data.hits;

  renderGallery(response.data.hits);
  
}; 


async function requestImages(search) {
  
  const searchWord = search.trim();
  console.log(searchWord);

  try {

    if (searchWord === '') {
        Notiflix.Notify.warning('Please type in the field what you want to find');
       clearMarkup();
        return}


    const response = await axios.get(
      `${URL}/?key=${KEY_ID}&q=${searchWord}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFE_SEARCH}&page=${page}&per_page=${PER_PAGE}`);
     
    if (page === 1 && response.data.totalHits > 0) {
       Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images`
      );
      refs.continButton.classList.remove('hidden')
          } 

      if (
      page >= response.data.totalHits / PER_PAGE &&
      response.data.totalHits > 0
    ) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      refs.continButton.classList.add('hidden');
    }

    
         if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again'
          );
        
            return;
        } 
    page += 1;
    
    return response;
                         
  } catch (error) {
    console.error(error);
        
  };
};


 function renderGallery(photoArray) {
    const cardMarkup = photoArray
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `
        <div class="photo-card">
        <a class="gallery-item" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo-card__image"/>  
  <div class="info">
    <p class="info-item">
      <b>Likes : ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div> </a>
`;
        }
      )
     .join('');
   
refs.gallery.insertAdjacentHTML('beforeend', cardMarkup);
  const lightbox = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
    overlayOpacity: 0.8,
  });
};
  

function getAddImage(e) {
    getImagesForSearch(e)    
};

 function resetPage() {
  page = 1;
};

function clearMarkup() {
  refs.gallery.innerHTML = '';
};

