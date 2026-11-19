import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'framer-motion'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { explorations, GITHUB } from '../data/content'
import { Heading } from './Heading'
import { Lightbox } from './Lightbox'

gsap.registerPlugin(ScrollTrigger)

/**
 * Desktop (>=1024px, motion allowed): pinned centre content + two parallax columns driven by GSAP ScrollTrigger.
 * Phones/tablets and reduced motion: no pin and no parallax — a native horizontal scroll-snap strip (lighter).
 * Images are crops of the owner's own project screenshots.
 */
export function Explorations() {
  const reduce = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const colA = useRef<HTMLDivElement>(null)
  const colB = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState<number | null>(null)
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null)
  const [last, setLast] = useState(0)

  useLayoutEffect(() => {
    if (!section.current || !pin.current) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      ScrollTrigger.create({ trigger: section.current, start: 'top top', end: 'bottom bottom', pin: pin.current, pinSpacing: false })
      const scrub = { trigger: section.current, start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.fromTo(colA.current, { y: '18vh' }, { y: '-34vh', ease: 'none', scrollTrigger: scrub })
      gsap.fromTo(colB.current, { y: '52vh' }, { y: '-84vh', ease: 'none', scrollTrigger: scrub })
      gsap.set('[data-explore-item]', { rotation: (i: number) => (i % 2 ? 3 : -3) })
    })
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => {
      window.removeEventListener('load', refresh)
      mm.revert()
    }
  }, [])

  const open = (i: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
    setIndex(i)
    setLast(i)
  }
  const close = useCallback(() => {
    setIndex(null)
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-explore-card="${explorations[last].id}"]`)?.focus({ preventScroll: true }))
  }, [last])
  const step = (dir: number) =>
    setIndex((i) => {
      const next = (((i ?? 0) + dir) % explorations.length + explorations.length) % explorations.length
      setLast(next)
      return next
    })

  const card = (e: (typeof explorations)[number], i: number) => (
    <button
      key={e.id}
      type="button"
      data-explore-item
      data-explore-card={e.id}
      aria-haspopup="dialog"
      aria-label={`${e.title}，放大檢視`}
      onClick={(ev) => open(i, ev.currentTarget)}
      className="group relative aspect-[4/5] w-[min(78vw,320px)] shrink-0 snap-center overflow-hidden rounded-3xl border border-stroke bg-surface lg:pointer-events-auto lg:aspect-square lg:w-[320px]"
    >
      <img
        src={e.image}
        alt=""
        width={1440}
        height={900}
        loading="lazy"
        decoding="async"
        style={{ objectPosition: e.pos }}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/95 to-transparent px-4 pb-4 pt-12 text-left text-sm">{e.title}</span>
    </button>
  )

  const half = Math.ceil(explorations.length / 2)
  return (
    <section ref={section} id="explorations" data-nav="work" aria-labelledby="explorations-title" className="relative border-t border-stroke py-[clamp(64px,9vw,120px)] lg:min-h-[300vh] lg:py-0">
      <div ref={pin} className={`relative z-10 flex flex-col items-center justify-center px-6 text-center lg:h-screen ${reduce ? 'lg:sticky lg:top-0' : ''}`}>
        <Heading id="explorations-title" align="center" eyebrow="視覺探索" sub="從四個專案的實際介面中截取的畫面；點擊可放大檢視。">
          Visual <em>playground</em>
        </Heading>
        <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--sm glow-ring mt-8">
          <span>GitHub <b aria-hidden="true" className="font-normal">↗</b></span>
        </a>
      </div>
      <div className="relative z-20 mx-auto mt-12 flex max-w-[1400px] snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 lg:absolute lg:inset-x-0 lg:top-0 lg:mt-0 lg:grid lg:h-full lg:snap-none lg:grid-cols-2 lg:gap-40 lg:overflow-visible lg:px-0 lg:pb-0 lg:pointer-events-none">
        <div ref={colA} className="contents lg:flex lg:flex-col lg:items-end lg:gap-[42vh] lg:pt-[78vh]">
          {explorations.slice(0, half).map((e, i) => (
            card(e, i)
          ))}
        </div>
        <div ref={colB} className="contents lg:flex lg:flex-col lg:items-start lg:gap-[42vh] lg:pt-[120vh]">
          {explorations.slice(half).map((e, i) => (
            card(e, i + half)
          ))}
        </div>
      </div>
      <Lightbox index={index} items={explorations} origin={origin} onClose={close} onStep={step} />
    </section>
  )
}

export default Explorations
