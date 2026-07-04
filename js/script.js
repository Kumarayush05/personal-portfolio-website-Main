

document.addEventListener('DOMContentLoaded', () => {
  setYear();
  initMobileMenu();
  initScrollSpy();
  initBackToTop();
  initContactForm();
});

// ---------- Footer year ----------
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// ---------- Mobile menu ----------
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  // Close the mobile menu after choosing a section
  menu.querySelectorAll('[data-tab]').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------- Scroll-spy: highlight the active editor tab ----------
function initScrollSpy() {
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const desktopTabs = Array.from(document.querySelectorAll('.tab[data-tab]'));
  const mobileTabs = Array.from(document.querySelectorAll('.mobile-tab[data-tab]'));

  if (sections.length === 0) return;

  const setActive = (id) => {
    desktopTabs.forEach((tab) => {
      const match = tab.getAttribute('href') === `#${id}`;
      tab.classList.toggle('is-active', match);
      if (match) {
        tab.setAttribute('aria-current', 'page');
      } else {
        tab.removeAttribute('aria-current');
      }
    });
    mobileTabs.forEach((tab) => {
      tab.classList.toggle('is-active', tab.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      // Pick the entry closest to the top of the viewport that's intersecting
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    },
    { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

// ---------- Back to top ----------
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---------- Contact form validation ----------
// This validates client-side and shows a status message. It does NOT send
// email on its own — connect it to a backend endpoint or a form service
// (Formspree, EmailJS, Netlify Forms) as described in README.md.
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  const fields = {
    name: { el: form.querySelector('#name'), validate: (v) => v.trim().length >= 2, message: 'Enter your name.' },
    email: { el: form.querySelector('#email'), validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), message: 'Enter a valid email address.' },
    subject: { el: form.querySelector('#subject'), validate: (v) => v.trim().length >= 3, message: 'Add a short subject.' },
    message: { el: form.querySelector('#message'), validate: (v) => v.trim().length >= 10, message: 'Message should be at least 10 characters.' },
  };

  const showError = (name, message) => {
    const wrapper = fields[name].el.closest('.field');
    const errorEl = form.querySelector(`[data-error-for="${name}"]`);
    wrapper.classList.toggle('has-error', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  };

  // Validate on blur for immediate feedback, not on every keystroke
  Object.entries(fields).forEach(([name, field]) => {
    field.el.addEventListener('blur', () => {
      const value = field.el.value;
      showError(name, field.validate(value) ? '' : field.message);
    });
  });
form.addEventListener("submit", (e) => {
  let hasError = false;

  Object.entries(fields).forEach(([name, field]) => {
    const ok = field.validate(field.el.value);
    showError(name, ok ? "" : field.message);
    if (!ok) hasError = true;
  });

  if (hasError) {
    e.preventDefault();

    status.textContent = "Fix the highlighted fields and try again.";
    status.style.color = "#F0776C";
    return;
  }

  // Form is valid – allow Formspree to submit the form
  status.textContent = "Sending message...";
  status.style.color = "#4ADE80";
});
}
