import * as React from 'react'

type State = {
  loading: boolean
}

// How many audio buffers to keep in memory
const CACHE_LIMIT = 20

const defaultState: State = { loading: false }

function useAudio() {
  const cache = React.useRef(new Map<string, ArrayBuffer>()).current
  const audioContext = React.useRef<AudioContext | null>()
  const [audioState, setState] = React.useState<State>(defaultState)

  React.useEffect(() => {
    return () => {
      if (audioContext.current) {
        audioContext.current.close()
        audioContext.current = null
      }
    }
  }, [])

  const playAudio = async (word: string) => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || // @ts-ignore
        window.webkitAudioContext)()
    }

    let arrayBuffer: ArrayBuffer
    if (cache.has(word)) {
      arrayBuffer = cache.get(word)!
    } else {
      // Only indicate loading state if the audio is not in the cache
      setState(audioState => ({ ...audioState, loading: true }))

      const response = await fetch(`/api/generate-audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word }),
      })
      arrayBuffer = await response.arrayBuffer()
      if (cache.size >= CACHE_LIMIT) {
        const oldestKey = cache.keys().next().value
        cache.delete(oldestKey)
      }
      cache.set(word, arrayBuffer)
    }
    if (!audioContext.current) {
      throw new Error('Audio context not found.')
    }

    // AudioContext must be resumed after the document received a user gesture to enable audio playback.
    audioContext.current.resume()

    // Make a copy of the array buffer to avoid it being mutated
    const newArrayBuffer = new ArrayBuffer(arrayBuffer.byteLength)
    new Uint8Array(newArrayBuffer).set(new Uint8Array(arrayBuffer))
    const decodedAudioData = await audioContext.current.decodeAudioData(
      newArrayBuffer
    )

    const source = audioContext.current.createBufferSource()
    source.buffer = decodedAudioData
    source.connect(audioContext.current.destination)
    source.start(0) // Play immediately

    setState(audioState => ({ ...audioState, loading: false }))
  }

  return { playAudio, audioState }
}

export default useAudio
