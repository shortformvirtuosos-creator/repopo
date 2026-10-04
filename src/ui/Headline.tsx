/**
 * Anton headline, one line per phrase. Each line sits in its own mask (with
 * room above the capitals so Č Ć Š Ž Đ never clip) and slides up into view.
 * Give `phoneLines` when the phone layout breaks the lines differently; the
 * size is set by the layout code so the widest line fits its zone.
 */
export function Headline({
  lines,
  phoneLines,
  as: Tag = 'h2',
  className = '',
}: {
  lines: string[]
  phoneLines?: string[]
  as?: 'h1' | 'h2'
  className?: string
}) {
  const variants: [string, string[]][] = phoneLines
    ? [
        ['v-desk', lines],
        ['v-phone', phoneLines],
      ]
    : [['v-all', lines]]
  return (
    <Tag className={`headline ${className}`} aria-label={lines.join(' ')}>
      {variants.map(([cls, ls]) => (
        <span className={`hl-set ${cls}`} key={cls} aria-hidden="true">
          {ls.map((l, i) => (
            <span className="mask" key={i}>
              <span>{l}</span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
