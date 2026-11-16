const form = document.querySelector("#formulario-pokemon");
const nameInput = document.querySelector("#nome-pokemon");
const result = document.querySelector("#resultado");
const searchButton = form.querySelector("button");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const pokemonName = nameInput.value.trim().toLowerCase();

  if (pokemonName === "") {
    showMessage("Digite o nome de um Pokémon.", true);
    return;
  }

  searchButton.disabled = true;
  showMessage("Buscando Pokémon...");

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemonName)}`
    );

    if (response.status === 404) {
      showMessage("Pokémon não encontrado. Confira o nome e tente novamente.", true);
      return;
    }

    if (!response.ok) {
      throw new Error("Não foi possível consultar a PokéAPI.");
    }

    const pokemon = await response.json();
    showPokemon(pokemon);
  } catch (error) {
    showMessage("Erro ao se comunicar com a API. Tente novamente mais tarde.", true);
  } finally {
    searchButton.disabled = false;
  }
});

function showMessage(text, isError = false) {
  result.replaceChildren();

  const message = document.createElement("p");
  message.className = isError ? "mensagem erro" : "mensagem";
  message.textContent = text;
  result.appendChild(message);
}

function showPokemon(pokemon) {
  result.replaceChildren();

  const title = document.createElement("h2");
  title.className = "nome-pokemon";
  title.textContent = pokemon.name;
  result.appendChild(title);

  const information = document.createElement("ul");
  information.className = "informacoes-pokemon";

  const details = [
    `ID: ${pokemon.id}`,
    `Altura: ${pokemon.height / 10} metros`,
    `Peso: ${pokemon.weight / 10} kg`
  ];

  details.forEach(function (detail) {
    const item = document.createElement("li");
    item.textContent = detail;
    information.appendChild(item);
  });

  result.appendChild(information);

  const abilitiesTitle = document.createElement("h3");
  abilitiesTitle.className = "titulo-habilidades";
  abilitiesTitle.textContent = "Habilidades:";
  result.appendChild(abilitiesTitle);

  const abilitiesList = document.createElement("ul");
  abilitiesList.className = "habilidades";

  pokemon.abilities.forEach(function (abilityData) {
    const item = document.createElement("li");
    item.textContent = abilityData.ability.name;
    abilitiesList.appendChild(item);
  });

  result.appendChild(abilitiesList);
}
