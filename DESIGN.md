# Personal Project Home — V3 (React) Design

## Direction

Dark, cinematic single-page portfolio for a Junior Frontend Developer who is open to work. High-contrast type (Instrument Serif italic against Inter), a floating pill navigation, a loading intro, an asymmetric 7 / 5 / 5 / 7 Bento of four real projects, and a restrained blue-silver accent. The custom WebGL2 chrome sculpture is the Hero visual and the fallback for the optional video layer.

## Tokens

- `--bg` hsl(0 0% 4%), `--surface` 8%, `--text` 96%, `--muted` 53%, `--stroke` 12% (Tailwind colors `bg`, `surface`, `text-primary`, `muted`, `stroke`)
- Accent gradient `#89aacc → #4e85bf`: nav logo ring, hover/focus rings, the progress bar, the Hero's italic word, and category labels
- Fonts: Inter (body), Instrument Serif (display; italic for emphasis), Noto Sans TC (Chinese). One shared `Heading` component sets section titles, so About, Works, Journal and Contact match.

## Structure and motion

Desktop/tablet first-visit loading screen → Hero → Selected Works → About + Skills → Project insights → Explorations → Stats → Contact. Phones below 768 px and reduced-motion visitors start at the Hero without the intro. Navigation: Works / Résumé / Skills / Contact; Journal and Explorations count as Works, Stats as Skills.

- GSAP: Hero entrance, Explorations ScrollTrigger pin + parallax, Contact marquee.
- Framer Motion (`LazyMotion`, feature bundle loaded lazily): loading screen transitions, scroll reveals, dialog content, Hero scroll fade, stat counters.
- Native `<dialog>` for project details and the lightbox (focus trap, Esc, backdrop); the opening animation scales from the clicked card.
- Explorations below 1024 px or with reduced motion: no pin or parallax, a scroll-snap strip instead.
- Reduced motion: no loading screen, no role rotation, no ScrollTrigger, no marquee, a still sculpture frame.
- Mobile Hero: the sculpture sits above the text instead of behind it. The CSS sculpture appears immediately; WebGL starts after about 1.5 s only while the Hero is visible to keep its shader setup out of the first paint. Reduced-motion phones retain the CSS sculpture. The normal-motion transition creates a brief visual switch between the two renderings.

## Hero video

hls.js is lazy-loaded only when `VITE_HERO_HLS_URL` is set. It is off by default because the original third-party stream returned HTTP 403 and its license was not verified. Any failure keeps the sculpture. The optional Contact video waits until it is within roughly 400 px of the viewport before requesting media.

## Content boundaries

All project text, screenshots, technologies, and links come from the project READMEs and the owner's supplied résumé text. Journal entries restate each project's README; Explorations are crops of the owner's own screenshots; Stats are counts from the data. No invented name, location, history, clients, statistics, articles, or third-party media. The four live Demo URLs were verified in an earlier release review and were not re-verified in V3.
