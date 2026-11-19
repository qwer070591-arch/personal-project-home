import { useEffect, useState } from 'react'

/** Returns the nav id (data-nav) of the section under the 40% viewport line; 'contact' at page end. */
export function useActiveSection() {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    let ticking = false
    const compute = () => {
      ticking = false
      const vh = window.innerHeight
      const atEnd = window.scrollY + vh >= document.documentElement.scrollHeight - 2
      if (atEnd) {
        setActive('contact')
        return
      }
      const marker = vh * 0.4
      let found: string | null = null
      document.querySelectorAll<HTMLElement>('[data-nav]').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top <= marker && r.bottom > marker) found = el.dataset.nav ?? null
      })
      setActive(found)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return active
}
