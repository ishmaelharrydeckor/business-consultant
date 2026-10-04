(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Navbar: scrolled state, mobile menu, dropdown ---------- */
  var navbar = $('#navbar');
  var burger = $('#burger');
  var pagesToggle = $('#pagesToggle');

  function setMenu(open) {
    navbar.classList.toggle('is-menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
  }
  function setMega(open) {
    navbar.classList.toggle('is-mega-open', open);
    pagesToggle.setAttribute('aria-expanded', String(open));
  }
  burger.addEventListener('click', function () {
    if (navbar.classList.contains('is-mega-open')) { setMega(false); setMenu(false); return; }
    setMenu(!navbar.classList.contains('is-menu-open'));
  });
  $$('#navLinks > a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); setMega(false); });
  });
  pagesToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    setMega(!navbar.classList.contains('is-mega-open'));
  });
  $$('#mega a').forEach(function (a) {
    a.addEventListener('click', function () { setMega(false); setMenu(false); });
  });
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) setMega(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setMega(false); setMenu(false); }
  });

  /* ---------- Active nav link while scrolling ---------- */
  var navMap = [
    ['#top', 'Home'], ['#about', 'About'], ['#case-studies', 'Case Studies'], ['#blog', 'Blog']
  ];
  var navAnchors = $$('#navLinks > a');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = '#' + en.target.id;
        navAnchors.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navMap.forEach(function (m) {
      var el = $(m[0]);
      if (el) spy.observe(el);
    });
  }

  /* ---------- Services: hover/click swaps image + active row ---------- */
  var serviceItems = $$('.services__list li');
  var serviceImgs = $$('.services__media img');
  function activateService(i) {
    serviceItems.forEach(function (li, n) { li.classList.toggle('is-active', n === i); });
    serviceImgs.forEach(function (img, n) { img.classList.toggle('is-active', n === i); });
  }
  serviceItems.forEach(function (li, i) {
    li.addEventListener('mouseenter', function () { activateService(i); });
    li.addEventListener('focus', function () { activateService(i); });
    li.addEventListener('click', function () { activateService(i); });
  });

  /* ---------- FAQ accordion ---------- */
  $$('.faq__item').forEach(function (item) {
    var btn = $('.faq__q', item);
    btn.addEventListener('click', function () {
      var open = !item.classList.contains('is-open');
      $$('.faq__item.is-open').forEach(function (o) {
        o.classList.remove('is-open');
        $('.faq__q', o).setAttribute('aria-expanded', 'false');
      });
      if (open) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Marquee speeds (px/s) ---------- */
  function setMarqueeSpeeds() {
    $$('[data-speed]').forEach(function (track) {
      var speed = parseFloat(track.dataset.speed);
      var group = track.firstElementChild;
      var w = track.classList.contains('ticker__track') ? track.scrollWidth / 2 : group.offsetWidth;
      if (w && speed) {
        if (track.classList.contains('ticker__track')) track.style.animationDuration = (w / speed) + 's';
        else track.style.setProperty('--duration', (w / speed) + 's');
      }
    });
  }
  setMarqueeSpeeds();
  window.addEventListener('load', setMarqueeSpeeds);
  window.addEventListener('resize', setMarqueeSpeeds);

  /* ---------- Advisors carousel (centered, infinite) ---------- */
  var track = $('#advTrack');
  var originals = $$('.advisor', track);
  var count = originals.length;
  [-1, 1].forEach(function (dir) {
    var frag = document.createDocumentFragment();
    originals.forEach(function (card) {
      var copy = card.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      $$('a', copy).forEach(function (a) { a.tabIndex = -1; });
      frag.appendChild(copy);
    });
    if (dir < 0) track.insertBefore(frag, track.firstChild); else track.appendChild(frag);
  });
  function cardPitch() {
    var card = $('.advisor', track);
    return card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 20);
  }
  function setStart() {
    track.style.scrollSnapType = 'none';
    track.scrollLeft = cardPitch() * count;
    requestAnimationFrame(function () { track.style.scrollSnapType = ''; });
  }
  setStart();
  window.addEventListener('resize', setStart);

  var settle;
  track.addEventListener('scroll', function () {
    clearTimeout(settle);
    settle = setTimeout(function () {
      var pitch = cardPitch(), set = pitch * count;
      var jump = 0;
      if (track.scrollLeft < set * 0.5) jump = set;
      else if (track.scrollLeft > set * 1.5) jump = -set;
      if (jump) {
        track.style.scrollSnapType = 'none';
        track.scrollLeft += jump;
        requestAnimationFrame(function () { track.style.scrollSnapType = ''; });
      }
    }, 120);
  }, { passive: true });

  $('#advPrev').addEventListener('click', function () {
    track.scrollBy({ left: -cardPitch(), behavior: 'smooth' });
  });
  $('#advNext').addEventListener('click', function () {
    track.scrollBy({ left: cardPitch(), behavior: 'smooth' });
  });

  /* ---------- Stat counters + reveal on scroll ---------- */
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    if (reduceMotion || isNaN(target)) return;
    var start = null, dur = 1400;
    el.textContent = '0' + suffix;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var revealEls = $$('.section-head, .stat, .step, .plan, .post, .faq__item, .about__text');
  revealEls.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-visible');
        var num = $('.stat__num', en.target);
        if (num) countUp(num);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Newsletter form (front-end only) ---------- */
  var form = $('#subscribeForm');
  var msg = $('#subscribeMsg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = form.elements.email;
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    msg.textContent = ok ? 'Thanks! You’re subscribed.' : 'Please enter a valid email address.';
    if (ok) form.reset();
  });
})();
