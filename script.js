const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('load', () => document.querySelector('.loader').classList.add('is-gone'));

if (motionOK) {
  const glow = document.querySelector('.cursor-glow');
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.animate([{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 800, easing: 'cubic-bezier(.2,.75,.2,1)', fill: 'forwards' });
      observer.unobserve(entry.target);
    }
  }), { threshold: .13 });
  document.querySelectorAll('.reveal').forEach((item) => { item.style.opacity = '0'; observer.observe(item); });
}

const dialog = document.querySelector('.project-dialog');
document.querySelectorAll('.open-project').forEach((button) => button.addEventListener('click', () => {
  dialog.querySelector('h2').textContent = button.dataset.project;
  dialog.showModal();
}));
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
