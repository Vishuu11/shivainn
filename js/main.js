const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeTargets = mobileMenu ? mobileMenu.querySelectorAll('[data-menu-close]') : [];

function setMenuState(isOpen) {
  if (!menuBtn || !mobileMenu) return;
  mobileMenu.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
  menuBtn.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
}

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    setMenuState(!mobileMenu.classList.contains('is-open'));
  });

  closeTargets.forEach(target => {
    target.addEventListener('click', () => setMenuState(false));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuState(false));
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    setMenuState(false);
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    setMenuState(false);
  }
});

function markActiveLinks() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allLinks = document.querySelectorAll('a[href]');
  const activeFolders = new Set();

  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
      return;
    }

    const normalizedHref = href.split('/').pop();
    if (normalizedHref === currentPath) {
      link.setAttribute('aria-current', 'page');
      const folder = link.closest('.nav-folder');
      if (folder) activeFolders.add(folder);
    }
  });

  activeFolders.forEach(folder => folder.classList.add('is-active'));
}

function chooseBgSize() {
  const width = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0);
  if (width <= 640) return 640;
  if (width <= 1280) return 1024;
  return 1920;
}

function updateResponsiveBgImages() {
  const targetSize = chooseBgSize();
  document.querySelectorAll('[data-bgbase]').forEach(section => {
    const basePath = section.getAttribute('data-bgbase');
    if (!basePath) return;
    section.style.backgroundImage = `url('${basePath}-${targetSize}.jpg')`;
  });
}

let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(updateResponsiveBgImages, 120);
});

function revealOnScroll() {
  const revealTargets = document.querySelectorAll('.fade-up');
  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach(item => item.classList.add('show'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -40px 0px'
  });

  revealTargets.forEach(item => observer.observe(item));
}

function updateCurrentYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-current-year]').forEach(node => {
    node.textContent = year;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  markActiveLinks();
  updateResponsiveBgImages();
  revealOnScroll();
  updateCurrentYear();
});
