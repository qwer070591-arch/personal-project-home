import { gsap } from 'gsap'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { EMAIL } from '../data/content'
import { ChromeSculpture } from './ChromeSculpture'
import { VideoBackground } from './VideoBackground'

const ROLES = ['Vue 3', 'TypeScript', 'Pinia', 'GSAP']
// Optional licensed HLS video. Empty by default: the original third-party stream could not be verified
// as usable (it returns HTTP 403) and its license is unknown, so the WebGL sculpture is the visual.
const HERO_VIDEO = import.meta.env.VITE_HERO_HLS_URL

export function Hero({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const [roleIndex, setRoleIndex] = useState(0)
  const [video, setVideo] = useState<'playing' | 'failed' | 'none'>('none')

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.1])

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 2000)
    return () => clearInterval(id)
  }, [reduce])

  // GSAP entrance: starts once the loading screen is gone. Elements stay hidden until then (no flash).
  useLayoutEffect(() => {
    const el = content.current
    if (!el) return
    const ctx = gsap.context(() => {
      if (reduce) return
      gsap.set('.name-reveal, .blur-in', { opacity: 0 })
      if (!ready) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('.name-reveal', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2 }, 0.1)
        .fromTo('.blur-in', { opacity: 0, filter: 'blur(10px)', y: 20 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1, clearProps: 'filter' }, 0.3)
    }, el)
    return () => ctx.revert()
  }, [ready, reduce])

  const showSculpture = video !== 'playing'

  return (
    <section ref={section} aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-bg text-center max-sm:items-end">
      <div className={`absolute inset-0 -z-20 transition-opacity duration-700 ${video === 'playing' ? 'opacity-100' : 'opacity-0'}`}>
        <VideoBackground src={HERO_VIDEO} onState={setVideo} />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <ChromeSculpture
        host={section}
        active={ready}
        className={`absolute -z-10 aspect-square w-[min(96vw,92svh,900px)] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:top-[7svh] max-sm:w-[min(118vw,54svh)] max-sm:translate-y-0 ${showSculpture ? '' : 'invisible'}`}
      />
      {/* Text scrim: radial on larger screens, bottom-up gradient on phones so the sculpture stays visible. */}
      <div aria-hidden="true" className="absolute inset-0 -z-[5] hidden bg-[radial-gradient(ellipse_58%_52%_at_50%_50%,rgba(10,10,10,.9),rgba(10,10,10,.45)_70%,transparent)] sm:block" />
      <div aria-hidden="true" className="absolute inset-0 -z-[5] bg-[linear-gradient(to_top,hsl(var(--bg))_0,transparent_24%),linear-gradient(to_bottom,rgba(10,10,10,.6),transparent_18%)] max-sm:bg-[linear-gradient(to_top,hsl(var(--bg))_0,rgba(10,10,10,.92)_38%,transparent_62%),linear-gradient(to_bottom,rgba(10,10,10,.6),transparent_14%)]" />

      <m.div
        ref={content}
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative flex w-[min(100%-2*clamp(20px,5vw,64px),900px)] flex-col items-center pb-[120px] pt-[130px] max-sm:pb-24 max-sm:pt-[50svh]"
      >
        <p className="blur-in mb-7 text-xs font-medium uppercase tracking-[0.3em] text-[#a0a0a0] max-sm:text-[11px] max-sm:tracking-[0.22em]">Open to work · Junior Frontend</p>
        <h1 id="hero-title" className="name-reveal mb-6 font-display text-[clamp(52px,10.4vw,144px)] font-normal italic leading-[.92] tracking-[-0.02em] [text-wrap:balance] max-sm:text-[clamp(50px,15.5vw,78px)]">
          Junior Frontend <em className="text-accent-gradient">Developer</em>
        </h1>
        <p className="blur-in mb-3.5 text-[clamp(17px,2vw,22px)]">
          以{' '}
          <em key={roleIndex} className="animate-role-fade-in inline-block text-[1.3em] leading-none">
            {ROLES[roleIndex]}
          </em>{' '}
          打造可以直接操作的介面。
        </p>
        <p className="blur-in mb-10 max-w-[460px] text-[clamp(14px,1.4vw,16px)] leading-[1.75] text-[#a9a9a9]">
          我專注於響應式網頁與互動介面，下方四個專案都能線上試用，正在尋找第一份前端工程師職位。
        </p>
        <div className="blur-in inline-flex flex-wrap justify-center gap-3.5">
          <a href="#work" className="btn btn--solid glow-ring"><span>查看作品</span></a>
          <a href={`mailto:${EMAIL}`} className="btn btn--outline glow-ring"><span>寫信聯絡</span></a>
        </div>
      </m.div>

      <a href="#work" className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-muted no-underline max-sm:hidden">
        <span>Scroll<span className="sr-only"> 向下捲動到作品</span></span>
        <span aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-stroke">
          <i className="animate-scroll-down absolute inset-x-0 top-0 h-1/2 bg-[#89aacc]" />
        </span>
      </a>
    </section>
  )
}
