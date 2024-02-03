// const BASE = '10000000-1000-4000-8000-100000000000'
const BASE = '10000000-1000-4000-8000-100000000000'

function uuidv4(): string {
  const crypto = window.crypto || (window as any).msCrypto

  return BASE.replace(/[018]/g, (c: string) =>
    (
      parseInt(c, 16) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] &
        (15 >> (parseInt(c, 16) / 4)))
    ).toString(16)
  )
}

function shortUniqueId(): string {
  const crypto = window.crypto || (window as any).msCrypto

  const array = new Uint8Array(6) // Adjust the array size for your desired length
  crypto.getRandomValues(array)

  const base64 = btoa(String.fromCharCode(...array))

  const shortId = base64.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)

  return shortId
}

export default shortUniqueId
export { uuidv4 }
