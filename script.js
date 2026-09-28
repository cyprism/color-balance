const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const navLinks = [...document.querySelectorAll('.site-nav a')];
const inquiryMenu = document.querySelector('.nav-inquiry');

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', scrollY > 22);
}, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
});

navLinks.forEach(link => link.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  inquiryMenu?.removeAttribute('open');
}));

document.addEventListener('click', event => {
  if (!inquiryMenu?.hasAttribute('open') || inquiryMenu.contains(event.target)) return;
  inquiryMenu.removeAttribute('open');
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .1 });

document.querySelectorAll('.reveal').forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
  revealObserver.observe(item);
});

const homeSections = [...document.querySelectorAll('main section[id]')];
if (homeSections.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.hash === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55%', threshold: 0 });

  homeSections.forEach(section => sectionObserver.observe(section));
}

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  document.body.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  inquiryMenu?.removeAttribute('open');
});
