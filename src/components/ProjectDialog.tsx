import { AnimatePresence, m } from 'framer-motion'
import type { KeyboardEvent } from 'react'
import { type Project } from '../data/content'
import { useNativeDialog } from '../hooks/useNativeDialog'

interface Props {
  index: number | null
  items: Project[]
  origin: { x: number; y: number } | null
  onClose: () => void
  onStep: (dir: number) => void
}

export function ProjectDialog({ index, items, origin, onClose, onStep }: Props) {
  const ref = useNativeDialog(index !== null, onClose, origin)
  const p = index !== null ? items[index] : items[0]
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); onStep(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); onStep(-1) }
  }
  const btn = 'inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-[#2a2a2a] bg-bg px-4 text-sm transition-colors hover:border-[#89aacc]'
  return (
    <dialog
      ref={ref}
      aria-labelledby="pd-title"
      onKeyDown={onKey}
      className="native-dialog max-h-[calc(100dvh-32px)] w-[min(1120px,calc(100vw-32px))] rounded-[28px] max-sm:h-dvh max-sm:max-h-dvh max-sm:w-screen max-sm:rounded-none max-sm:border-0"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-stroke bg-surface py-2.5 pl-6 pr-3.5 max-sm:pl-4">
        <p className="text-[13px] tracking-widest text-muted" aria-live="polite">
          <b className="font-semibold text-text-primary">{p.no}</b> / {String(items.length).padStart(2, '0')}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" className={btn} onClick={() => onStep(-1)} aria-label="上一個作品"><span aria-hidden="true">←</span></button>
          <button type="button" className={btn} onClick={() => onStep(1)} aria-label="下一個作品"><span aria-hidden="true">→</span></button>
          <button type="button" className={btn} onClick={() => ref.current?.close()} aria-label="關閉作品詳情">關閉 <span aria-hidden="true" className="ml-1.5 text-xl leading-none">×</span></button>
        </div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={p.id}
          className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)] max-[900px]:block"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className="min-w-0 self-start bg-[#181818]">
            <img src={p.image} alt={p.alt} width={1440} height={900} className="aspect-[16/10] h-auto w-full object-cover object-left-top" />
          </div>
          <div className="flex min-w-0 flex-col items-start px-[34px] pb-[34px] pt-8 max-[900px]:px-6 max-[900px]:pb-8 max-[900px]:pt-[26px]">
            <p className="mb-3 text-[13px] tracking-wider text-[#89aacc]">{p.category}</p>
            <h3 id="pd-title" className="mb-[18px] font-display text-[clamp(44px,5vw,72px)] font-normal italic leading-[.95] tracking-[-0.01em]">{p.title}</h3>
            <p className="mb-3 text-[19px] leading-[1.45]">{p.lead}</p>
            <p className="max-w-[46ch] text-[15px] leading-[1.75] text-[#b4b4b4]">{p.desc}</p>
            <ul aria-label={`${p.title} 使用技術`} className="mt-[18px] flex flex-wrap gap-[7px]">
              {p.tech.map((t) => (
                <li key={t} className="rounded-full border border-stroke px-3 py-1.5 text-xs text-muted">{t}</li>
              ))}
            </ul>
            <p className="mt-auto flex flex-wrap gap-x-[22px] gap-y-1 pt-[18px]">
              <a href={p.demo} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center border-b border-[#3a3a3a] text-sm font-medium no-underline transition-colors hover:border-[#89aacc] hover:text-[#89aacc]">瀏覽 Demo <span aria-hidden="true" className="ml-2.5">↗</span></a>
              <a href={p.repo} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center border-b border-[#3a3a3a] text-sm font-medium no-underline transition-colors hover:border-[#89aacc] hover:text-[#89aacc]">專案文件 <span aria-hidden="true" className="ml-2.5">↗</span></a>
            </p>
          </div>
        </m.div>
      </AnimatePresence>
    </dialog>
  )
}
