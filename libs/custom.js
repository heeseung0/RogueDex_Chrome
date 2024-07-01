let isHidden = false;
let isHiddenEnemies = false;
let isHiddenAllies = false;
let _scaleFactor = 1;

function _scaleUp() {
    _scaleFactor += 0.1;
    document.querySelector('#enemies').style.transform = `scale(${_scaleFactor})`;
    document.querySelector('#allies').style.transform = `scale(${_scaleFactor})`;
}

function _scaleDown() {
    _scaleFactor -= 0.1;
    document.querySelector('#enemies').style.transform = `scale(${_scaleFactor})`;
    document.querySelector('#allies').style.transform = `scale(${_scaleFactor})`;
}

function _addScaleButtonListeners() {
    document.querySelectorAll(".ScaleUp").forEach(button => {
        if (!button.dataset.listener) {
            button.dataset.listener = 'true';
            button.addEventListener('click', _scaleUp);
        }
    });

    document.querySelectorAll(".ScaleDown").forEach(button => {
        if (!button.dataset.listener) {
            button.dataset.listener = 'true';
            button.addEventListener('click', _scaleDown);
        }
    });
}

function _toggleHideCompability() {
    isHidden = !isHidden;
    document.querySelectorAll(".pokemon-weaknesses.tooltip, .pokemon-resistances.tooltip, .pokemon-immunities.tooltip").forEach(element => {
        if (isHidden) {
            element.classList.add('hidden');
        } else {
            element.classList.remove('hidden');
        }
    });
}

function _toggleHide(event) {
    const parentDiv = event.target.closest('.pokemon-cards').parentElement;
    const divId = parentDiv.id;

    if (divId === 'enemies') {
        isHiddenEnemies = !isHiddenEnemies;
        document.querySelectorAll("#enemies .slider-wrapper scale-buttons, #enemies .scale-buttons, #enemies .text-base.ability-nature, #enemies .arrow-button-wrapper, #enemies .pokemon-card-content, #enemies .text-base.stats, #enemies .text-base.capture-rates, #enemies .text-base.weather").forEach(element => {
            element.style.display = isHiddenEnemies ? 'none' : '';
        });
    } else if (divId === 'allies') {
        isHiddenAllies = !isHiddenAllies;
        document.querySelectorAll("#allies .slider-wrapper scale-buttons, #allies .scale-buttons, #allies .text-base.ability-nature, #allies .arrow-button-wrapper, #allies .pokemon-card-content, #allies .text-base.stats, #allies .text-base.capture-rates, #allies .text-base.weather").forEach(element => {
            element.style.display = isHiddenAllies ? 'none' : '';
        });
    }
    _applyVisibilityState();
}

function _applyVisibilityState() {
    // 상성창 토글 상태 적용
    document.querySelectorAll(".pokemon-weaknesses.tooltip, .pokemon-resistances.tooltip, .pokemon-immunities.tooltip").forEach(element => {
        if (element) {
            element.classList.toggle('hidden', isHidden);
        }
    });

    // 적 포켓몬 카드 숨김 상태 및 스케일 적용
    const enemiesElement = document.querySelector('#enemies');
    if (enemiesElement) {
        enemiesElement.querySelectorAll("#enemies .slider-wrapper scale-buttons, #enemies .scale-buttons, #enemies .text-base.ability-nature, #enemies .arrow-button-wrapper, #enemies .pokemon-card-content, #enemies .text-base.stats, #enemies .text-base.capture-rates, #enemies .text-base.weather").forEach(element => {
            element.style.display = isHiddenEnemies ? 'none' : '';
        });
        enemiesElement.style.transform = `scale(${_scaleFactor})`;
        enemiesElement.style.opacity = WRAPPER_DIV_POSITIONS['enemies'].opacity / 100;
    }

    // 아군 포켓몬 카드 숨김 상태 및 스케일 적용
    const alliesElement = document.querySelector('#allies');
    if (alliesElement) {
        alliesElement.querySelectorAll("#allies .slider-wrapper scale-buttons, #allies .scale-buttons, #allies .text-base.ability-nature, #allies .arrow-button-wrapper, #allies .pokemon-card-content, #allies .text-base.stats, #allies .text-base.capture-rates, #allies .text-base.weather").forEach(element => {
            element.style.display = isHiddenAllies ? 'none' : '';
        });
        alliesElement.style.transform = `scale(${_scaleFactor})`;
        alliesElement.style.opacity = WRAPPER_DIV_POSITIONS['allies'].opacity / 100;
    }
}