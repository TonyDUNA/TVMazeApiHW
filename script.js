let shows = [];
// обработчик формы поиска со страницы
const form = document.querySelector('#searchField');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const query = document.querySelector('#searchInput').value;
  searchShows(query);
})

// обработчик очистка поиска
let clearButton = document.getElementById("clearSearch");
// console.log(clearButton)

const clickHandler = function clearSearch() {
  const showList = document.querySelector('#showList');
  showList.innerHTML = '';
}
clearButton.addEventListener('click', clickHandler);



// сортировка
// обработчик для селекта сортировки

document.querySelector('#sortSelect').addEventListener('change', function () {
  const sortOption = this.value;

  const sortedShows = sortShows(shows, sortOption);// вызов ф-ции сортировки
  displayShows(sortedShows);// отображение отсортированного

})



// функция поиска шоу
async function searchShows(query) {
  const url = `https://api.tvmaze.com/search/shows/?q=${query}`;
  await axios.get(url)
    .then((res) => {
      shows = res.data;
      const sortedShows = sortShows(shows, document.querySelector('#sortSelect').value);
      displayShows(sortedShows);
      console.log(sortedShows);
    })
    .catch((error) => {
      console.error('errors:', error)
    });
}

// ф-я сортировки
function sortShows(shows, sortOption) {
  let sortedShows = [...shows]; // копия массива


  if (sortOption === 'name') {
    console.log('sorting by name, row data:', sortedShows);
    sortedShows.sort((a, b) => {
      try {
        const nameA = a.show.name || '';
        const nameB = b.show.name || '';
        if (nameA > nameB) return 1;
        if (nameA < nameB) return -1;
        return 0;
        // c local compare - не работает: 
        // const nameA = typeof a.show.name === 'string' ? a.show.name : '';
        // const nameB = typeof b.show.name === 'string' ? b.show.name : '';
        // return nameA.localCompare(nameB);
      }
      catch (error) {
        console.error('ошибка при сравнении имен', error);
      }

    });
  } else if (sortOption === 'genre') {

    sortedShows.sort((a, b) => {
      try {
        const genreA = a.show.genres.length > 0 ? a.show.genres[0] : '';
        const genreB = b.show.genres.length > 0 ? b.show.genres[0] : '';
        if (genreA > genreB) return 1;
        if (genreA < genreB) return -1;
        return 0;
      }
      catch (error) {
        console.error('ошибка при сравнении жанров', error);
      }

    });
  }
  return sortedShows;
}


// функция отображения шоу
async function displayShows(shows) {
  const showList = document.querySelector("#showList");
  showList.innerHTML = '';

  shows.forEach(element => {
    const show = element.show;
    let imgSrc;
    let rating;

    // проверка наличия изображения,  если нет - заглушка, рейтинга - также
    try {
      if (show.image) {
        imgSrc = show.image.medium;
      } else {
        imgSrc = 'https://via.placeholder.com/210x295';

      }

      if (show.rating.average) {
        rating = show.rating.average
      } else {
        rating = "No rating"
      }

      // добавить в HTML      
      const showInstance = document.createElement("div");
      showInstance.classList.add('show');
      const showName = show.name ? show.name : 'no name';
      const showGenre = show.genres.length ? show.genres.join(', ') : 'no jenres'

      const createShowHTML = `<img src="${imgSrc}" alt="${showName}"><h2>${showName}</h2> </img>
                              <div id="raiting"; >Rating: ${rating}</div>
                              <p>Genre: ${showGenre}</p>
                              `;
      showInstance.innerHTML = createShowHTML;

      // удаляем класс active у всех шоу и добавляем только на выбранной

      showInstance.addEventListener('click', function () {
        document.querySelectorAll('.show').forEach(element =>
          element.classList.remove('active'));
        showInstance.classList.add('active');


      });

      showList.append(showInstance);

    } catch (error) {
      console.error("Ошибка :", error);
    }

  })
}




