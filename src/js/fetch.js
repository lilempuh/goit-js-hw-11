import Notiflix from 'notiflix';
import axios from 'axios';
import refs from './refs';
import './renderGallery'


const KEY_ID = "28235819-d60a9d1543261a6c36de31755";
const URL = "https://pixabay.com/api";
const IMAGE_TYPE = "photo";
const ORIENTATION = "horizontal";
const SAFE_SEARCH = true;
const PER_PAGE = 40;
let page = 1;

const axios = require('axios'); 

export default async function requestImages(search) {
  
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
       refs.continButton.classList.remove('hidden');
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
}