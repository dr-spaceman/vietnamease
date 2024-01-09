import * as React from 'react'
import { Page } from 'matterial'

type Data = {
  error?: { code: string; info: string; '*': string }
}

async function getData() {
  const res = await fetch(
    `https://en.wiktionary.org/w/api.php?action=parse&page=${searchTerm}&format=json`
  )
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Something went wrong :(')
  }

  const data: Data = await res.json()

  if (data.error) {
    console.error(data.error)
    throw new Error(data.error.info ?? 'Something went wrong :(')
  }

  return data
}

export default async function DPage() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [searchResults, setSearchResults] = React.useState<Data | null>(null)

  getData().then(setSearchResults)

  return <Page noNav>{JSON.stringify(searchResults, null, 2)}</Page>
}
