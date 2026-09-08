
// Tiny interaction layer: HUD tabs + a gentle parallax star field.
document.addEventListener('DOMContentLoaded', () => {
  const tabs = [...document.querySelectorAll('.hud-tab')];
  const panels = [...document.querySelectorAll('.hud-panel')];
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.dataset.group;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === group));
    });
  });

  const stars = document.querySelector('.stars');
  if (stars && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('pointermove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      stars.style.transform = `translate(${x}px, ${y}px)`;
    }, {passive:true});
  }
});
