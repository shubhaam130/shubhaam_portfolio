const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const dismissLoader = () => document.querySelector('.loader')?.classList.add('is-gone');
document.addEventListener('DOMContentLoaded', dismissLoader, { once: true });
window.addEventListener('pageshow', dismissLoader);

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
let lastProjectTrigger;
document.querySelectorAll('.open-project').forEach((button) => button.addEventListener('click', () => {
  lastProjectTrigger = button;
  dialog.querySelector('h2').textContent = button.dataset.project;
  dialog.showModal();
}));
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => lastProjectTrigger?.focus());

document.querySelectorAll('img').forEach((image) => image.decoding = 'async');

const galleryImages = [...document.querySelectorAll('.project-image img, .extended-images img, .case-grid figure img')];
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('figcaption');
const lightboxCount = lightbox.querySelector('.lightbox-count');
let activeArtwork = 0;
let lastArtworkTrigger;

const showArtwork = (index) => {
  activeArtwork = (index + galleryImages.length) % galleryImages.length;
  const source = galleryImages[activeArtwork];
  lightboxImage.src = source.currentSrc || source.src;
  lightboxImage.alt = source.alt;
  lightboxCaption.textContent = source.closest('figure')?.querySelector('figcaption')?.textContent || source.alt;
  lightboxCount.textContent = `${activeArtwork + 1} / ${galleryImages.length}`;
};

galleryImages.forEach((image, index) => {
  image.setAttribute('tabindex', '0');
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `Open ${image.alt} in full screen`);
  const openArtwork = () => { lastArtworkTrigger = image; showArtwork(index); lightbox.showModal(); };
  image.addEventListener('click', openArtwork);
  image.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openArtwork(); } });
});

lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showArtwork(activeArtwork - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showArtwork(activeArtwork + 1));
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') showArtwork(activeArtwork - 1); if (event.key === 'ArrowRight') showArtwork(activeArtwork + 1); });
lightbox.addEventListener('close', () => { lightboxImage.removeAttribute('src'); lastArtworkTrigger?.focus(); });

const toast = document.querySelector('.toast');
let toastTimer;
const notify = (message) => { toast.textContent = message; toast.classList.add('is-visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200); };
document.querySelectorAll('[data-copy-value]').forEach((button) => {
  button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(button.dataset.copyValue); notify('Copied to clipboard'); } catch { notify(button.dataset.copyValue); }
  });
});
