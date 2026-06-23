import { useEffect, useRef, useState } from 'react'

const ROW_1 = [
  '/marquee/marquee_01.webp',
  '/marquee/marquee_02.webp',
  '/marquee/marquee_03.webp',
  '/marquee/marquee_04.webp',
]
const ROW_2 = [
  '/marquee/marquee_05.webp',
  '/marquee/marquee_06.webp',
  '/marquee/marquee_07.webp',
]

function Tile({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      className="rounded-2xl object-cover shrink-0"
      style={{ width: 420, height: 270 }}
    />
  )
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const sectionTop = el.getBoundingClientRect().top + window.scrollY
      const raw =
        (window.scrollY - sectionTop + window.innerHeight) * 0.3
      setOffset(raw)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Triple the arrays for seamless coverage
  const row1 = [...ROW_1, ...ROW_1, ...ROW_1]
  const row2 = [...ROW_2, ...ROW_2, ...ROW_2]

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden"
    >
      <div className="flex flex-col gap-3">
        {/* Row 1 — moves RIGHT on scroll */}
        <div
          className="flex gap-3"
          style={{
            transform: `translateX(${offset - 200}px)`,
            willChange: 'transform',
          }}
        >
          {row1.map((src, i) => (
            <Tile key={`r1-${i}`} src={src} />
          ))}
        </div>

        {/* Row 2 — moves LEFT on scroll */}
        <div
          className="flex gap-3"
          style={{
            transform: `translateX(${-(offset - 200)}px)`,
            willChange: 'transform',
          }}
        >
          {row2.map((src, i) => (
            <Tile key={`r2-${i}`} src={src} />
          ))}
        </div>
      </div>
    </section>
  )
}
