function extractJson(inputString: string) {
  try {
    const jsonMatch = inputString
      .replace(/(?:\r\n|\r|\n)/g, '')
      .match(/\{.*\}|\[.*\]/)

    if (jsonMatch) {
      const jsonString = jsonMatch[0]
      const jsonObject = JSON.parse(jsonString)
      return jsonObject
    }

    return null
  } catch (error: unknown) {
    console.error('Error extracting JSON:', error)

    return null
  }
}

export default extractJson
