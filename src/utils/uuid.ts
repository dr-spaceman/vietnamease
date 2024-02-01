function uuidv4(): string {
  const crypto = window.crypto || (window as any).msCrypto

  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: string) =>
    (
      parseInt(c, 16) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] &
        (15 >> (parseInt(c, 16) / 4)))
    ).toString(16)
  )
}

export default uuidv4
