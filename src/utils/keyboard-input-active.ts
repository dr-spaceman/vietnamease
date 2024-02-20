/**
 * Use a DOM attribute to track whether keyboard controls should be active.
 * Keyboard controls should be deactivated temporarily when the user is
 * interacting with a form input or menu.
 */

function setKeyboardInputActive(active: boolean) {
  if (active) {
    document.body.dataset.keyboardInputInactive = 'false'
  } else {
    document.body.dataset.keyboardInputInactive = 'true'
  }
}

function isKeyboardInputActive() {
  const activeState = document.body.dataset.keyboardInputInactive

  return !activeState || activeState === 'false'
}

export { setKeyboardInputActive, isKeyboardInputActive }
