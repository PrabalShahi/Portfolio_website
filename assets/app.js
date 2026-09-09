// Portfolio interactions: skill tabs, project filters, certificate filters and subtle motion.
document.addEventListener('DOMContentLoaded', () => {
  // Skills tabs
  const skillTabs = [...document.querySelectorAll('.skill-tab')];
  const skillPanels = [...document.querySelectorAll('.skill-panel')];
  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.dataset.group;
      skillTabs.forEach(t => t.classList.toggle('active', t === tab));
      skillPanels.forEach(panel => panel.classList.toggle('active', panel.dataset.panel === group));
    });
  });

  // Filter buttons. Each filter row controls only the cards in its own page/content area.
  document.querySelectorAll('.filter-row').forEach(row => {
    const buttons = [...row.querySelectorAll('.filter[data-filter]')];
    if (!buttons.length) return;

    const page = row.closest('main') || document;
    const projectCards = [...page.querySelectorAll('.project-card[data-category]')];
    const certCards = [...page.querySelectorAll('.cert-card[data-category]')];
    const cards = projectCards.length ? projectCards : certCards;
    if (!cards.length) return;

    const applyFilter = (target) => {
      buttons.forEach(button => {
        const isActive = button.dataset.filter === target;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      cards.forEach(card => {
        const visible = target === 'all' || card.dataset.category === target;
        card.classList.toggle('is-hidden', !visible);
      });
    };

    buttons.forEach(button => {
      button.type = 'button';
      button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
      button.addEventListener('click', () => applyFilter(button.dataset.filter));
    });

    // Make sure the initial state is correctly applied on load.
    const initial = buttons.find(button => button.classList.contains('active')) || buttons[0];
    applyFilter(initial.dataset.filter);
  });

  // Subtle cursor-responsive background glow.
  const root = document.documentElement;
  const stars = document.querySelector('.stars');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('pointermove', (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 42;
      const y = (event.clientY / window.innerHeight - 0.5) * 30;
      root.style.setProperty('--mx', `${x}px`);
      root.style.setProperty('--my', `${y}px`);
      if (stars) stars.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    }, { passive: true });
  }

  // Planetary navigation: each hanging planet subtly follows the cursor.
  const navItems = [...document.querySelectorAll('.planet-item')];
  if (navItems.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const resetPlanets = () => navItems.forEach(item => {
      item.style.setProperty('--px', '0px');
      item.style.setProperty('--py', '0px');
      item.style.setProperty('--tilt', '0deg');
    });
    window.addEventListener('pointermove', (event) => {
      navItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + 24;
        const dx = event.clientX - cx;
        const dy = event.clientY - cy;
        const distance = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - distance / 340);
        const px = (dx / 340) * 12 * influence;
        const py = (dy / 260) * 7 * influence;
        const tilt = (dx / 340) * 7 * influence;
        item.style.setProperty('--px', `${px.toFixed(2)}px`);
        item.style.setProperty('--py', `${py.toFixed(2)}px`);
        item.style.setProperty('--tilt', `${tilt.toFixed(2)}deg`);
        const thread = item.querySelector('.thread');
        if (thread) thread.style.transform = `rotate(${(dx/420*8*influence).toFixed(2)}deg)`;
      });
    }, {passive:true});
    window.addEventListener('blur', resetPlanets);
  }

});


// Cursor-reactive neutron-star logo.
(() => {
  const logo = document.querySelector('.pulsar-logo');
  if (!logo || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const brand = logo.closest('.brand');
  if (!brand) return;
  brand.addEventListener('pointermove', (event) => {
    const r = brand.getBoundingClientRect();
    const dx = event.clientX - (r.left + 19);
    const dy = event.clientY - (r.top + 19);
    const rotY = Math.max(-12, Math.min(12, dx / 7));
    const rotX = Math.max(-12, Math.min(12, -dy / 7));
    logo.style.setProperty('--star-x', `${rotX}deg`);
    logo.style.setProperty('--star-y', `${rotY}deg`);
    logo.style.setProperty('--star-scale', '1.08');
  });
  brand.addEventListener('pointerleave', () => {
    logo.style.setProperty('--star-x', '0deg');
    logo.style.setProperty('--star-y', '0deg');
    logo.style.setProperty('--star-scale', '1');
  });
})();

// Explore Projects rocket launch.
(() => {
  const button = document.querySelector('.rocket-launch-btn');
  const flight = document.createElement('div');
  if (!button) return;

  flight.className = 'rocket-flight';
  flight.setAttribute('aria-hidden', 'true');
  flight.innerHTML = '<span class="rocket">🚀</span><span class="rocket-flame"></span>';
  document.body.appendChild(flight);

  const projectsPlanet = document.querySelector('.planet-item[href="projects.html"] .planet');
  if (!projectsPlanet) return;

  button.addEventListener('click', (event) => {
    event.preventDefault();
    if (button.classList.contains('is-launching')) return;

    const b = button.getBoundingClientRect();
    const p = projectsPlanet.getBoundingClientRect();

    const sx = b.left + b.width * 0.80;
    const sy = b.top + b.height * 0.50;
    const tx = p.left + p.width * 0.50;
    const ty = p.top + p.height * 0.50;
    const mx = sx + (tx - sx) * 0.43;
    const my = sy - Math.max(55, Math.abs(ty - sy) * 0.22);

    flight.style.setProperty('--sx', `${sx}px`);
    flight.style.setProperty('--sy', `${sy}px`);
    flight.style.setProperty('--mx', `${mx}px`);
    flight.style.setProperty('--my', `${my}px`);
    flight.style.setProperty('--tx', `${tx}px`);
    flight.style.setProperty('--ty', `${ty}px`);

    button.classList.add('is-launching');
    flight.classList.remove('launching');
    void flight.offsetWidth;
    flight.classList.add('launching');

    setTimeout(() => {
      const impact = document.createElement('div');
      impact.className = 'planet-impact';
      impact.style.left = `${tx}px`;
      impact.style.top = `${ty}px`;
      document.body.appendChild(impact);
      requestAnimationFrame(() => impact.classList.add('show'));

      setTimeout(() => impact.remove(), 450);
      window.location.href = button.href;
    }, 1500);
  });
})();
