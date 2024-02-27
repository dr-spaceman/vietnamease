import * as React from 'react'

interface AudioCache {
  [key: string]: ArrayBuffer
}

function useAudio() {
  const [cache, setCache] = React.useState<AudioCache>({})
  const audioContext = React.useRef<AudioContext>()

  if (!audioContext.current) {
    audioContext.current = new (window.AudioContext || // @ts-ignore
      window.webkitAudioContext)()
  }

  const playAudio = async (word: string) => {
    try {
      let arrayBuffer: ArrayBuffer
      if (word in cache) {
        arrayBuffer = cache[word]
      } else {
        const response = await fetch(`/api/generate-audio`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word }),
        })
        arrayBuffer = await response.arrayBuffer()
        setCache(cache_ => ({ ...cache_, [word]: arrayBuffer }))
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
