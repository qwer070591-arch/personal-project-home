import { insights, projects } from '../data/content'
import { Heading } from './Heading'
import { Reveal } from './Reveal'

/** Horizontal pill list of real "project insights" (each statement comes from that project's README). */
export function Journal() {
  return (
    <section id="journal" data-nav="work" aria-labelledby="journal-title" className="bg-bg py-[clamp(64px,9vw,120px)]">
      <div className="shell">
        <Reveal className="mb-[clamp(32px,4vw,56px)]">
          <Heading id="journal-title" eyebrow="開發筆記" sub="整理自各專案文件的實作重點，附連結可查看原始說明。">
            Project <em>insights</em>
          </Heading>
        </Reveal>
        <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
          {insights.map((n, i) => {
            const p = projects.find((x) => x.id === n.projectId)!
            return (
              <li key={n.id}>
                <Reveal delay={i * 0.06}>
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-6 rounded-[40px] border border-stroke bg-surface/30 p-4 no-underline transition-colors duration-300 hover:border-[#3a5878] hover:bg-surface max-sm:flex-col max-sm:items-start max-sm:gap-4 sm:rounded-full sm:pr-8"
                  >
                    <span className="block h-[88px] w-[140px] shrink-0 overflow-hidden rounded-[28px] bg-[#181818] max-sm:h-[150px] max-sm:w-full sm:rounded-full">
                      <img src={p.image} alt="" width={1440} height={900} loading="lazy" decoding="async" className="h-full w-full object-cover object-left-top transition-transform duration-700 group-hover:scale-110" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="mb-1.5 block text-xs tracking-wider text-[#89aacc]">{n.project} · {n.topic}</span>
                      <span className="block font-display text-[clamp(22px,2.4vw,30px)] leading-tight">{n.title}<span className="sr-only">（開啟專案文件，新分頁）</span></span>
                      <span className="mt-2 block max-w-[70ch] text-sm leading-[1.7] text-muted">{n.summary}</span>
                    </span>
                    <span className="hidden shrink-0 flex-wrap justify-end gap-1.5 md:flex">
                      {n.tags.map((t) => (
                        <span key={t} className="rounded-full border border-stroke px-3 py-1.5 text-xs text-muted">{t}</span>
                      ))}
                    </span>
                    <span aria-hidden="true" className="hidden shrink-0 text-lg text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-primary sm:block">↗</span>
                  </a>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
