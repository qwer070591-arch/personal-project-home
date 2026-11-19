import { AnimatePresence, m } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const WORDS = ['Design', 'Create', 'Inspire']
const DURATION = 2700

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const countEl = useRef<HTMLParagraphElement>(null)
  const barEl = useRef<HTMLDivElement>(null)
  const [wordIndex, setWordIndex] = useState(0)
  const doneRef = useRef(false)
  const finish = useRef(onComplete)
  finish.current = onComplete

  useEffect(() => {
    document.documentElement.classList.add('is-loading')
    let raf = 0
    let timer = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1)
      const n = Math.round(progress * 100)
      if (countEl.current) countEl.current.textContent = String(n).padStart(3, '0')
      if (barEl.current) barEl.current.style.transform = `scaleX(${progress})`
      if (progress < 1) raf = requestAnimationFrame(tick)
      else
        timer = window.setTimeout(() => {
          if (!doneRef.current) {
            doneRef.current = true
            finish.current()
          }
        }, 400)
    }
    raf = requestAnimationFrame(tick)
    const words = window.setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 900)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
      clearInterval(words)
      document.documentElement.classList.remove('is-loading')
    }
  }, [])

  const skip = () => {
    if (!doneRef.current) {
      doneRef.current = true
      finish.current()
    }
  }

  return (
    <m.div
      className="fixed inset-0 z-[9999] bg-bg"
      role="status"
      aria-label="頁面載入中"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <m.p
        className="absolute left-6 top-6 text-xs uppercase tracking-[0.3em] text-muted md:left-10 md:top-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Portfolio
      </m.p>
      <button
        type="button"
        onClick={skip}
        className="absolute right-6 top-4 z-10 min-h-11 px-2 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-text-primary md:right-10 md:top-8"
      >
        略過
      </button>
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <m.span
            key={WORDS[wordIndex]}
            className="font-display text-4xl italic text-text-primary/80 md:text-6xl lg:text-7xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {WORDS[wordIndex]}
          </m.span>
        </AnimatePresence>
      </div>
      <p ref={countEl} className="absolute bottom-10 right-6 w-[3.4ch] text-right font-display text-6xl tabular-nums text-text-primary md:right-10 md:text-8xl lg:text-9xl" aria-hidden="true">
        000
      </p>
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-stroke/50" aria-hidden="true">
        <div ref={barEl} className="accent-gradient h-full origin-left will-change-transform" style={{ transform: 'scaleX(0)', boxShadow: '0 0 8px rgba(137,170,204,.35)' }} />
      </div>
    </m.div>
  )
}
