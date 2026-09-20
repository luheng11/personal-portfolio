interface MarqueeProps {
  items: string[]
}

export default function Marquee({ items }: MarqueeProps) {
  const loop = [...items, ...items]

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="marquee-item">
            {item}
            <i />
          </span>
        ))}
      </div>
    </div>
  )
}
