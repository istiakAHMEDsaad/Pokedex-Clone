const loadingAnimation = document.querySelector('.loading-spinner');
const showLoading = () => {
  loadingAnimation.classList.add('show');
};
const stopLoading = () => {
  loadingAnimation.classList.remove('show');
};

const MAX_POKEMON = 151;
const listWrapper = document.getElementsByClassName('pokemon-list')[0];
const searchInput = document.getElementById('search-input');
const numberFilter = document.getElementById('number-filter');
const nameFilter = document.getElementById('name-filter');
const notFoundMessage = document.getElementById('not-found-message');

let allPokemon = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json())
  .then((data) => {
    allPokemon = data.results;
    showLoading();
    setTimeout(() => {
      stopLoading();
      displayPokemons(allPokemon);
    }, 100);
  })
  .catch((error) => console.error(error));

async function fetchPokemonDataBeforeRedirect(id) {
  showLoading();

  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response) => response.json())
        .fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        .then((response) => response.json),
    ]);
    return true;
  } catch (error) {
    console.error('Faild to fetch pokemon data before redirect');
  }
}

const displayPokemons = (pokemon) => {
  listWrapper.innerHTML = '';
  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split('/')[6];
    const listItem = document.createElement('div');
    // listItem.classList = '';
    listItem.innerHTML = `
        <div>
            <p>#${pokemonID}</p>
        </div>
        <div>
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
        </div>
        <div class="">
            <p class="">#${pokemon.name}</p>
        </div>
    `;

    listItem.addEventListener('click', async () => {
      const success = await fetchPokemonDataBeforeRedirect(pokemonID);
      if (success) {
        window.location.href = `./detail.html?id=${pokemonID}`;
      }
    });

    listWrapper.appendChild(listItem);
  });
};
