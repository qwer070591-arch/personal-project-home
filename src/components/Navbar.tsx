import { useEffect, useState } from 'react'
import { useActiveSection } from '../hooks/useActiveSection'

const LINKS = [
  { id: 'work', label: '作品' },
  { id: 'about', label: '履歷' },
  { id: 'skills', label: '技術' },
]

export function Navbar() {
  const active = useActiveSection()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 100)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const link = (current: boolean) =>
    `inline-flex min-h-10 items-center whitespace-nowrap rounded-full px-[clamp(11px,2.4vw,18px)] text-[13px] no-underline transition-colors duration-200 ${
      current ? 'bg-stroke/90 text-text-primary' : 'text-muted hover:bg-stroke/60 hover:text-text-primary'
    }`
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3.5 md:pt-6">
      <nav
        aria-label="主要導覽"
        className={`pointer-events-auto inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-surface/80 p-1.5 backdrop-blur-md transition-shadow ${scrolled ? 'shadow-md shadow-black/40' : ''}`}
      >
        <a href="#top" aria-label="P/F 回到首頁" className="group block rounded-full transition-transform duration-300 hover:scale-110">
          <span className="accent-gradient grid h-[38px] w-[38px] place-items-center rounded-full p-0.5">
            <i className="grid h-full w-full place-items-center rounded-full bg-bg font-display text-[13px]">P/F</i>
          </span>
        </a>
        <span aria-hidden="true" className="mx-1 h-5 w-px bg-stroke" />
        {LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} className={link(active === l.id)} aria-current={active === l.id ? 'location' : undefined}>
            {l.label}
          </a>
        ))}
        <span aria-hidden="true" className="mx-1 h-5 w-px bg-stroke" />
        <a href="#contact" className={link(active === 'contact')} aria-current={active === 'contact' ? 'location' : undefined}>
          聯絡 <span aria-hidden="true" className="ml-1">↗</span>
        </a>
      </nav>
    </header>
  )
}
