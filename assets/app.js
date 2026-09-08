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
});
