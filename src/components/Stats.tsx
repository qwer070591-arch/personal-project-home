import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { stats, workflow } from '../data/content'
import { Heading } from './Heading'
import { Reveal } from './Reveal'

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(reduce ? to : 0)
  useEffect(() => {
    if (reduce) { setValue(to); return }
    if (!inView) return
    const controls = animate(0, to, { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [inView, reduce, to])
  return <span ref={ref}>{value}</span>
}

/** Stats are counts derived from the real project data (no invented years, clients or satisfaction scores). */
export function Stats() {
  const items = [
    { n: stats.projects, label: 'Live projects', note: '四個可線上操作的前端作品' },
    { n: stats.technologies, label: 'Technologies', note: '專案中實際使用的前端技術' },
    { n: stats.typescriptProjects, label: 'TypeScript projects', note: `四個專案中的 ${stats.typescriptProjects} 個` },
  ]
  return (
    <section id="stats" data-nav="skills" aria-labelledby="stats-title" className="border-t border-stroke py-[clamp(64px,9vw,120px)]">
      <div className="shell">
        <Reveal className="mb-[clamp(32px,4vw,56px)]">
          <Heading id="stats-title" eyebrow="數字" sub="由上方真實作品資料統計而成。">
            By the <em>numbers</em>
          </Heading>
        </Reveal>
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
          {items.map((s, i) => (
            <li key={s.label}>
              <Reveal delay={i * 0.08}>
                <div className="rounded-3xl border border-stroke bg-surface px-7 py-8">
                  <p className="m-0 font-display text-[clamp(64px,8vw,104px)] leading-none tabular-nums"><Count to={s.n} /></p>
                  <p className="mt-4 text-[13px] font-medium uppercase tracking-[0.2em] text-text-primary">{s.label}</p>
                  <p className="mt-1.5 text-sm text-muted">{s.note}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <Reveal className="mt-6">
          <div className="flex flex-wrap items-center gap-2.5 rounded-3xl border border-stroke px-7 py-5">
            <span className="mr-2 text-[13px] text-muted">開發流程</span>
            {workflow.map((w) => (
              <span key={w} className="rounded-full border border-stroke px-3.5 py-1.5 text-xs text-muted">{w}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
