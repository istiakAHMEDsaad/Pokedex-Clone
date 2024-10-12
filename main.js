//! =============== Set Value =============== !
const MAX_POKEMON = 999;
const listWrapper = document.getElementsByClassName('pokemon-list')[0];
const searchInput = document.getElementById('search-input');
const numberFilter = document.getElementById('number-filter');
const nameFilter = document.getElementById('name-filter');
const notFoundMessage = document.getElementById('not-found-message');

let allPokemons = [];

//! =============== Set Pokemon Show Max Size =============== !
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json())
  .then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons);
  })
  .catch((error) => console.error(error));

//! =============== Fetch Pokemon By Id Or Species =============== !
async function fetchPokemonDataBeforeRedirect(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    return true;
  } catch (error) {
    console.error('Failed to fetch Pokemon data before redirect');
  }
}

//! =============== Display Pokemon Function =============== !
function displayPokemons(pokemon) {
  listWrapper.innerHTML = '';

  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split('/')[6];
    const listItem = document.createElement('div');
    listItem.className = '';
    listItem.innerHTML = `
            <div class="flex flex-col border">
              <p class="caption-fonts">#${pokemonID}</p>

              <div class="lg:w-[300px] lg:h-[300px] md:w-[180px] md:h-[180px]">
                <img class="w-full h-full object-contain" src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
              </div>

              <p class="body3-fonts text-xl text-center">#${pokemon.name}</p>
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
}

//! =============== Search Function =============== !
searchInput.addEventListener('keyup', handleSearch);
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemons;

  if (numberFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonID = pokemon.url.split('/')[6];
      return pokemonID.startsWith(searchTerm);
    });
  } else if (nameFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(searchTerm)
    );
  } else {
    filteredPokemons = allPokemons;
  }

  displayPokemons(filteredPokemons);

  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = 'block';
  } else {
    notFoundMessage.style.display = 'none';
  }
}

//! =============== Close Button Function =============== !
const closeButton = document.getElementById('search-close');
closeButton.addEventListener('click', clearSearch);

function clearSearch() {
  searchInput.value = '';
  displayPokemons(allPokemons);
  notFoundMessage.style.display = 'none';
}
