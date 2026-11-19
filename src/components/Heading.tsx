import type { ReactNode } from 'react'

interface Props {
  eyebrow: string
  children: ReactNode
  sub?: string
  align?: 'left' | 'center'
  id?: string
}

/** Shared section heading so About, Works, Journal, Contact … use one typographic style. */
export function Heading({ eyebrow, children, sub, align = 'left', id }: Props) {
  const center = align === 'center'
  return (
    <div className={center ? 'flex flex-col items-center text-center' : ''}>
      <p className="mb-5 flex items-center gap-3.5 text-xs font-medium uppercase tracking-[0.3em] text-muted">
        <span aria-hidden="true" className="h-px w-8 bg-[#3a3a3a]" />
        {eyebrow}
      </p>
      <h2 id={id} className="font-display text-[clamp(42px,6.4vw,84px)] font-normal leading-none tracking-[-0.02em] [text-wrap:balance]">
        {children}
      </h2>
      {sub && <p className={`mt-5 max-w-[46ch] text-[15px] leading-[1.7] text-muted ${center ? 'mx-auto' : ''}`}>{sub}</p>}
    </div>
  )
}
