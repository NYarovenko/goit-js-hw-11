import { getSearch } from './helpers/request';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';

// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('form.search-form');
const divGallery = document.querySelector('div.gallery');
const guard = document.querySelector('div.guard');
const PER_PAGE = 40; //кількість карток за один запит
let total;
let page = 1;
let search = '';

const lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (total - PER_PAGE * page < 0) {
          Notiflix.Notify.warning(
            "We're sorry, but you've reached the end of search results."
          );
          observer.unobserve(guard);
          return;
        }

        page += 1;
        request(search, page);
      }
    });
  },
  { rootMargin: '200px' }
);

form.addEventListener('submit', onSubmit);

function onSubmit(evnt) {
  evnt.preventDefault();
  observer.unobserve(guard);
  const {
    elements: { searchQuery },
  } = evnt.currentTarget;

  divGallery.innerHTML = '';
  page = 1;
  search = searchQuery.value;
  if (search.trim()) request();
  evnt.currentTarget.reset();
}

async function request() {
  observer.unobserve(guard);
  const { data } = await getSearch(search, page, PER_PAGE);
  await observer.observe(guard);
  total = data.totalHits;
  if (!data.total) {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (page === 1) {
    Notiflix.Notify.info(`Hooray! We found ${total} images.`);
    observer.observe(guard);
  }

  markingGallery(data);
}

// розмітка галереї
function markingGallery(data) {
  const markup = data.hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) =>
      `<a href="${largeImageURL}">
      <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            <span>${likes}</span>
          </p>
          <p class="info-item">
            <b>Views</b>
            <span>${views}</span>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <span>${comments}</span>
          </p>
          <p class="info-item">
            <b>Downloads</b>
            <span>${downloads}</span>
          </p>
        </div>
      </div>
      </a>`
  );

  divGallery.insertAdjacentHTML('beforeend', markup.join(''));
  lightbox.refresh();
}
