import { useEffect, useRef, useState } from 'react'

interface Props {
  /** HLS (.m3u8) or plain video URL. Without a source nothing is rendered (static fallback shows). */
  src?: string
  flipped?: boolean
  /** Do not fetch or decode anything until the video is within ~400px of the viewport (used by Contact). */
  deferUntilNear?: boolean
  onState?: (state: 'playing' | 'failed' | 'none') => void
  className?: string
}

/**
 * Full-bleed muted looping background video with hls.js (native HLS on Safari). hls.js is loaded lazily and
 * only when a source is configured. Any failure reports 'failed' so the caller keeps its static fallback.
 * Playback pauses off-screen and is skipped entirely under prefers-reduced-motion.
 */
export function VideoBackground({ src, flipped, deferUntilNear, onState, className = '' }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(!deferUntilNear)
  const report = useRef(onState)
  report.current = onState

  useEffect(() => {
    const video = ref.current
    if (near || !src || !video) return
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: '400px 0px' })
    io.observe(video)
    return () => io.disconnect()
  }, [near, src])

  useEffect(() => {
    const video = ref.current
    if (!near) return
    if (!src || !video) {
      report.current?.('none')
      return
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      report.current?.('none')
      return
    }
    let disposed = false
    let hls: { destroy: () => void } | null = null
    const fail = () => {
      if (!disposed) report.current?.('failed')
    }
    const ok = () => {
      if (!disposed) report.current?.('playing')
    }
    const play = () => video.play().then(ok, fail)

    video.addEventListener('error', fail)
    const isHls = /\.m3u8(\?|$)/.test(src)
    if (!isHls || video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      video.addEventListener('loadeddata', play, { once: true })
    } else {
      import('hls.js')
        .then(({ default: Hls }) => {
          if (disposed) return
          if (!Hls.isSupported()) return fail()
          const instance = new Hls({ enableWorker: true, lowLatencyMode: false })
          hls = instance
          instance.on(Hls.Events.ERROR, (_e, data) => {
            if (data.fatal) fail()
          })
          instance.on(Hls.Events.MANIFEST_PARSED, play)
          instance.loadSource(src)
          instance.attachMedia(video)
        })
        .catch(fail)
    }

    const io = new IntersectionObserver(([entry]) => {
      if (!video.src && !video.srcObject) return
      if (entry.isIntersecting) video.play().catch(() => undefined)
      else video.pause()
    })
    io.observe(video)
    return () => {
      disposed = true
      io.disconnect()
      video.removeEventListener('error', fail)
      hls?.destroy()
      video.removeAttribute('src')
      video.load()
    }
  }, [src, near])

  if (!src) return null
  return (
    <video
      ref={ref}
      aria-hidden="true"
      muted
      loop
      playsInline
      preload="none"
      tabIndex={-1}
      className={`absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover ${flipped ? 'scale-y-[-1]' : ''} ${className}`}
    />
  )
}
