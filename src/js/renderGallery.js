import SimpleLightbox from 'simplelightbox';
import refs from './refs';
import './fetch';
import requestImages from './fetch';



export default  function renderGallery(photoArray) {
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
   
refs.galleryItems.insertAdjacentHTML('beforeend', cardMarkup);
  const lightbox = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
    overlayOpacity: 0.8,
  });
}
  