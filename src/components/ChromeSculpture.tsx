import { useEffect, useRef, useState } from 'react'
import { startChrome } from '../lib/chrome'

interface Props {
  /** Element that supplies pointer, visibility and scroll progress (the Hero section). */
  host: React.RefObject<HTMLElement | null>
  /** Start rendering only when true (kept off while the loading screen is shown). */
  active?: boolean
  className?: string
}

/** WebGL2 chrome sculpture with a CSS illustration as fallback when WebGL2 is unavailable or lost. */
export function ChromeSculpture({ host, active = true, className = '' }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<'pending' | 'webgl' | 'fallback'>('pending')

  useEffect(() => {
    if (!active || !canvas.current || !host.current) return
    const el = canvas.current
    const root = host.current
    // Phones: show the CSS sculpture first and start WebGL once the page has settled, so shader compile and
    // first draw do not block the initial render (measured: mobile TBT ~1.7 s -> ~0.28 s, see output/v3-opt).
    if (matchMedia('(max-width: 700px)').matches) {
      // Reduced motion: the CSS illustration is enough, never create a GL context on phones.
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
      let stop: (() => void) | undefined
      let io: IntersectionObserver | undefined
      const begin = () => { if (!stop) stop = startChrome(el, root, setState) }
      const t = window.setTimeout(() => {
        // Only initialise while the Hero is on screen; otherwise wait until it becomes visible again.
        io = new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) return
          io?.disconnect()
          begin()
        })
        io.observe(root)
      }, 1500)
      return () => { clearTimeout(t); io?.disconnect(); stop?.() }
    }
    return startChrome(el, root, setState)
  }, [host, active])

  return (
    <div aria-hidden="true" data-rendering={state} className={`pointer-events-none ${className}`}>
      <div className={`absolute inset-0 ${state === 'webgl' ? 'invisible' : ''} animate-[sculpture-float_7s_ease-in-out_infinite_alternate]`}>
        <span className="sculpture-ring" style={{ inset: '14%', transform: 'rotate(-27deg) scaleX(.7)', background: 'linear-gradient(#0a0a0a,#0a0a0a) padding-box, conic-gradient(from 30deg,#272d2c,#e0e4e2 9%,#343a39 20%,#090b0a 34%,#bdc4c0 48%,#3c4240 60%,#f4f6f2 72%,#1f2624 84%,#353c3a) border-box' }} />
        <span className="sculpture-ring" style={{ inset: '24%', transform: 'rotate(54deg) scaleX(.66)', background: 'linear-gradient(transparent,transparent) padding-box, conic-gradient(from 100deg,#080a09,#f1f3f0 18%,#39413d 29%,#c4cbc6 43%,#131715 57%,#e2e8e2 77%,#090c0a) border-box' }} />
        <span className="sculpture-ring" style={{ inset: '31%', transform: 'rotate(-64deg) scaleX(.57)', borderWidth: 'clamp(18px,3vw,44px)', background: 'linear-gradient(transparent,transparent) padding-box, conic-gradient(from 10deg,#aeb7b1,#191d1b,#edf0ed 43%,#080b09 61%,#777f79 86%,#d7dcd8) border-box' }} />
        <span className="absolute rounded-full" style={{ inset: '42%', background: 'radial-gradient(circle at 35% 25%,#f3f5f2,#65716a 29%,#080b09 70%)' }} />
      </div>
      <canvas ref={canvas} className={`absolute inset-0 h-full w-full ${state === 'webgl' ? '' : 'invisible'}`} />
    </div>
  )
}
