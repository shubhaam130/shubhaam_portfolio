const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Loader animation
window.addEventListener('load', () => {
  setTimeout(() => document.querySelector('.loader')?.classList.add('is-gone'), 300);
});

if (motionOK) {
  // Cursor glow effect
  const glow = document.querySelector('.cursor-glow');
  if (glow) {
    window.addEventListener('pointermove', (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    });
  }

  // 3D tilt effect on cards
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });

  // Scroll reveal animation
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.animate(
        [
          { opacity: 0, transform: 'translateY(28px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 800, easing: 'cubic-bezier(.2,.75,.2,1)', fill: 'forwards' }
      );
      observer.unobserve(entry.target);
    }
  }), { threshold: .13 });
  document.querySelectorAll('.reveal').forEach((item) => {
    item.style.opacity = '0';
    observer.observe(item);
  });
}

// Project dialog management
const dialog = document.querySelector('.project-dialog');
if (dialog) {
  document.querySelectorAll('.open-project').forEach((button) => {
    button.addEventListener('click', () => {
      const title = dialog.querySelector('h2');
      if (title) title.textContent = button.dataset.project || 'Selected project';
      dialog.showModal();
    });
  });

  const closeBtn = document.querySelector('.close-dialog');
  if (closeBtn) closeBtn.addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (event) {
    const targetId = this.getAttribute('href');
    if (targetId && targetId !== '#' && document.querySelector(targetId)) {
      event.preventDefault();
      document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
