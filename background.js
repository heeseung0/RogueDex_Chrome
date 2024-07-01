const browserApi = typeof browser !== "undefined" ? browser : chrome;
let slotId = -1

function updateDiv(pokemon, weather, message) {
  browserApi.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    browserApi.tabs.sendMessage(tabs[0].id, { type: message, pokemon: pokemon, weather: weather, slotId: slotId }, (response) => {
      if (response && response.success) {
          console.log('Div updated successfully');
      } else {
        console.error('Failed to update div');
      }
    });
  });
}

function sortById(a, b) {
  if (a.id > b.id) return 1
  else if (a.id < b.id) return -1
  else return 0
}

// message can be either "UPDATE_ALLIES_DIV" or "UPDATE_ENEMIES_DIV"
function appendPokemonArrayToDiv(pokemonArray, arena, message) {
  let frontendPokemonArray = []
  let itemsProcessed = 0;
  pokemonArray.forEach((pokemon, index, array) => {
    const pokemonId = Utils.convertPokemonId(pokemon.species)
    let weather = {}
    if (arena.weather && arena.weather.weatherType) {
        weather = {
            'type': WeatherType[arena.weather.weatherType],
            'turnsLeft': arena.weather.turnsLeft || 0
        }
    }
    PokeApi.getAbility(pokemonId, pokemon.abilityIndex).then((ability) => {
      Promise.all([
        PokeApi.getBaseStats(pokemonId),
        Utils.getPokemonTypeEffectiveness(pokemonId),
        PokeApi.getCaptureRate(pokemonId)
      ]).then(([baseStats, typeEffectiveness, captureRate]) => {
        console.log("Got pokemon", pokemonId, "ability", ability, "type effectiveness", typeEffectiveness, "base stats", baseStats, "capture rate", captureRate);
        
        frontendPokemonArray.push({
          'id': pokemonId,
          'typeEffectiveness': {
            'weaknesses': Array.from(typeEffectiveness.weaknesses),
            'resistances': Array.from(typeEffectiveness.resistances),
            'immunities': Array.from(typeEffectiveness.immunities)
          },
          'ivs': pokemon.ivs,
          'baseStats': baseStats,
          'ability': ability,
          'nature': {
            name: Nature[pokemon.nature],
            description: PokeRogueUtils.getNatureDescription(pokemon.nature)
          },
          'capture_rate': captureRate // 포획률 추가
        });
    
        itemsProcessed++;
        if (itemsProcessed === array.length) {
          updateDiv(frontendPokemonArray.sort(sortById), weather, message);
        }
      }).catch((error) => {
        console.error("Error fetching Pokémon data:", error);
      });
    });})
}

browserApi.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Happens when loading a savegame or continuing an old run
  if (request.type == 'BG_GET_SAVEDATA') {
    const savedata = request.data
    slotId = request.slotId
    console.log("Received save data", savedata)
    appendPokemonArrayToDiv(Utils.mapPartyToPokemonArray(savedata.enemyParty), savedata.arena, "UPDATE_ENEMIES_DIV")
    appendPokemonArrayToDiv(Utils.mapPartyToPokemonArray(savedata.party), savedata.arena, "UPDATE_ALLIES_DIV")
  }
});

browserApi.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.method === 'POST') {
        try {
          let sessionData = JSON.parse(new TextDecoder().decode(details.requestBody.raw[0].bytes))
          console.log("POST Session data:", sessionData)
          if (details.url.includes("updateall")) sessionData = sessionData.session
          appendPokemonArrayToDiv(Utils.mapPartyToPokemonArray(sessionData.enemyParty), sessionData.arena, "UPDATE_ENEMIES_DIV")
          appendPokemonArrayToDiv(Utils.mapPartyToPokemonArray(sessionData.party), sessionData.arena, "UPDATE_ALLIES_DIV")
        } catch (e) {
            console.error("Error while intercepting web request: ", e)
        }
    }
  },
  {
    urls: ['https://api.pokerogue.net/savedata/update?datatype=1*', 'https://api.pokerogue.net/savedata/updateall']
  },
  ["requestBody"]
)