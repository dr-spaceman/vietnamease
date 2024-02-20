function setKeyboardInputActive(active: boolean) {
  if (active) {
    document.body.dataset.keyboardInputActive = 'true'
  } else {
    document.body.dataset.keyboardInputActive = 'false'
  }
}

function isKeyboardInputActive() {
  return document.body.dataset.keyboardInputActive === 'true'
}

export { setKeyboardInputActive, isKeyboardInputActive }
