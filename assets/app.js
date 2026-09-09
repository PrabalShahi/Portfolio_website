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


// Robust Explore Projects rocket launch: animate in the viewport, hit the Projects planet, then navigate.
(() => {
  const button = document.querySelector('.rocket-launch-btn');
  const projectsPlanet = document.querySelector('.planet-item[href="projects.html"] .planet');
  if (!button || !projectsPlanet) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  button.addEventListener('click', (event) => {
    event.preventDefault();
    if (button.classList.contains('is-launching')) return;

    // Reduced motion: go directly to the requested page.
    if (prefersReduced) {
      window.location.href = button.href;
      return;
    }

    const b = button.getBoundingClientRect();
    const p = projectsPlanet.getBoundingClientRect();

    const start = {
      x: b.left + b.width * 0.78,
      y: b.top + b.height * 0.50
    };
    const end = {
      x: p.left + p.width * 0.50,
      y: p.top + p.height * 0.50
    };

    // Create the flight layer fresh for every launch.
    const flight = document.createElement('div');
    flight.className = 'rocket-flight launching';
    flight.setAttribute('aria-hidden', 'true');

    const rocket = document.createElement('div');
    rocket.className = 'rocket';
    rocket.textContent = '🚀';

    const flame = document.createElement('div');
    flame.className = 'rocket-flame';

    flight.append(rocket, flame);
    document.body.appendChild(flight);

    button.classList.add('is-launching');

    const duration = 1550;
    const startTime = performance.now();

    const trailTimer = setInterval(() => {
      const r = rocket.getBoundingClientRect();
      const trail = document.createElement('div');
      trail.className = 'rocket-trail';
      trail.style.left = `${r.left + r.width * 0.18}px`;
      trail.style.top = `${r.top + r.height * 0.74}px`;
      trail.style.opacity = `${0.55 + Math.random() * 0.25}`;
      document.body.appendChild(trail);
      trail.animate(
        [
          { transform: 'translate(-50%,-15%) scale(1)', opacity: .65 },
          { transform: 'translate(-50%,14px) scale(.25)', opacity: 0 }
        ],
        { duration: 260, easing: 'ease-out', fill: 'forwards' }
      ).finished.finally(() => trail.remove());
    }, 90);

    const animate = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);

      // A gentle arc upward before descending into the Projects planet.
      const x = start.x + (end.x - start.x) * eased;
      const arc = Math.sin(Math.PI * progress) * Math.max(55, Math.abs(end.y - start.y) * 0.30);
      const y = start.y + (end.y - start.y) * eased - arc;

      const dx = end.x - start.x;
      const dy = (end.y - start.y) - Math.cos(Math.PI * progress) * Math.max(55, Math.abs(end.y - start.y) * 0.30);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      rocket.style.transform = `translate3d(${x - 12}px,${y - 12}px,0) rotate(${angle}deg)`;
      flame.style.transform = `translate3d(${x - 1}px,${y + 10}px,0) rotate(${angle}deg)`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        clearInterval(trailTimer);

        // Crash/impact exactly on the Projects planet.
        const impact = document.createElement('div');
        impact.className = 'planet-impact';
        impact.style.left = `${end.x}px`;
        impact.style.top = `${end.y}px`;
        document.body.appendChild(impact);

        // Briefly emphasize the target planet before navigation.
        projectsPlanet.animate(
          [
            { transform: 'scale(1)' },
            { transform: 'scale(1.35)' },
            { transform: 'scale(1)' }
          ],
          { duration: 420, easing: 'ease-out' }
        );

        setTimeout(() => {
          flight.remove();
          impact.remove();
          button.classList.remove('is-launching');
          window.location.href = button.href;
        }, 520);
      }
    };

    requestAnimationFrame(animate);
  });
})();
