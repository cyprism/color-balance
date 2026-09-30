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

const comingSoonLinks = document.querySelectorAll('[data-coming-soon]');
let comingSoonTimer;

comingSoonLinks.forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  const isProgramPopup = link.dataset.comingSoon === 'program';

  let popup = document.querySelector('.coming-soon-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.className = 'coming-soon-popup';
    popup.setAttribute('role', 'status');
    popup.setAttribute('aria-live', 'polite');
    document.body.appendChild(popup);
  }

  clearTimeout(comingSoonTimer);
  popup.classList.remove('visible');
  popup.classList.toggle('program-popup', isProgramPopup);
  if (isProgramPopup) {
    popup.innerHTML = '<strong>프로그램 오픈을 준비하고 있습니다.</strong><span>나와 상대의 반응 차이를 이해하고, 일상에서 활용할 수 있는 컬러 프로그램을 준비 중입니다.</span><small>프로그램 및 협업 문의: hi.cyprism@gmail.com</small>';
  } else {
    popup.textContent = '준비 중입니다';
  }
  requestAnimationFrame(() => popup.classList.add('visible'));
  comingSoonTimer = setTimeout(() => popup.classList.remove('visible'), isProgramPopup ? 5200 : 2200);
}));
