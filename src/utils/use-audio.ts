import * as React from 'react'

interface AudioCache {
  [key: string]: ArrayBuffer
}

// How many audio buffers to keep in memory
const CACHE_LIMIT = 20

function useAudio() {
  const cache = React.useRef(new Map<string, ArrayBuffer>()).current
  const audioContext = React.useRef<AudioContext | null>()

  React.useEffect(() => {
    audioContext.current = new (window.AudioContext || // @ts-ignore
      window.webkitAudioContext)()

    return () => {
      if (audioContext.current) {
        audioContext.current.close()
        audioContext.current = null
      }
    }
  }, [])

  const playAudio = async (word: string) => {
    try {
      let arrayBuffer: ArrayBuffer
      if (cache.has(word)) {
        arrayBuffer = cache.get(word)!
      } else {
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
      // Make a copy of the array buffer to avoid it being mutated
      const newArrayBuffer = new ArrayBuffer(arrayBuffer.byteLength)
      new Uint8Array(newArrayBuffer).set(new Uint8Array(arrayBuffer))
      const decodedAudioData = await audioContext.current.decodeAudioData(
        newArrayBuffer
      )
      const source = audioContext.current.createBufferSource()
      source.buffer = decodedAudioData
      source.connect(audioContext.current.destination)
      source.start(0)
    } catch (error) {
      console.error('Error fetching or playing audio:', error)
    }
  }

  return { playAudio }
}

export default useAudio
