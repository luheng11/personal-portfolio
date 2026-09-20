import { Fragment, type ReactNode } from 'react'

export function accentText(text: string, highlight = ''): ReactNode {
  const lines = text.replace(/\r/g, '').split('\n')
  return lines.map((line, index) => {
    const pos = highlight ? line.indexOf(highlight) : -1
    return (
      <Fragment key={index}>
        {index > 0 && <br />}
        {pos >= 0 ? (
          <>
            {line.slice(0, pos)}
            <span className="accent">{highlight}</span>
            {line.slice(pos + highlight.length)}
          </>
        ) : line}
      </Fragment>
    )
  })
}
