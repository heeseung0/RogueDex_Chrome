function _changeOpacity(e) {
    const divId = e.target.id.split("-")[0];
    const div = document.getElementById(divId);
    WRAPPER_DIV_POSITIONS[divId].opacity = Number(e.target.value); 
    div.style.opacity = WRAPPER_DIV_POSITIONS[divId].opacity / 100;
  }
  
  
  function _changePage(click) {
      const buttonId = click.target.id
      const divId = buttonId.split("-")[0]
      const direction = buttonId.split("-")[1]
      if (direction === 'up') {
          if (divId === 'enemies') {
              if (_currentEnemyPage > 0) {
                  _currentEnemyPage -= 1
              } else {
                  _currentEnemyPage = _enemiesPokemon.length - 1
              }
          } else if (divId === 'allies') {
              if (_currentAllyPage > 0) {
                  _currentAllyPage -= 1
              } else {
                  _currentAllyPage = _alliesPokemon.length - 1
              }
          }		
      } else if (direction === 'down') {
          if (divId === 'enemies') {
              if ((_currentEnemyPage + 1) < _enemiesPokemon.length) {
                  _currentEnemyPage += 1
              } else {
                  _currentEnemyPage = 0
              }
          } else if (divId === 'allies') {
              if ((_currentAllyPage + 1) < _alliesPokemon.length) {
                  _currentAllyPage += 1
              } else {
                  _currentAllyPage = 0
              }
          }
      }
      HttpUtils.createCardsDiv(divId)
  }
  
  // Enables drag-and-drop functionality on an element
  function _enableDragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const dragStartElement = elmnt;
  
    dragStartElement.onpointerdown = dragMouseDown;
  
    function dragMouseDown(e) {
      e = e || window.event;
      if (e.target.type === 'submit' || e.target.type === 'range') return;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onpointerup = stopDragging;
      document.onpointermove = dragElement;
    }
  
    function dragElement(e) {
      e = e || window.event;
      if (e.target.type === 'submit' || e.target.type === 'range') return;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function stopDragging() {
      document.onpointerup = null;
      document.onpointermove = null;
      _savePositions();
    }
  }
  
  function _savePositions() {
    const settings = {};
    ['enemies', 'allies'].forEach(divId => {
      const div = document.getElementById(divId);
      if (div) {
        settings[divId] = {
          top: div.style.top,
          left: div.style.left,
          opacity: WRAPPER_DIV_POSITIONS[divId].opacity
        };
      }
    });
    settings.scaleFactor = _scaleFactor;
    settings.isHidden = isHidden;
    settings.isHiddenEnemies = isHiddenEnemies;
    settings.isHiddenAllies = isHiddenAllies;
    localStorage.setItem('cardSettings', JSON.stringify(settings));
  }
  
  
  function _loadPositions() {
    const savedSettings = localStorage.getItem('cardSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      for (const [divId, position] of Object.entries(settings)) {
        if (divId === 'enemies' || divId === 'allies') {
          WRAPPER_DIV_POSITIONS[divId].top = position.top;
          WRAPPER_DIV_POSITIONS[divId].left = position.left;
          WRAPPER_DIV_POSITIONS[divId].opacity = position.opacity;
        }
      }
      _scaleFactor = settings.scaleFactor || 1;
      isHidden = settings.isHidden || false;
      isHiddenEnemies = settings.isHiddenEnemies || false;
      isHiddenAllies = settings.isHiddenAllies || false;
    }
  }