const WRAPPER_DIV_POSITIONS = {
  enemies: {
    top: "0",
    left: "0",
    opacity: 100,
  },
  allies: {
    top: "0",
    left: "0",
    opacity: 100,
  },
};

// Global variables
let _currentEnemyPage = 0;
let _currentAllyPage = 0;
let _enemiesPokemon = [];
let _alliesPokemon = [];
let _weather = [];

// Utility functions
function _createTooltipDiv(tip) {
  return `<div class="text-base tooltiptext">${tip}</div>`;
}

function _createOpacitySliderDiv(
  divId,
  initialValue = 100,
  min = 10,
  max = 100
) {
  const sliderId = `${divId}-slider`;
  return {
    id: sliderId,
    html: `
      <div class="slider-wrapper">
        <button class="ToggleHideCompability">-</button>
        <input type="range" min="${min}" max="${max}" value="${initialValue}" id="${sliderId}">
        <button class="ToggleHide">X</button>
      </div>
      <div class="slider-wrapper scale-buttons">
        <button class="ScaleDown">-</button>
        <button class="ScaleUp">+</button>
      </div>`,
  };
}

function _createTypeEffectivenessWrapper(typeEffectivenesses) {
  return ["weaknesses", "resistances", "immunities"]
    .map((key) =>
      typeEffectivenesses[key].length
        ? `
      <div class="pokemon-${key} tooltip">
        ${typeEffectivenesses[key]
          .map(
            (type, i) =>
              `${i % 3 ? "" : "<div>"}
           <div class="type-icon" style="background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${
             Types[type]
           }.png')"></div>
           ${
             i % 3 === 2 || i === typeEffectivenesses[key].length - 1
               ? "</div>"
               : ""
           }`
          )
          .join("")}
        ${_createTooltipDiv(
          { weaknesses: "약점", resistances: "반감", immunities: "무효" }[key]
        )}
      </div>`
        : ""
    )
    .join("");
}

function _createPokemonCardDiv(cardclass, cardId, pokemon) {
  const { html: opacitySliderHTML, id: opacitySliderId } =
    _createOpacitySliderDiv(cardId, WRAPPER_DIV_POSITIONS[cardId].opacity);
  const typeEffectivenessHTML = _createTypeEffectivenessWrapper(
    pokemon.typeEffectiveness
  );
  const { html: buttonsHTML, ...buttonsData } = _createArrowButtonsDiv(
    cardId,
    "",
    ""
  );

  const createStatHTML = (statName, baseStat, iv) => `
    ${statName}: ${baseStat} (<span class="${
    iv === 31 ? "max-iv" : ""
  }">${iv}</span>)
  `;

  const customCreateStatHTML1 = (baseStats) => {
    let cStats = "";
    let sumStats = 0;

    baseStats.forEach((e, index) => {
      if (index + 1 >= baseStats.length) {
        cStats += e;
      } else {
        cStats += e + "/";
      }
      sumStats += e;
    });

    return "종족값: " + cStats + "  " + `(${sumStats})`;
  };

  const customCreateStatHTML2 = (ivs) => {
    let cStats2 = "";

    ivs.forEach((e, index) => {
      cStats2 += `<span class="${e === 31 ? "max-iv" : ""}">${e}</span>`;

      if (index + 1 < ivs.length) {
        cStats2 += "/";
      }
    });

    return "개체값: " + cStats2;
  };

  const customCreateStatsTable = (baseStats, ivs) => {
    let cStats1 = "";
    let cStats2 = "";
    let sumStats = 0;

    baseStats.forEach((bs) => {
      cStats1 += `<td>${bs}</td>`;
      sumStats += bs;
    });

    ivs.forEach((iv) => {
      cStats2 += `<td class="${iv === 31 ? "max-iv" : ""}">${iv}</td>`;
    });

    return `
      <table border="1" cellspacing="0" style="font-size:75%; font-weight:bold">
        <tr>
          <td></td>
          <td>HP</td>
          <td>ATK</td>
          <td>DEF</td>
          <td>S.ATK</td>
          <td>S.DEF</td>
          <td>SPD</td>
          <td>합계</td>
        </tr>
        <tr>
          <td>BASE</td>
          ${cStats1}
          <td>${sumStats}</td>
        </tr>
        <tr>
          <td>IVS</td>
          ${cStats2}
          <td></td>
        </tr>
      </table>
      `;
  };

  const createCaptureRateHTML = (ballName, rate) => {
    const captureRate = Math.min(
      ((rate * pokemon.capture_rate * (1 / 3)) / 255) * 100,
      100
    ).toFixed(1);
    return `
      ${ballName}:<span class="${
      captureRate === "100.0" ? "max-capture-rate" : ""
    }">${captureRate}%</span>
    `;
  };

  const cardHTML = `
  <div class="pokemon-cards">
    <div class="pokemon-card">
      ${buttonsHTML}
      ${opacitySliderHTML}
      <div class="pokemon-card-content">
        <div class="pokemon-icon">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
            pokemon.id
          }.png">
        </div>
        ${typeEffectivenessHTML}
      </div>
      <div class="text-base ability-nature">
        <div class="tooltip ${
          pokemon.ability.isHidden ? "hidden-ability" : ""
        }">
          특성:${pokemon.ability.name}
          ${_createTooltipDiv(pokemon.ability.description)}
        </div>
        <span class="separator">&nbsp/&nbsp</span>
        <div class="tooltip">
          성격: ${pokemon.nature.name}
          ${_createTooltipDiv(pokemon.nature.description)}
        </div>
      </div>

      <div class="customStats">
        ${customCreateStatsTable(pokemon.baseStats, pokemon.ivs)}
      </div>
    
      <div class="customRate text-base">
        <div class="customRate">${createCaptureRateHTML("몬스터볼", 1)}</div>
        <div class="customRate">${createCaptureRateHTML("슈퍼볼", 1.5)}</div>
      </div>
      <div class="customRate text-base">
        <div class="customRate">${createCaptureRateHTML("하이퍼볼", 2)}</div>
        <div class="customRate">${createCaptureRateHTML("로그볼", 3)}</div>
      </div>
      ${
        _weather.type && _weather.turnsLeft
          ? `
        <div class="text-base weather">날씨: ${_weather.type}, 남은 턴: ${_weather.turnsLeft}</div>
      `
          : ""
      }
    </div>
  </div>
`;

  return { html: cardHTML, slider: opacitySliderId, buttons: buttonsData };
}

function _createArrowButtonsDiv(divId, upString, downString) {
  return {
    idUp: `${divId}-up`,
    idDown: `${divId}-down`,
    html: `
      <div class="arrow-button-wrapper">
        <button class="text-base arrow-button" id="${divId}-up">${upString}</button>
        <button class="text-base arrow-button" id="${divId}-down">${downString}</button>
      </div>`,
  };
}

function _updateWrapperDivPositions(oldDiv, divId) {
  WRAPPER_DIV_POSITIONS[divId].top = oldDiv.style.top;
  WRAPPER_DIV_POSITIONS[divId].left = oldDiv.style.left;
  _savePositions();
}

function _createWrapperDiv(divId) {
  const oldDiv = document.getElementById(divId);
  if (oldDiv) {
    _updateWrapperDivPositions(oldDiv, divId);
    oldDiv.remove();
  }
  const newDiv = document.createElement("div");
  newDiv.className = `${divId}-team`;
  newDiv.id = divId;
  _enableDragElement(newDiv);
  newDiv.style.top = WRAPPER_DIV_POSITIONS[divId].top;
  newDiv.style.left = WRAPPER_DIV_POSITIONS[divId].left;
  newDiv.style.opacity = WRAPPER_DIV_POSITIONS[divId].opacity / 100;
  document.body.appendChild(newDiv);
  return newDiv;
}

class HttpUtils {
  static updateFromMessage(message) {
    if (message.type === "UPDATE_ENEMIES_DIV") {
      if (!_.isEqual(_enemiesPokemon, message.pokemon)) {
        _enemiesPokemon = message.pokemon;
      }
    } else {
      if (!_.isEqual(_alliesPokemon, message.pokemon)) {
        _alliesPokemon = message.pokemon;
      }
    }
    _weather = message.weather;
    if (_weather.turnsLeft === 0) _weather.turnsLeft = "무제한";
  }

  static createTopBannerDiv() {}

  static createCardsDiv(divId) {
    const newDiv = _createWrapperDiv(divId);
    let pokemon = {};
    if (divId === "enemies") {
      if (_currentEnemyPage >= _enemiesPokemon.length) _currentEnemyPage = 0;
      pokemon = _enemiesPokemon[_currentEnemyPage];
    } else {
      if (_currentAllyPage >= _alliesPokemon.length) _currentAllyPage = 0;
      pokemon = _alliesPokemon[_currentAllyPage];
    }

    const cardObj = _createPokemonCardDiv(`${divId}-team`, divId, pokemon);

    newDiv.insertAdjacentHTML("afterbegin", cardObj.html);
    document.body.appendChild(newDiv);

    document
      .getElementById(cardObj.slider)
      .addEventListener("input", _changeOpacity);
    document
      .getElementById(cardObj.buttons.idUp)
      .addEventListener("click", _changePage);
    document
      .getElementById(cardObj.buttons.idDown)
      .addEventListener("click", _changePage);

    document.querySelectorAll(".ToggleHideCompability").forEach((button) => {
      button.addEventListener("click", _toggleHideCompability);
    });

    document.querySelectorAll(".ToggleHide").forEach((button) => {
      button.addEventListener("click", _toggleHide);
    });

    _addScaleButtonListeners();
    _applyVisibilityState();
    _savePositions();

    return newDiv;
  }

  static createWrapperDivs() {
    _loadPositions();
    ["allies", "enemies"].forEach((divId) => _createWrapperDiv(divId));
  }

  static deleteWrapperDivs() {
    ["allies", "enemies"].forEach((divId) => {
      const div = document.getElementById(divId);
      if (div) {
        _updateWrapperDivPositions(div, divId);
        document.body.removeChild(div);
      }
    });
  }
}
