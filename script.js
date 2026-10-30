/**
 * LUNA Beauty Studio — Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initCounterAnimation();
  initReviewsSlider();
  initPromoTimer();
  initContactForm();
  initSmoothScroll();
});

/* --- Header scroll effect & active nav --- */
function initHeader() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);

    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  });
}

/* --- Mobile menu --- */
function initMobileMenu() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const navLinks = nav.querySelectorAll('.nav__link');

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.classList.toggle('active', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* --- Scroll reveal animations --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const siblings = entry.target.parentElement.querySelectorAll('.fade-up');
          const siblingIndex = Array.from(siblings).indexOf(entry.target);
          entry.target.style.transitionDelay = `${siblingIndex * 0.1}s`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* --- Counter animation for hero stats --- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach((counter) => animateCounter(counter));
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsBlock = document.querySelector('.hero__stats');
  if (statsBlock) observer.observe(statsBlock);
}

function animateCounter(element) {
  const target = parseInt(element.dataset.count, 10);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    element.textContent = formatNumber(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = formatNumber(target);
    }
  }

  requestAnimationFrame(update);
}

function formatNumber(num) {
  if (num >= 1000) {
    return num.toLocaleString('kk-KZ');
  }
  return num.toString();
}

/* --- Reviews slider --- */
function initReviewsSlider() {
  const slider = document.getElementById('reviewsSlider');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');
  const dotsContainer = document.getElementById('reviewDots');

  if (!slider) return;

  const slides = slider.querySelectorAll('.review-card');
  const total = slides.length;
  let current = 0;
  let autoplayInterval;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('reviews__dot');
    dot.setAttribute('aria-label', `Отзыв ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.reviews__dot');

  function goTo(index) {
    current = ((index % total) + total) % total;
    slider.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  function startAutoplay() {
    autoplayInterval = setInterval(() => goTo(current + 1), 6000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  slider.parentElement.addEventListener('mouseenter', stopAutoplay);
  slider.parentElement.addEventListener('mouseleave', startAutoplay);

  let touchStartX = 0;
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
    }
    startAutoplay();
  }, { passive: true });

  startAutoplay();
}

/* --- Promo countdown timer --- */
function initPromoTimer() {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 14);

  const daysEl = document.getElementById('timerDays');
  const hoursEl = document.getElementById('timerHours');
  const minutesEl = document.getElementById('timerMinutes');
  const secondsEl = document.getElementById('timerSeconds');

  if (!daysEl) return;

  function updateTimer() {
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --- Contact form --- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const phoneInput = document.getElementById('phone');

  if (!form) return;

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length > 0) {
        if (value[0] === '8') value = '7' + value.slice(1);
        if (value[0] !== '7') value = '7' + value;
      }

      let formatted = '';
      if (value.length > 0) formatted = '+7';
      if (value.length > 1) formatted += ' (' + value.slice(1, 4);
      if (value.length > 4) formatted += ') ' + value.slice(4, 7);
      if (value.length > 7) formatted += '-' + value.slice(7, 9);
      if (value.length > 9) formatted += '-' + value.slice(9, 11);

      e.target.value = formatted;
    });
  }

  
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = form.elements.name.value.trim();
  const phone = form.elements.phone.value.trim();
  const service = form.elements.service?.value || 'Не выбрана';
  const message = form.elements.message?.value.trim() || 'Нет';

  if (!name || !phone) {
    showToast('Пожалуйста, укажите имя и телефон.');
    return;
  }

  const whatsappNumber = '77478043342'; // Замени на свой номер
  const text = [
    'Здравствуйте! Новая заявка с сайта LUNA Beauty.',
    `Имя: ${name}`,
    `Телефон клиента: ${phone}`,
    `Услуга: ${service}`,
    `Комментарий: ${message}`
  ].join('\n');

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

  window.open(whatsappUrl, '_blank');
});

}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* --- Smooth scroll for anchor links --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = document.getElementById('header').offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });
}
