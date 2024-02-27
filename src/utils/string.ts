export const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1)

export const toPascalCase = (s: string): string =>
  s.split('-').map(capitalize).join('')

export const toKebabCase = (s: string): string =>
  s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

export const formatFilename = (phrase: string): string => {
  return phrase
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[\/\?<>\\:\*\|"]/g, '') // Remove invalid filename characters
    .replace(/\s+/g, '') // Remove extra spaces
    .toLowerCase() // Convert to lowercase to ensure consistency
}
