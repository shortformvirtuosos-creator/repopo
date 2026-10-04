// Input rules for the engraving: letters (latin or Cyrillic), spaces and
// hyphens only, at most 18 characters per field.

export const MAX_CHARS = 18

/** Filter text while the visitor types. Keeps a trailing space so typing feels natural. */
export function sanitize(value: string): string {
  let s = value.normalize('NFC').replace(/[^\p{L}\p{M} -]/gu, '')
  s = s.replace(/ {2,}/g, ' ').replace(/-{2,}/g, '-').replace(/^[ -]+/, '')
  return Array.from(s).slice(0, MAX_CHARS).join('')
}

/** Final form used for engraving, links and the share image. */
export function clean(value: string): string {
  return sanitize(value).replace(/[ -]+$/, '').trim()
}

export const upper = (s: string) => s.toLocaleUpperCase('bs')

/** "banja luka" -> "Banja Luka", keeps whatever the visitor typed otherwise. */
export function titleCase(s: string): string {
  return s.replace(/(^|[ -])(\p{L})/gu, (_m, a: string, b: string) => a + b.toLocaleUpperCase('bs'))
}

const CYR: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ђ: 'dj', е: 'e', ж: 'z', з: 'z', и: 'i', ј: 'j', к: 'k',
  л: 'l', љ: 'lj', м: 'm', н: 'n', њ: 'nj', о: 'o', п: 'p', р: 'r', с: 's', т: 't', ћ: 'c', у: 'u',
  ф: 'f', х: 'h', ц: 'c', ч: 'c', џ: 'dz', ш: 's',
}

/** ASCII slug for file names: "Hodžić" -> "hodzic", "Петровић" -> "petrovic". */
export function slug(s: string): string {
  return Array.from(s.toLocaleLowerCase('bs'))
    .map((c) => CYR[c] ?? (c === 'đ' ? 'dj' : c))
    .join('')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
