/* CampusLink shared navbar logic — touch + hover mega-dropdown */
(function () {
  function closeAllDrops() {
    document.querySelectorAll('.nav-wrap.open').forEach(function (w) {
      w.classList.remove('open');
    });
  }

  /* handleDrop — called on click of a nav-link inside a .has-drop wrapper.
     Desktop (hover capable): let CSS :hover show the dropdown; click navigates.
     Touch (no hover):        first tap opens dropdown, second tap navigates. */
  window.handleDrop = function (e, link) {
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var wrap = link.closest('.nav-wrap');
    if (canHover) {
      /* Desktop — close other open dropdowns, let this link navigate */
      closeAllDrops();
      return;
    }
    /* Touch / coarse pointer */
    if (!wrap.classList.contains('open')) {
      e.preventDefault();
      closeAllDrops();
      wrap.classList.add('open');
    }
    /* If already open, fall through and navigate */
  };

  /* Mobile drawer */
  window.toggleMobileNav = function () {
    var nav = document.getElementById('mainNav');
    var overlay = document.getElementById('navOverlay');
    var btn = document.getElementById('mobileToggle');
    nav.classList.toggle('open');
    overlay.classList.toggle('show');
    if (btn) {
      btn.innerHTML = nav.classList.contains('open')
        ? '<i class="ph ph-x"></i>'
        : '<i class="ph ph-list"></i>';
    }
  };

  window.closeMobileNav = function () {
    var nav = document.getElementById('mainNav');
    var overlay = document.getElementById('navOverlay');
    var btn = document.getElementById('mobileToggle');
    if (nav) nav.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    if (btn) btn.innerHTML = '<i class="ph ph-list"></i>';
    closeAllDrops();
  };

  /* Close open dropdown when clicking / touching outside */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-wrap')) closeAllDrops();
  });
  document.addEventListener('touchstart', function (e) {
    if (!e.target.closest('.nav-wrap') && !e.target.closest('#mainNav')) {
      closeAllDrops();
    }
  }, { passive: true });

  /* Close mobile nav on ESC */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeMobileNav();
  });
})();
