/* CampusLink — shared site script
   - header dropdowns (hover on desktop, tap on touch)
   - mobile drawer
   - window.notify(msg)      small toast message
   - window.qs(name)         read a ?query param (used for deep links)  */
(function () {
  function closeAllDrops() {
    document.querySelectorAll('.nav-wrap.open').forEach(function (w) { w.classList.remove('open'); });
  }

  /* Desktop: hover opens the menu and a click navigates.
     Touch:   first tap opens the menu, second tap navigates. */
  window.handleDrop = function (e, link) {
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var wrap = link.closest('.nav-wrap');
    if (canHover) { closeAllDrops(); return; }
    if (!wrap.classList.contains('open')) {
      e.preventDefault();
      closeAllDrops();
      wrap.classList.add('open');
      link.setAttribute('aria-expanded', 'true');
    }
  };

  function setDrawer(open) {
    var nav = document.getElementById('mainNav');
    var overlay = document.getElementById('navOverlay');
    var btn = document.getElementById('mobileToggle');
    if (!nav) return;
    nav.classList.toggle('open', open);
    if (overlay) overlay.classList.toggle('show', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) closeAllDrops();
  }
  window.toggleMobileNav = function () {
    var nav = document.getElementById('mainNav');
    setDrawer(!(nav && nav.classList.contains('open')));
  };
  window.closeMobileNav = function () { setDrawer(false); };

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-wrap')) closeAllDrops();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeMobileNav();
  });
  /* Close the drawer when a link inside it is followed (same-page #anchors) */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('#mainNav .drop-item');
    if (a) setDrawer(false);
  });

  /* Mark the current page in the header, whatever file name it was opened under */
  var page = (location.pathname.split('/').pop() || 'home.html').toLowerCase();
  document.querySelectorAll('.nav-links > .nav-wrap > .nav-link').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split(/[?#]/)[0].toLowerCase();
    if (href === page) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
  });

  /* Announcement strip — stays hidden once dismissed */
  var ANN_KEY = 'campuslink_announce_shop_v1';
  var ann = document.getElementById('announce');
  if (ann && localStorage.getItem(ANN_KEY)) ann.remove();
  window.dismissAnnounce = function () {
    var el = document.getElementById('announce');
    if (el) el.remove();
    localStorage.setItem(ANN_KEY, '1');
  };

  /* Keep the floating help button clear of the shop's cart button */
  if (document.getElementById('cartBtn')) document.body.classList.add('has-cart');

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ── Helpers shared by pages ── */
  window.qs = function (name) {
    return new URLSearchParams(location.search).get(name);
  };

  var stack;
  window.notify = function (msg, icon) {
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      stack.setAttribute('role', 'status');
      stack.setAttribute('aria-live', 'polite');
      document.body.appendChild(stack);
    }
    var t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<i class="ph ph-' + (icon || 'check-circle') + '"></i><span></span>';
    t.querySelector('span').textContent = msg;
    stack.appendChild(t);
    setTimeout(function () { t.remove(); }, 3200);
  };

  /* Escape text before putting user/localStorage data into innerHTML */
  window.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
})();
