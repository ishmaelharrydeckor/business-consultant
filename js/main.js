(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Navbar: scrolled state, mobile menu, dropdown ---------- */
  var navbar = $('#navbar');
  var burger = $('#burger');

  function onScroll() {
    navbar.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    navbar.classList.toggle('is-menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
  }
  burger.addEventListener('click', function () {
    setMenu(!navbar.classList.contains('is-menu-open'));
  });
  $$('#navLinks a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  var dropdown = $('.dropdown');
  var toggle = $('.dropdown__toggle', dropdown);
  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = dropdown.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
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

  /* ---------- Advisors carousel ---------- */
  var track = $('#advTrack');
  function step() {
    var card = $('.advisor', track);
    return card ? card.getBoundingClientRect().width + 20 : 400;
  }
  $('#advPrev').addEventListener('click', function () {
    track.scrollBy({ left: -step(), behavior: 'smooth' });
  });
  $('#advNext').addEventListener('click', function () {
    track.scrollBy({ left: step(), behavior: 'smooth' });
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
