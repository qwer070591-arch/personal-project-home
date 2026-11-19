import { useEffect, useRef } from 'react'

/** Opens/closes a native modal <dialog> from React state. Esc, backdrop click and focus trap are native. */
export function useNativeDialog(isOpen: boolean, onClose: () => void, origin?: { x: number; y: number } | null) {
  const ref = useRef<HTMLDialogElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (isOpen && !d.open) {
      d.showModal()
      document.documentElement.classList.add('dialog-open')
      if (origin) {
        const r = d.getBoundingClientRect()
        d.style.transformOrigin = `${origin.x - r.left}px ${origin.y - r.top}px`
      }
    } else if (!isOpen && d.open) d.close()
  }, [isOpen, origin])
  useEffect(() => {
    const d = ref.current
    if (!d) return
    const onNativeClose = () => {
      document.documentElement.classList.remove('dialog-open')
      closeRef.current()
    }
    const onClick = (e: MouseEvent) => {
      if (e.target === d) d.close()
    }
    d.addEventListener('close', onNativeClose)
    d.addEventListener('click', onClick)
    return () => {
      d.removeEventListener('close', onNativeClose)
      d.removeEventListener('click', onClick)
      document.documentElement.classList.remove('dialog-open')
    }
  }, [])
  return ref
}
