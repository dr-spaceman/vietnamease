function delay(interval: number) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, interval)
  })
}

export default delay
