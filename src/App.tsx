import { AnimatePresence, LazyMotion, useReducedMotion } from 'framer-motion'
import { lazy, Suspense, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Hero } from './components/Hero'
import { Journal } from './components/Journal'
import { LoadingScreen } from './components/LoadingScreen'
import { Navbar } from './components/Navbar'
import { SelectedWorks } from './components/SelectedWorks'
import { Stats } from './components/Stats'

// Explorations pulls in GSAP ScrollTrigger; load it as its own chunk after first paint.
const Explorations = lazy(() => import('./components/Explorations'))
const loadMotionFeatures = () => import('./lib/motionFeatures').then((mod) => mod.default)

const KEY = 'pf-intro-seen'

/** Loading screen: first visit of the session only, and never under reduced motion or on phones (<768px). */
function shouldShowLoading(reduce: boolean) {
  // Phones go straight to the Hero: no fixed 3 s wait before useful content.
  if (reduce || window.matchMedia('(max-width: 767px)').matches) return false
  try {
    if (sessionStorage.getItem(KEY)) return false
    sessionStorage.setItem(KEY, '1')
  } catch {
    /* storage blocked: show once per load */
  }
  return true
}

export default function App() {
  const reduce = !!useReducedMotion()
  const [loading, setLoading] = useState(() => shouldShowLoading(window.matchMedia('(prefers-reduced-motion: reduce)').matches || reduce))

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <AnimatePresence>{loading && <LoadingScreen key="loading" onComplete={() => setLoading(false)} />}</AnimatePresence>
      <a href="#main" className="fixed -top-20 left-4 z-[100] rounded-xl bg-text-primary px-4 py-3 text-bg focus:top-4">跳到主要內容</a>
      <Navbar />
      <main id="main">
        <Hero ready={!loading} />
        <SelectedWorks />
        <About />
        <Journal />
        <Suspense fallback={<section id="explorations" aria-hidden="true" className="min-h-[60vh] lg:min-h-[300vh]" />}>
          <Explorations />
        </Suspense>
        <Stats />
        <Contact />
      </main>
    </LazyMotion>
  )
}
