import { gsap } from 'gsap'
import { useReducedMotion } from 'framer-motion'
import { useLayoutEffect, useRef, useState } from 'react'
import { EMAIL, GITHUB } from '../data/content'
import { Heading } from './Heading'
import { Reveal } from './Reveal'
import { VideoBackground } from './VideoBackground'

const HERO_VIDEO = import.meta.env.VITE_HERO_HLS_URL
const MARQUEE = 'OPEN TO WORK • JUNIOR FRONTEND • VUE 3 • TYPESCRIPT • '

export function Contact() {
  const reduce = useReducedMotion()
  const track = useRef<HTMLDivElement>(null)
  const [video, setVideo] = useState<'playing' | 'failed' | 'none'>('none')

  // GSAP horizontal marquee: two identical halves, translate by -50% forever.
  useLayoutEffect(() => {
    if (reduce || !track.current) return
    const tween = gsap.to(track.current, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
    return () => { tween.kill() }
  }, [reduce])

  return (
    <section id="contact" data-nav="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden border-t border-stroke bg-bg pt-16 md:pt-20">
      {/* Cinematic visual: flipped licensed video when configured; otherwise a drifting blue-silver glow. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_105%,rgba(78,133,191,.28),transparent_70%),radial-gradient(40%_35%_at_15%_90%,rgba(137,170,204,.14),transparent_70%)]" />
        <div className={`absolute inset-0 transition-opacity duration-700 ${video === 'playing' ? 'opacity-100' : 'opacity-0'}`}>
          <VideoBackground src={HERO_VIDEO} flipped deferUntilNear onState={setVideo} />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg to-transparent" />
      </div>

      <div className="shell flex flex-col items-center pb-[clamp(56px,7vw,88px)] pt-[clamp(32px,5vw,64px)] text-center">
        <Reveal className="w-full">
          <Heading id="contact-title" align="center" eyebrow="聯絡" sub="正在尋找 Junior 前端工程師機會，歡迎來信或查看 GitHub。">
            Let’s build <em>something</em> real
          </Heading>
        </Reveal>
        <Reveal className="mt-10 flex flex-wrap justify-center gap-3.5 max-sm:w-full max-sm:flex-col" delay={0.1}>
          <a href={`mailto:${EMAIL}`} className="btn btn--solid btn--lg glow-ring max-sm:[&>span]:w-full max-sm:[&>span]:justify-center">
            <span>{EMAIL} <b aria-hidden="true" className="font-normal">↗</b></span>
          </a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--lg glow-ring max-sm:[&>span]:w-full max-sm:[&>span]:justify-center">
            <span>瀏覽 GitHub <b aria-hidden="true" className="font-normal">↗</b></span>
          </a>
        </Reveal>
      </div>

      <div aria-hidden="true" className="overflow-hidden border-y border-stroke py-5">
        <div ref={track} className={`flex w-max whitespace-nowrap font-display text-[clamp(36px,6vw,80px)] leading-none text-text-primary/80 ${reduce ? '' : 'will-change-transform'}`}>
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className="pr-6">{MARQUEE}</span>
          ))}
        </div>
      </div>

      <footer className="shell flex min-h-[76px] flex-wrap items-center justify-between gap-x-5 gap-y-1 text-[13px] text-muted">
        <span className="inline-flex items-center gap-2.5">
          <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-[#c4c7c5]" />
          Open to work · Junior Frontend
        </span>
        <span>© {new Date().getFullYear()}</span>
        <a href="#top" className="inline-flex min-h-11 items-center no-underline hover:text-text-primary">回到頂部 <span aria-hidden="true" className="ml-1">↑</span></a>
      </footer>
    </section>
  )
}
