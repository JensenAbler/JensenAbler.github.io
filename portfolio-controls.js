(function () {
  var HOME_URL = 'https://jensenabler.github.io/';
  var CONTROL_ID = 'portfolio-controls';
  var BUTTON_CLASS = 'portfolio-controls__button';
  var FULLSCREEN_SELECTORS = ['#fs-toggle', '#fullscreenBtn', '.fullscreen-btn'];

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function addStyles() {
    if (document.getElementById(CONTROL_ID + '-styles')) return;

    var style = document.createElement('style');
    style.id = CONTROL_ID + '-styles';
    style.textContent = [
      '#' + CONTROL_ID + ' {',
      '  position: fixed;',
      '  top: 15px;',
      '  left: 15px;',
      '  z-index: 2147483647;',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 8px;',
      '  pointer-events: auto;',
      '}',
      '#' + CONTROL_ID + ' .' + BUTTON_CLASS + ' {',
      '  appearance: none;',
      '  -webkit-appearance: none;',
      '  position: static;',
      '  top: auto;',
      '  left: auto;',
      '  right: auto;',
      '  bottom: auto;',
      '  z-index: auto;',
      '  display: inline-flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  min-width: 38px;',
      '  height: 36px;',
      '  margin: 0;',
      '  padding: 0 12px;',
      '  border: 1px solid rgba(255, 255, 255, 0.18);',
      '  border-radius: 7px;',
      '  background: rgba(0, 0, 0, 0.58);',
      '  color: #fff;',
      '  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.24);',
      '  cursor: pointer;',
      '  font: 600 13px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
      '  letter-spacing: 0;',
      '  opacity: 0.74;',
      '  transition: opacity 160ms ease, background 160ms ease, border-color 160ms ease;',
      '  touch-action: manipulation;',
      '}',
      '#' + CONTROL_ID + ' .' + BUTTON_CLASS + ':hover,',
      '#' + CONTROL_ID + ' .' + BUTTON_CLASS + ':focus-visible {',
      '  opacity: 1;',
      '  background: rgba(0, 0, 0, 0.76);',
      '  border-color: rgba(255, 255, 255, 0.34);',
      '  outline: none;',
      '}',
      '#' + CONTROL_ID + ' .' + BUTTON_CLASS + '--icon {',
      '  width: 38px;',
      '  padding: 0;',
      '  font-size: 17px;',
      '}',
      '@media (max-width: 560px) {',
      '  #' + CONTROL_ID + ' { top: 10px; left: 10px; gap: 6px; }',
      '  #' + CONTROL_ID + ' .' + BUTTON_CLASS + ' { height: 34px; min-width: 36px; padding: 0 10px; font-size: 12px; }',
      '  #' + CONTROL_ID + ' .' + BUTTON_CLASS + '--icon { width: 36px; padding: 0; font-size: 16px; }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function stopControlEvent(event) {
    event.stopPropagation();
  }

  function protectControl(button) {
    ['pointerdown', 'mousedown', 'touchstart', 'click'].forEach(function (eventName) {
      button.addEventListener(eventName, stopControlEvent, { passive: true });
    });
  }

  function findFullscreenButton() {
    for (var i = 0; i < FULLSCREEN_SELECTORS.length; i += 1) {
      var button = document.querySelector(FULLSCREEN_SELECTORS[i]);
      if (button) return button;
    }
    return null;
  }

  function requestFullscreen() {
    var target = document.documentElement;
    var request = target.requestFullscreen ||
      target.webkitRequestFullscreen ||
      target.mozRequestFullScreen ||
      target.msRequestFullscreen;

    if (request) {
      return Promise.resolve(request.call(target));
    }
    return Promise.resolve();
  }

  function exitFullscreen() {
    var exit = document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;

    if (exit && (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.mozFullscreenElement || document.msFullscreenElement)) {
      return Promise.resolve(exit.call(document));
    }
    return Promise.resolve();
  }

  function normalizeFullscreenButton(button) {
    button.removeAttribute('style');
    button.removeAttribute('onmouseover');
    button.removeAttribute('onmouseout');

    button.type = 'button';
    button.title = 'Toggle fullscreen';
    button.setAttribute('aria-label', 'Toggle fullscreen');
    button.classList.add(BUTTON_CLASS, BUTTON_CLASS + '--icon');
    button.textContent = '\u26f6';
    protectControl(button);
  }

  function createFullscreenButton() {
    var button = document.createElement('button');
    normalizeFullscreenButton(button);
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        exitFullscreen();
      } else {
        requestFullscreen();
      }
    });
    return button;
  }

  function createBackButton() {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = BUTTON_CLASS;
    button.textContent = 'Back';
    button.title = 'Back to project list';
    button.setAttribute('aria-label', 'Back to project list');
    protectControl(button);

    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      exitFullscreen().finally(function () {
        window.location.assign(HOME_URL);
      });
    });

    return button;
  }

  onReady(function () {
    if (document.getElementById(CONTROL_ID)) return;

    addStyles();

    var controls = document.createElement('div');
    controls.id = CONTROL_ID;
    controls.setAttribute('aria-label', 'Portfolio navigation controls');

    controls.appendChild(createBackButton());

    var fullscreenButton = findFullscreenButton();
    if (fullscreenButton) {
      normalizeFullscreenButton(fullscreenButton);
      controls.appendChild(fullscreenButton);
    } else {
      controls.appendChild(createFullscreenButton());
    }

    document.body.appendChild(controls);
  });
}());
