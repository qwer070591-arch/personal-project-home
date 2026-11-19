import { useCallback, useState } from 'react'
import { GITHUB, projects } from '../data/content'
import { Heading } from './Heading'
import { ProjectDialog } from './ProjectDialog'
import { Reveal } from './Reveal'

export function SelectedWorks() {
  const [index, setIndex] = useState<number | null>(null)
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null)
  const [last, setLast] = useState(0)

  const open = (i: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
    setIndex(i)
    setLast(i)
  }
  const close = useCallback(() => {
    setIndex(null)
    // Return focus to the card of the project that was last shown.
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-project-card="${projects[last].id}"]`)?.focus({ preventScroll: true }))
  }, [last])
  const step = (dir: number) =>
    setIndex((i) => {
      const next = (((i ?? 0) + dir) % projects.length + projects.length) % projects.length
      setLast(next)
      return next
    })

  return (
    <section id="work" data-nav="work" aria-labelledby="work-title" className="bg-bg py-[clamp(64px,9vw,120px)]">
      <div className="shell">
        <Reveal className="mb-[clamp(32px,4vw,56px)] flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start">
          <Heading id="work-title" eyebrow="精選作品" sub="四個以 Vue 3 開發的介面專案。點擊卡片查看畫面、技術與連結。">
            Selected <em>work</em>
          </Heading>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--sm glow-ring shrink-0">
            <span>GitHub <b aria-hidden="true" className="font-normal">↗</b></span>
          </a>
        </Reveal>

        <ol className="grid list-none grid-cols-1 gap-4 p-0 md:auto-rows-[clamp(320px,33vw,450px)] md:grid-cols-12 md:gap-6">
          {projects.map((p, i) => (
            <li key={p.id} id={`project-${p.id}`} className={`glow-ring glow-ring--anim rounded-[28px] ${p.span === 7 ? 'md:col-span-7' : 'md:col-span-5'}`}>
              <Reveal className="h-full" delay={(i % 2) * 0.09}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-stroke bg-surface transition-colors duration-300 hover:border-[#4e85bf]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#181818] md:aspect-auto md:min-h-0 md:flex-1">
                    <img
                      src={p.image}
                      alt={p.alt}
                      width={1440}
                      height={900}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* hover/focus overlay (pointer devices); touch devices keep the always-visible pill below */}
                    <div aria-hidden="true" className="absolute inset-0 hidden items-center justify-center bg-bg/70 opacity-0 backdrop-blur-lg transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:hover)]:flex">
                      <span className="animate-gradient-shift accent-gradient rounded-full p-0.5">
                        <span className="block rounded-full bg-white px-6 py-3 text-sm font-medium text-[#0a0a0a]">
                          View — <em className="text-base">{p.title}</em>
                        </span>
                      </span>
                    </div>
                    <span aria-hidden="true" className="absolute right-3 top-3 inline-flex min-h-[34px] items-center gap-2 rounded-full bg-[#f5f5f5]/95 px-3.5 text-xs font-semibold text-[#0a0a0a] [@media(hover:hover)]:hidden">
                      查看詳情 ↗
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-col justify-center border-t border-stroke bg-surface px-[22px] py-5 md:h-[124px] md:px-[26px] md:py-0">
                    <h3 className="font-display text-[clamp(30px,3vw,40px)] font-normal italic leading-none">{p.title}</h3>
                    <p className="mt-1.5 text-[13px] tracking-wide text-[#89aacc]">{p.category}</p>
                    <p className="mt-1.5 text-sm text-[#cfcfcf]">{p.lead}</p>
                  </div>
                  <button
                    type="button"
                    data-project-card={p.id}
                    aria-haspopup="dialog"
                    aria-label={`${p.title}，${p.category}。查看作品詳情`}
                    onClick={(e) => open(i, e.currentTarget)}
                    className="absolute inset-0 rounded-[inherit] focus-visible:outline-offset-[-6px]"
                  />
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
      <ProjectDialog index={index} items={projects} origin={origin} onClose={close} onStep={step} />
    </section>
  )
}
