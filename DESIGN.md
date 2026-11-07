# Personal Project Home — Phase 3

## Direction

Single page creative developer portfolio. Condensed editorial typography, an irregular live WebGL2 chrome sculpture, and real interface captures carry the narrative. The CSS illustration remains as a WebGL fallback.

## Tokens

- Ground `#050505`; secondary field `#141414`
- Primary text `#F2F0EC`; secondary text `#929292`; muted metallic silver `#C4C7C5`
- Archivo for display and Latin UI; Noto Sans TC for Chinese fallback
- Square full-size media, restrained rounded marquee controls; one consistent responsive page gutter

## Structure and motion

Hero → About → Selected Work → Skills → Contact. The Hero title has two depth layers around the sculpture and a staggered entrance. About uses a 40/60 editorial resume grid with a three-line role title and restrained scroll reveals; mobile stacks the title before the introduction. Selected Work presents four real projects in two opposite-direction CSS marquees; a stationary detail panel reveals original descriptions, screenshots, technologies, and links. The marquee pauses on hover, focus, or panel open. Reduced-motion shows a manually scrollable static row. Contact closes with an offset two-line title. The Hero's WebGL2 mesh has slow rotation and a separate subtle vertex deformation; procedural softbox lighting creates view-dependent chrome reflections without external image maps. Mobile uses a lower-detail mesh. Rendering pauses when out of view or when the page is hidden, and reduced-motion draws a still frame.

## Content boundaries

Project descriptions, screenshots, and technologies follow their project READMEs. All four linked live Demos were verified during the public-release review. Contact provides the supplied email address and the public GitHub profile used by the project repositories; other personal details remain explicit placeholders until provided. There is no invented work history or performance claim.
