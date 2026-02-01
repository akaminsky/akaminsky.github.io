(function () {
  'use strict';

  // SHA-256 hash of "atlantis"
  var PASSWORD_HASH = '009dba7e54048b56a2bd3725cdf85248242cac1045ffd5011fc99b03e1ae9a3c';
  var STORAGE_KEY = 'portfolio_unlocked';

  // --- Password Gate ---

  async function sha256(message) {
    var msgBuffer = new TextEncoder().encode(message);
    var hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    var hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  function unlockCaseStudies() {
    var links = document.querySelectorAll('.case-study-title-link');
    links.forEach(function (link) {
      var encoded = link.getAttribute('data-encrypted-link');
      if (encoded) {
        link.href = atob(encoded);
      }
      link.classList.remove('locked');
      link.classList.add('unlocked');
    });
  }

  function openModal() {
    var overlay = document.getElementById('password-overlay');
    var input = document.getElementById('password-input');
    if (overlay) {
      overlay.classList.add('open');
      if (input) input.focus();
    }
  }

  function closeModal() {
    var overlay = document.getElementById('password-overlay');
    if (overlay) overlay.classList.remove('open');
  }

  function initPasswordGate() {
    // Check sessionStorage first
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      unlockCaseStudies();
      return;
    }

    // Clicking a locked title opens the modal
    document.querySelectorAll('.case-study-title-link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (link.classList.contains('locked')) {
          e.preventDefault();
          openModal();
        }
      });
    });

    var overlay = document.getElementById('password-overlay');
    var closeBtn = document.getElementById('password-close');
    var input = document.getElementById('password-input');
    var submit = document.getElementById('password-submit');
    var errorEl = document.getElementById('password-error');
    var successEl = document.getElementById('password-success');

    if (!input || !submit) return;

    // Close modal
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
      });
    }

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    async function attemptUnlock() {
      var value = input.value.trim().toLowerCase();
      if (!value) return;

      var hash = await sha256(value);

      if (hash === PASSWORD_HASH) {
        errorEl.classList.remove('visible');
        successEl.classList.add('visible');
        sessionStorage.setItem(STORAGE_KEY, 'true');
        unlockCaseStudies();
        setTimeout(closeModal, 800);
      } else {
        errorEl.classList.add('visible');
        successEl.classList.remove('visible');
        input.value = '';
        input.focus();
      }
    }

    submit.addEventListener('click', attemptUnlock);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') attemptUnlock();
    });
  }

  // --- Mobile Nav Toggle ---

  function initMobileNav() {
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('main-nav');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      nav.classList.toggle('open');
    });

    // Close nav on link click
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        nav.classList.remove('open');
      });
    });
  }

  // --- Smooth Scroll with Header Offset ---

  function initSmoothScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        var headerHeight = header.offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  // --- Init ---

  document.addEventListener('DOMContentLoaded', function () {
    initPasswordGate();
    initMobileNav();
    initSmoothScroll();
  });
})();
