export type Data = Translation[] | null

export type Translation = { [K in Language]: string }
