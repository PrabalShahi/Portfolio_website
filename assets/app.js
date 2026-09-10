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


// Explore Projects rocket launch: transfer to orbit, revolve around the Projects planet, then crash.
(() => {
  const button = document.querySelector('.rocket-launch-btn');
  const projectsPlanet = document.querySelector('.planet-item[href="projects.html"] .planet');
  if (!button || !projectsPlanet) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  button.addEventListener('click', (event) => {
    event.preventDefault();
    if (button.classList.contains('is-launching')) return;

    if (prefersReduced) {
      window.location.href = button.href;
      return;
    }

    const buttonRect = button.getBoundingClientRect();
    const planetRect = projectsPlanet.getBoundingClientRect();

    const startX = buttonRect.left + buttonRect.width * 0.80;
    const startY = buttonRect.top + buttonRect.height * 0.50;

    const centerX = planetRect.left + planetRect.width * 0.50;
    const centerY = planetRect.top + planetRect.height * 0.50;

    // Orbit is intentionally larger than the planet so the rocket visibly travels around it.
    const orbitRadius = Math.max(58, Math.min(92, window.innerWidth * 0.055));

    // Begin at the point on the orbit that is closest to the button.
    const startAngle = Math.atan2(startY - centerY, startX - centerX);
    const transferX = centerX + Math.cos(startAngle) * orbitRadius;
    const transferY = centerY + Math.sin(startAngle) * orbitRadius;

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

    const trails = new Set();
    const addTrail = (x, y, angle) => {
      const trail = document.createElement('div');
      trail.className = 'rocket-trail';
      trail.style.left = `${x}px`;
      trail.style.top = `${y}px`;
      trail.style.transform = `translate(-50%,-50%) rotate(${angle + 180}deg)`;
      trail.style.opacity = '0.55';
      document.body.appendChild(trail);
      trails.add(trail);

      trail.animate(
        [
          { opacity: .55, transform: `translate(-50%,-50%) rotate(${angle + 180}deg) scale(1)` },
          { opacity: 0, transform: `translate(-50%,-50%) rotate(${angle + 180}deg) scale(.15) translateY(12px)` }
        ],
        { duration: 520, easing: 'ease-out', fill: 'forwards' }
      ).finished.finally(() => {
        trails.delete(trail);
        trail.remove();
      });
    };

    const cleanupTrails = () => {
      trails.forEach(t => t.remove());
      trails.clear();
    };

    // Phase 1: slow transfer to the orbit.
    const transferDuration = 1400;
    const orbitDuration = 3100;
    const crashDuration = 1200;
    const startedAt = performance.now();

    const render = (now) => {
      const elapsed = now - startedAt;

      let x, y, angle;

      if (elapsed <= transferDuration) {
        const p = elapsed / transferDuration;
        const eased = 1 - Math.pow(1 - p, 3);

        // Gentle arc into the orbit rather than a straight line.
        const arcLift = Math.sin(Math.PI * eased) * 42;
        x = startX + (transferX - startX) * eased;
        y = startY + (transferY - startY) * eased - arcLift;

        angle = Math.atan2((transferY - startY) - Math.cos(Math.PI * eased) * 42, transferX - startX) * 180 / Math.PI;
      } else if (elapsed <= transferDuration + orbitDuration) {
        // Phase 2: realistic orbital travel around the planet.
        const orbitP = (elapsed - transferDuration) / orbitDuration;
        const turns = 1.35;
        const theta = startAngle + orbitP * Math.PI * 2 * turns;

        x = centerX + Math.cos(theta) * orbitRadius;
        y = centerY + Math.sin(theta) * orbitRadius;

        // Tangential direction: velocity is perpendicular to radius.
        angle = (theta + Math.PI / 2) * 180 / Math.PI;
      } else {
        // Phase 3: spiral inward and collide with the planet.
        const crashP = Math.min(1, (elapsed - transferDuration - orbitDuration) / crashDuration);
        const crashEase = crashP * crashP * (3 - 2 * crashP);
        const theta = startAngle + Math.PI * 2 * turnsValue(1.35) + crashP * Math.PI * 1.15;
        const radius = orbitRadius * (1 - crashEase);

        x = centerX + Math.cos(theta) * radius;
        y = centerY + Math.sin(theta) * radius;

        angle = (theta + Math.PI / 2 + crashP * 22) * 180 / Math.PI;

        if (crashP >= 1) {
          x = centerX;
          y = centerY;
        }
      }

      rocket.style.transform = `translate3d(${x - 12}px,${y - 12}px,0) rotate(${angle}deg)`;
      flame.style.transform = `translate3d(${x - 2}px,${y + 9}px,0) rotate(${angle}deg)`;

      if (elapsed > transferDuration + 180 && elapsed < transferDuration + orbitDuration + crashDuration - 100) {
        if (Math.floor(elapsed / 90) !== Math.floor((elapsed - 16) / 90)) {
          addTrail(x - 3, y + 3, angle);
        }
      }

      if (elapsed < transferDuration + orbitDuration + crashDuration) {
        requestAnimationFrame(render);
        return;
      }

      cleanupTrails();

      // Impact flash + subtle planet response at the exact collision point.
      const impact = document.createElement('div');
      impact.className = 'planet-impact';
      impact.style.left = `${centerX}px`;
      impact.style.top = `${centerY}px`;
      document.body.appendChild(impact);

      projectsPlanet.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.16)' },
          { transform: 'scale(.98)' },
          { transform: 'scale(1)' }
        ],
        { duration: 650, easing: 'ease-out' }
      );

      setTimeout(() => {
        flight.remove();
        impact.remove();
        button.classList.remove('is-launching');
        window.location.href = button.href;
      }, 800);
    };

    requestAnimationFrame(render);
  });

  function turnsValue(value) {
    return value;
  }
})();




// Home-page wormhole: one GitHub tab only, no navigation in the portfolio tab.
(() => {
  if (!document.body.classList.contains('home-page')) return;

  const hole = document.querySelector('.wormhole-clickable');
  if (!hole) return;

  const githubUrl = 'https://github.com/PrabalShahi';
  let busy = false;

  const openGitHub = () => {
    if (busy) return;
    busy = true;

    // Open exactly one GitHub tab directly from the user's click.
    // The portfolio tab stays on the Home page throughout the visual transition.
    const destination = window.open(githubUrl, '_blank', 'noopener,noreferrer');

    hole.classList.add('wormhole-github-pulse');

    const flare = document.createElement('span');
    flare.className = 'wormhole-github-flare';
    hole.appendChild(flare);

    // Brief visual collapse into the wormhole, then leave the home page untouched.
    setTimeout(() => {
      flare.remove();
      hole.classList.remove('wormhole-github-pulse');
      busy = false;
      if (destination && !destination.closed) {
        try { destination.focus(); } catch (_) {}
      }
    }, 1150);

    // Only use same-tab fallback if the browser blocks opening a new tab.
    if (!destination) {
      window.location.href = githubUrl;
    }
  };

  hole.addEventListener('click', openGitHub);
  hole.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openGitHub();
    }
  });
})();

// Site-wide dark/light theme.
// About page owns the sun control; the selected theme persists across every page.
(() => {
  const sun = document.querySelector('.theme-sun-toggle');
  const storageKey = 'prabal-theme';

  const setLightMode = (enabled, persist = true) => {
    document.body.classList.toggle('light-mode', enabled);
    if (sun) {
      sun.setAttribute('aria-pressed', String(enabled));
      sun.setAttribute('aria-label', enabled ? 'Switch to dark mode' : 'Switch to light mode');
    }
    if (persist) {
      try {
        localStorage.setItem(storageKey, enabled ? 'light' : 'dark');
      } catch (_) {}
    }
  };

  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem(storageKey) || 'dark'; } catch (_) {}
  setLightMode(savedTheme === 'light', false);

  if (sun) {
    sun.addEventListener('click', () => {
      setLightMode(!document.body.classList.contains('light-mode'));
    });
  }
})();
