import type { KeyboardEvent } from 'react'
import { useNativeDialog } from '../hooks/useNativeDialog'

export interface LightboxItem {
  id: string
  title: string
  image: string
  alt: string
}

interface Props {
  index: number | null
  items: LightboxItem[]
  origin: { x: number; y: number } | null
  onClose: () => void
  onStep: (dir: number) => void
}

export function Lightbox({ index, items, origin, onClose, onStep }: Props) {
  const ref = useNativeDialog(index !== null, onClose, origin)
  const item = items[index ?? 0]
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); onStep(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); onStep(-1) }
  }
  const btn = 'inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-[#2a2a2a] bg-bg px-4 text-sm transition-colors hover:border-[#89aacc]'
  return (
    <dialog ref={ref} aria-label="圖片檢視" onKeyDown={onKey} className="native-dialog max-h-[calc(100dvh-32px)] w-[min(1100px,calc(100vw-32px))] rounded-3xl max-sm:h-dvh max-sm:max-h-dvh max-sm:w-screen max-sm:rounded-none max-sm:border-0">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-stroke bg-surface py-2.5 pl-6 pr-3.5 max-sm:pl-4">
        <p className="min-w-0 truncate text-sm" aria-live="polite">{item.title}</p>
        <div className="flex items-center gap-2">
          <button type="button" className={btn} onClick={() => onStep(-1)} aria-label="上一張"><span aria-hidden="true">←</span></button>
          <button type="button" className={btn} onClick={() => onStep(1)} aria-label="下一張"><span aria-hidden="true">→</span></button>
          <button type="button" className={btn} onClick={() => ref.current?.close()} aria-label="關閉圖片檢視">關閉 <span aria-hidden="true" className="ml-1.5 text-xl leading-none">×</span></button>
        </div>
      </div>
      <img src={item.image} alt={item.alt} width={1440} height={900} className="h-auto w-full bg-[#181818] object-contain" />
    </dialog>
  )
}
