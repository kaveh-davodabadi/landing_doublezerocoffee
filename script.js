/**
 * دابل زیرو کافی — اسکریپت‌های صفحه فرود
 * بارگذاری · ناوبری · منوی موبایل · parallax · انیمیشن اسکرول
 */

(function () {
  'use strict';

  const header = document.getElementById('header');
  const hero = document.getElementById('hero');
  const heroBg = document.getElementById('heroBg');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const pageLoader = document.getElementById('pageLoader');
  const yearEl = document.getElementById('year');
  const fadeElements = document.querySelectorAll('.fade-up');
  const navLinks = navMenu.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let lastScrollY = 0;
  let ticking = false;

  /* --- سال فوتر --- */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --- تأخیر stagger از data-delay --- */
  fadeElements.forEach(function (el) {
    const delay = el.dataset.delay;
    if (delay !== undefined) {
      el.style.setProperty('--delay', delay);
    }
  });

  /* --- تجربه بارگذاری صفحه --- */
  function revealPage() {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-loaded');

    if (hero) {
      hero.classList.add('is-loaded');
    }

    if (pageLoader) {
      pageLoader.classList.add('is-hidden');
      pageLoader.setAttribute('aria-hidden', 'true');
    }
  }

  function initLoad() {
    const heroImage = new Image();
    heroImage.src = 'assets/hero.jpg';

    const fontsReady = document.fonts && document.fonts.ready
      ? document.fonts.ready
      : Promise.resolve();

    const imageReady = new Promise(function (resolve) {
      if (heroImage.complete) {
        resolve();
      } else {
        heroImage.onload = resolve;
        heroImage.onerror = resolve;
      }
    });

    Promise.all([fontsReady, imageReady]).then(function () {
      requestAnimationFrame(function () {
        setTimeout(revealPage, prefersReducedMotion ? 0 : 320);
      });
    });

    setTimeout(revealPage, 2800);
  }

  initLoad();

  /* --- ناوبری: پس‌زمینه و مخفی‌شدن در اسکرول --- */
  function handleScroll() {
    const scrollY = window.scrollY;
    const scrolled = scrollY > 48;

    header.classList.toggle('is-scrolled', scrolled);

    if (!prefersReducedMotion && scrollY > 400) {
      const scrollingDown = scrollY > lastScrollY && scrollY > 120;
      header.classList.toggle('is-hidden', scrollingDown);
    } else {
      header.classList.remove('is-hidden');
    }

    /* Parallax هیرو */
    if (heroBg && !prefersReducedMotion && scrollY < window.innerHeight * 1.2) {
      const offset = scrollY * 0.35;
      const scale = 1.04 + scrollY * 0.00008;
      heroBg.style.transform = 'translate3d(0, ' + offset + 'px, 0) scale(' + scale + ')';
    }

    /* لینک فعال ناوبری */
    let currentId = '';
    sections.forEach(function (section) {
      const top = section.offsetTop - header.offsetHeight - 80;
      if (scrollY >= top) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      link.classList.toggle('is-active', href === '#' + currentId);
    });

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  handleScroll();

  /* --- منوی همبرگری موبایل --- */
  function closeMenu() {
    navToggle.classList.remove('is-active');
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'باز کردن منو');
    document.body.style.overflow = '';
  }

  function openMenu() {
    navToggle.classList.add('is-active');
    navMenu.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'بستن منو');
    document.body.style.overflow = 'hidden';
  }

  navToggle.addEventListener('click', function () {
    if (navMenu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  /* --- Fade-up هنگام اسکرول --- */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -6% 0px',
        threshold: 0.12
      }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    fadeElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* --- اسکرول نرم با offset هدر --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      header.classList.remove('is-hidden');

      const headerHeight = header.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });

      if (targetId === '#main' || !target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus({ preventScroll: true });
    });
  });

})();

const map = L.map('map').setView([35.678815,  51.446856], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([35.678815,  51.446856]).addTo(map)
  .bindPopup("Double Zero Coffee ☕");

setTimeout(() => {
  map.invalidateSize();
}, 200);
map.setZoom(17);
  // standard_night dreamy


  // menu section
  const menuData = {
  "hot-coffee": [
    {
      name: "اسپرسو دابل",
      price: "120,000 تومان",
      img: "images/espresso.jpg",
      ingredients: "قهوه عربیکا، رست دارک"
    },
    {
      name: "لاته",
      price: "140,000 تومان",
      img: "images/latte.jpg",
      ingredients: "اسپرسو، شیر بخار داده شده"
    }
  ],

  "hot-noncoffee": [
    {
      name: "هات چاکلت",
      price: "130,000 تومان",
      img: "images/hotchocolate.jpg",
      ingredients: "شکلات تلخ، شیر، خامه"
    }
  ],

  "cold-coffee": [
    {
      name: "آیس لاته",
      price: "150,000 تومان",
      img: "images/icedlatte.jpg",
      ingredients: "اسپرسو، شیر سرد، یخ"
    }
  ],

  "cold-noncoffee": [
    {
      name: "لیموناد اسپارکل",
      price: "110,000 تومان",
      img: "images/lemonade.jpg",
      ingredients: "لیمو تازه، سودا، نعنا"
    }
  ]
};

const menuContainer = document.getElementById("menu-items");
const tabs = document.querySelectorAll(".tab");

function renderMenu(category){
  menuContainer.innerHTML = "";

  menuData[category].forEach(item => {
    menuContainer.innerHTML += `
      <div class="card">
        <img src="${item.img}" alt="${item.name}">
        <div class="card-body">
          <div class="card-title">${item.name}</div>
          <div class="card-price">${item.price}</div>
          <div class="card-ingredients">${item.ingredients}</div>
        </div>
      </div>
    `;
  });
}

// default
renderMenu("hot-coffee");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {

    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    renderMenu(tab.dataset.category);
  });
});