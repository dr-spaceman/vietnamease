// @ts-nocheck

/**
 * Expands an object with nested keys into a fully expanded object.
 * Eg. {'examples[0]':'foo', 'examples[1]':'bar'} => {examples: ['foo', 'bar']
 *
 * @param input The object to expand.
 * @returns The expanded object.
 */
function expandObject(input: any) {
  const result = {}

  for (const key in input) {
    const parts = key.split(/[\[\].]+/).filter(Boolean)
    let current = result

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      const nextPart = parts[i + 1]
      current[part] = current[part] || (isNaN(nextPart) ? {} : [])
      current = current[part]
    }

    current[parts[parts.length - 1]] = input[key]
  }

  return result
}

export default expandObject
