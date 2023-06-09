const axios = require('axios').default;
axios.defaults.baseURL = 'https://pixabay.com/api/';

async function getSearch(request, page, per_page) {
  return await axios.get('', {
    params: {
      key: '8873748-8f4b9856cce86eb33a6634d30',
      q: request,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page,
    },
  });
}

export { getSearch };
