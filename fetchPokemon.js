const axios = require("axios");
const fs = require("fs");

async function fetchPokemon() {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=25";
  try {
    const response = await axios.get(url);
    const pokemonResults = response.data.results;

    const pokemonData = await Promise.all(
      pokemonResults.map(async (pokemon) => {
        const pokemonDetails = await axios.get(pokemon.url);

        const { name, id, base_experience, height, weight, types, moves, sprites } = pokemonDetails.data;

        const pokemonTypes = types.map(type => type.type.name);

        const selectedMoves = moves.slice(0, 5).map(move => ({
          name: move.move.name,
          accuracy: move.move.accuracy || null,
          power: move.move.power || null,
        }));

        return {
          name,
          id,
          base_experience,
          height,
          weight,
          types: pokemonTypes,
          moves: selectedMoves,
          image: sprites.front_default,
        };
      })
    );

    fs.writeFileSync("./data/pokemon.json", JSON.stringify(pokemonData, null, 2));
    console.log("Pokemon data saved to data/pokemon.json");
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);
  }
}

fetchPokemon();
