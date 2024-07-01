async function _calculateTypesEffectiveness(types) {
  const typeEffectiveness = await Promise.all(types.map(PokeApi.getTypeEffectiveness));
  if (typeEffectiveness.some(data => data === null)) {
    return null;
  }

  const weaknesses = new Set();
  const resistances = new Set();
  const immunities = new Set();

  if (types.length === 1) {
    const data = typeEffectiveness[0];
    data.double_damage_from.forEach(t => weaknesses.add(t.name));
    data.half_damage_from.forEach(t => resistances.add(t.name));
    data.no_damage_from.forEach(t => immunities.add(t.name));
  } else if (types.length === 2) {
    const [type1, type2] = types;
    const type1Effectiveness = typeEffectiveness[0];
    const type2Effectiveness = typeEffectiveness[1];

    // Calculate weaknesses
    type1Effectiveness.double_damage_from.forEach(t => {
      if (!type2Effectiveness.half_damage_from.some(r => r.name === t.name)) {
        weaknesses.add(t.name)
      }
    });
    type2Effectiveness.double_damage_from.forEach(t => {
      if (!type1Effectiveness.half_damage_from.some(r => r.name === t.name)) {
        weaknesses.add(t.name)
      }
    });

    // Calculate resistances
    type1Effectiveness.half_damage_from.forEach(t => {
      if (!type2Effectiveness.double_damage_from.some(r => r.name === t.name)) {
        resistances.add(t.name)
      }
    });

    type2Effectiveness.half_damage_from.forEach(t => {
      if (!type1Effectiveness.double_damage_from.some(r => r.name === t.name)) {
        resistances.add(t.name)
      }
    });

    // Calculate immunities
    type1Effectiveness.no_damage_from.forEach(t => immunities.add(t.name))
    type2Effectiveness.no_damage_from.forEach(t => immunities.add(t.name))

    immunities.forEach(immunity => {
        weaknesses.delete(immunity);
        resistances.delete(immunity);
    })
  }

  return { weaknesses, resistances, immunities };
}

class Utils {
	// Function that converts PokeRogue pokemon ID to pokeAPI pokemon ID
	static convertPokemonId(pokemonId) {
	  const conversionList = {
	    2019: 10091,
	    2020: 10092,
	    2026: 10100,
	    2027: 10101,
	    2028: 10102,
	    2037: 10103,
	    2038: 10104,
	    2050: 10105,
	    2051: 10106,
	    2052: 10107,
	    2053: 10108,
	    2074: 10109,
	    2075: 10110,
	    2076: 10111,
	    2088: 10112,
	    2089: 10113,
	    2103: 10114,
	    2105: 10115,
	    2670: 670,
	    4052: 10161,
	    4077: 10162,
	    4078: 10163,
	    4079: 10164,
	    4080: 10165,
	    4083: 10166,
	    4110: 10167,
	    4122: 10168,
	    4144: 10169,
	    4145: 10170,
	    4146: 10171,
	    4199: 10172,
	    4222: 10173,
	    4263: 10174,
	    4264: 10175,
	    4554: 10176,
	    4555: 10177,
	    4562: 10179,
	    4618: 10180,
	    6058: 10229,
	    6059: 10230,
	    6100: 10231,
	    6101: 10232,
	    6157: 10233,
	    6211: 10234,
	    6215: 10235,
	    6503: 10236,
	    6549: 10237,
	    6570: 10238,
	    6571: 10239,
	    6628: 10240,
	    6705: 10241,
	    6706: 10242,
	    6713: 10243,
	    6724: 10244,
	    8128: 10252,
	    8194: 10253,
	    8901: 10272
	  }
	  if (pokemonId in conversionList) {
	    return conversionList[pokemonId]
	  } else {
	    return pokemonId
	  }
	}

	// Function to calculate weaknesses, resistances, and immunities
	

	static async getPokemonTypeEffectiveness(id) {
	  const types = await PokeApi.getPokemonType(id);
	  if (types) {
	    const { weaknesses, resistances, immunities } = await _calculateTypesEffectiveness(types);
	    return { 
	      'weaknesses': weaknesses, 
	      'resistances': resistances, 
	      'immunities': immunities 
	    }
	  }
	  return {}
	}

	static mapPartyToPokemonArray(party) {
	  return party.map(({ species, abilityIndex, nature, ivs }) => ({ species, abilityIndex, nature, ivs }))
	}
}