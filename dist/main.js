const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

const reveals = [...document.querySelectorAll('.reveal, .reveal-media, .contact-title')];
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const observedMedia = new WeakMap();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const revealedElement = observedMedia.get(entry.target) || entry.target;
        revealedElement.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.09, rootMargin: '0px 0px -4% 0px' });
  for (const element of reveals) {
    if (element.classList.contains('reveal-media')) {
      const trigger = element.parentElement;
      observedMedia.set(trigger, element);
      observer.observe(trigger);
    } else observer.observe(element);
  }
  document.documentElement.classList.add('motion-ready');
}

const hero = document.querySelector('.hero');
const heading = document.querySelector('.hero-heading');
const sculpture = document.querySelector('.hero-sculpture');
const header = document.querySelector('.site-header');
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const navSections = navLinks.map(link => ({ link, section: document.querySelector(link.getAttribute('href')) })).filter(item => item.section);
let scrollTicking = false;
let activeNavLink = null;

function updateScroll() {
  const viewportHeight = window.innerHeight;
  const scrollMax = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
  document.documentElement.style.setProperty('--scroll-progress', String(Math.min(window.scrollY / scrollMax, 1)));
  header?.classList.toggle('is-scrolled', window.scrollY > 32);
  const navMarker = viewportHeight * 0.4;
  const currentNavLink = navSections.find(({ section }) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= navMarker && rect.bottom > navMarker;
  })?.link || null;
  if (currentNavLink !== activeNavLink) {
    for (const link of navLinks) {
      link.classList.toggle('is-current', link === currentNavLink);
      if (link === currentNavLink) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    activeNavLink = currentNavLink;
  }
  if (motionPreference.matches) return;
  if (hero && heading && sculpture) {
    const progress = Math.min(Math.max(window.scrollY / Math.max(hero.offsetHeight, 1), 0), 1);
    heading.style.setProperty('--hero-shift', `${-progress * 105}px`);
    heading.style.setProperty('--hero-opacity', String(1 - progress * 0.9));
    sculpture.style.setProperty('--scroll-x', `${progress * (window.innerWidth <= 700 ? 70 : 220)}px`);
    sculpture.style.setProperty('--scroll-y', `${-progress * (window.innerWidth <= 700 ? 95 : 170)}px`);
    sculpture.style.setProperty('--scroll-scale', String(1 + progress * 0.25));
  }
}

function scheduleScrollUpdate() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    updateScroll();
    scrollTicking = false;
  });
}

window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
window.addEventListener('resize', scheduleScrollUpdate);

if (hero && sculpture && window.matchMedia('(pointer: fine)').matches) {
  let pointerTicking = false;
  let pointerX = 0;
  let pointerY = 0;
  hero.addEventListener('pointermove', (event) => {
    if (motionPreference.matches) return;
    const bounds = hero.getBoundingClientRect();
    pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 24;
    pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 24;
    if (pointerTicking) return;
    pointerTicking = true;
    requestAnimationFrame(() => {
      sculpture.style.setProperty('--pointer-x', `${pointerX}px`);
      sculpture.style.setProperty('--pointer-y', `${pointerY}px`);
      pointerTicking = false;
    });
  });
  hero.addEventListener('pointerleave', () => {
    sculpture.style.setProperty('--pointer-x', '0px');
    sculpture.style.setProperty('--pointer-y', '0px');
  });
}

motionPreference.addEventListener('change', () => {
  document.documentElement.classList.toggle('motion-ready', !motionPreference.matches);
  if (motionPreference.matches) {
    for (const element of reveals) element.classList.add('is-visible');
    heading?.style.removeProperty('--hero-shift');
    heading?.style.removeProperty('--hero-opacity');
    sculpture?.style.removeProperty('--scroll-y');
    sculpture?.style.removeProperty('--scroll-x');
    sculpture?.style.removeProperty('--scroll-scale');
    sculpture?.style.removeProperty('--pointer-x');
    sculpture?.style.removeProperty('--pointer-y');
  } else {
    for (const element of reveals) element.classList.add('is-visible');
    updateScroll();
  }
});

updateScroll();

const work = document.querySelector('.work-section');
const showcase = document.querySelector('.marquee-showcase');
const panel = document.querySelector('.project-panel');
if (work && showcase && panel) {
  const leftTrack = showcase.querySelector('.marquee-lane--left .marquee-track');
  const rightTrack = showcase.querySelector('.marquee-lane--right .marquee-track');
  const leftSet = leftTrack.querySelector('.marquee-set');
  const rightSet = rightTrack.querySelector('.marquee-set');
  const canonicalCards = [...leftSet.querySelectorAll('.marquee-card')];
  const panelViews = [...panel.querySelectorAll('[data-panel-project]')];
  const panelSwitches = [...panel.querySelectorAll('[data-panel-switch]')];
  const closeButton = panel.querySelector('.project-panel__close');
  const workTitle = work.querySelector('#work-title');
  const pauseButton = work.querySelector('.marquee-pause');
  let returnFocusTarget = workTitle;

  function cloneCard(card) {
    const copy = card.cloneNode(true);
    copy.removeAttribute('aria-controls');
    copy.removeAttribute('aria-expanded');
    copy.setAttribute('aria-hidden', 'true');
    copy.tabIndex = -1;
    return copy;
  }

  // Two rounds of the source cards cover the widest viewport; matching sets loop at exactly half the track width.
  for (const card of canonicalCards) leftSet.append(cloneCard(card));
  const leftCopy = leftSet.cloneNode(true);
  leftCopy.setAttribute('aria-hidden', 'true');
  for (const card of leftCopy.querySelectorAll('.marquee-card')) {
    card.removeAttribute('aria-controls');
    card.removeAttribute('aria-expanded');
    card.setAttribute('aria-hidden', 'true');
    card.tabIndex = -1;
  }
  leftTrack.append(leftCopy);
  for (let repeat = 0; repeat < 2; repeat++) {
    for (const card of canonicalCards) rightSet.append(cloneCard(card));
  }
  rightTrack.append(rightSet.cloneNode(true));
  showcase.classList.add('is-ready');
  if (pauseButton) {
    pauseButton.hidden = false;
    pauseButton.addEventListener('click', () => {
      const paused = showcase.classList.toggle('is-manually-paused');
      pauseButton.classList.toggle('is-paused', paused);
      pauseButton.textContent = paused ? '繼續移動' : '暫停移動';
    });
  }

  function openProject(name, focusClose = true) {
    const selectedView = panelViews.find(view => view.dataset.panelProject === name);
    if (!selectedView) return;
    for (const view of panelViews) view.hidden = view !== selectedView;
    for (const button of panelSwitches) button.setAttribute('aria-pressed', String(button.dataset.panelSwitch === name));
    for (const card of canonicalCards) card.setAttribute('aria-expanded', String(card.dataset.project === name));
    for (const card of showcase.querySelectorAll('.marquee-card')) card.classList.toggle('is-selected', card.dataset.project === name);
    panel.hidden = false;
    work.classList.add('panel-open');
    panel.setAttribute('aria-label', `${selectedView.querySelector('h3').textContent} 作品詳情`);
    if (focusClose) closeButton.focus({ preventScroll: true });
  }

  function closeProject() {
    if (panel.hidden) return;
    panel.hidden = true;
    work.classList.remove('panel-open');
    for (const card of canonicalCards) card.setAttribute('aria-expanded', 'false');
    for (const card of showcase.querySelectorAll('.marquee-card')) card.classList.remove('is-selected');
    if (panel.contains(document.activeElement)) returnFocusTarget.focus({ preventScroll: true });
  }

  workTitle.tabIndex = -1;
  showcase.addEventListener('click', event => {
    const card = event.target.closest('.marquee-card');
    if (card && showcase.contains(card)) {
      // Keyboard activation returns to its stationary source card; pointer clones return to the heading.
      returnFocusTarget = event.detail === 0 && canonicalCards.includes(card) ? card : workTitle;
      openProject(card.dataset.project);
    }
  });
  showcase.addEventListener('focusin', event => {
    if (event.target.matches('.marquee-card:focus-visible')) showcase.classList.add('is-keyboard-browsing');
  });
  showcase.addEventListener('focusout', () => requestAnimationFrame(() => {
    if (!showcase.contains(document.activeElement)) {
      showcase.classList.remove('is-keyboard-browsing');
      if (!showcase.classList.contains('is-manually-paused')) showcase.querySelector('.marquee-lane--left').scrollLeft = 0;
    }
  }));
  for (const button of panelSwitches) button.addEventListener('click', () => openProject(button.dataset.panelSwitch, false));
  closeButton.addEventListener('click', closeProject);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); closeProject(); }
  });
  document.addEventListener('click', event => {
    if (!panel.hidden && !panel.contains(event.target) && !showcase.contains(event.target)) closeProject();
  });
}
