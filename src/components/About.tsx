import { aboutText, resumeFacts, skills } from '../data/content'
import { Heading } from './Heading'
import { Reveal } from './Reveal'

export function About() {
  return (
    <>
      <section id="about" data-nav="about" aria-labelledby="about-title" className="border-t border-stroke py-[clamp(64px,9vw,120px)]">
        <div className="shell grid items-start gap-[clamp(32px,6vw,96px)] lg:grid-cols-[5fr_7fr]">
          <Reveal>
            <Heading id="about-title" eyebrow="履歷 · Open to work">
              Junior frontend <em>developer</em>
            </Heading>
            <dl aria-label="個人資訊" className="mt-[clamp(32px,4vw,48px)] border-t border-stroke">
              {resumeFacts.map((f) => (
                <div key={f.k} className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 border-b border-stroke py-4 max-sm:grid-cols-[64px_minmax(0,1fr)]">
                  <dt className="text-[13px] text-muted">{f.k}</dt>
                  <dd className="m-0 text-[15px] leading-[1.55]">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <div className="space-y-6">
            {aboutText.map((t, i) => (
              <Reveal key={i}>
                <p className={`max-w-[62ch] ${i === 0 ? 'text-[clamp(18px,1.7vw,22px)] leading-[1.75]' : i === 1 ? 'text-base leading-[1.85] text-[#c4c4c4]' : 'text-[15px] leading-[1.85] text-muted'}`}>{t}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" data-nav="skills" aria-labelledby="skills-title" className="pb-[clamp(64px,9vw,120px)]">
        <div className="shell">
          <Reveal className="mb-[clamp(32px,4vw,56px)]">
            <Heading id="skills-title" eyebrow="技術" sub="每項技術都對應到上方的實際專案。">
              Tools, <em>in practice</em>
            </Heading>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
            {skills.map((s, i) => (
              <Reveal key={s.group} delay={(i % 3) * 0.08} className={`min-w-0 ${i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                <article className="flex h-full flex-col gap-2.5 rounded-3xl border border-stroke bg-surface px-[26px] pb-6 pt-[26px] transition-colors duration-300 hover:border-[#3a5878]">
                  <h3 className="text-[13px] font-medium tracking-wide text-muted">{s.group}</h3>
                  <p className="font-display text-[clamp(26px,2.6vw,34px)] leading-tight">
                    {s.items.map((it, k) => (
                      <span key={it}>
                        {k > 0 && (
                          <>
                            {' '}
                            <i aria-hidden="true" className="not-italic text-[#4a4a4a]">/</i>{' '}
                          </>
                        )}
                        {it}
                      </span>
                    ))}
                  </p>
                  <small className="mt-auto pt-2 text-xs leading-[1.6] text-muted">{s.used}</small>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
