import { contact } from './config.js';

const fullName = 'Juan Carlos C. Agacita';
const placeholders = {
  email: '[YOUR_EMAIL]',
  github: '[YOUR_GITHUB_URL]',
  linkedin: '[YOUR_LINKEDIN_URL]',
  portfolio: '[YOUR_PORTFOLIO_URL]',
};

// Reject placeholders and unsafe URLs before creating links or exporting contact data.
function validContact(key, value) {
  if (typeof value !== 'string' || !value.trim() || /[\r\n\[\]]/.test(value)) return '';
  const clean = value.trim();
  if (key === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) ? clean : '';
  try {
    const url = new URL(clean);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch {
    return '';
  }
}

const details = Object.fromEntries(
  Object.entries(placeholders).map(([key]) => [key, validContact(key, contact[key])]),
);

function renderContacts() {
  document.querySelectorAll('[data-contact]').forEach((element) => {
    const key = element.dataset.contact;
    const value = details[key];
    element.replaceChildren();
    if (!value) {
      element.textContent = placeholders[key];
      return;
    }
    const link = document.createElement('a');
    link.textContent = value;
    link.href = key === 'email' ? `mailto:${value}` : value;
    element.append(link);
  });
  document.querySelectorAll('[data-copy-email]').forEach((button) => {
    button.disabled = !details.email;
    if (!details.email) button.title = 'Add a real email in src/config.js to enable copying.';
  });
  document.querySelector('#contact-note').hidden = ['email', 'github', 'linkedin'].every((key) => details[key]);
}

let notificationTimer;
function notify(message) {
  const notification = document.querySelector('#notification');
  clearTimeout(notificationTimer);
  notification.textContent = message;
  notificationTimer = setTimeout(() => { notification.textContent = ''; }, 6000);
}

// Keep hidden mobile links out of the keyboard tab order using display: none.
const menuToggle = document.querySelector('#menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}
menuToggle.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});
matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

// inert prevents keyboard users from reaching the hidden side of the card.
const flipButton = document.querySelector('#flip-card');
flipButton.addEventListener('click', () => {
  const flipped = document.querySelector('#card-inner').classList.toggle('is-flipped');
  const front = document.querySelector('#card-front');
  const back = document.querySelector('#card-back');
  front.inert = flipped;
  back.inert = !flipped;
  front.setAttribute('aria-hidden', String(flipped));
  back.setAttribute('aria-hidden', String(!flipped));
  flipButton.setAttribute('aria-pressed', String(flipped));
});

async function copyEmail() {
  if (!details.email) return;
  try {
    await navigator.clipboard.writeText(details.email);
    notify('Email address copied.');
  } catch {
    // Some browsers block clipboard access. Keep the address available to copy manually.
    notify(`Clipboard unavailable. Select and copy: ${details.email}`);
  }
}
document.querySelectorAll('[data-copy-email]').forEach((button) => button.addEventListener('click', copyEmail));

function escapeVCard(value) {
  return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

// vCard 3.0 folds long lines at 75 UTF-8 bytes for contact-app compatibility.
function foldVCardLine(line) {
  let output = '';
  let byteCount = 0;
  const encoder = new TextEncoder();
  for (const character of line) {
    const bytes = encoder.encode(character).length;
    if (byteCount + bytes > 75) { output += '\r\n '; byteCount = 1; }
    output += character;
    byteCount += bytes;
  }
  return output;
}

function downloadContact() {
  const lines = [
    'BEGIN:VCARD', 'VERSION:3.0',
    `FN:${escapeVCard(fullName)}`,
    'N:Agacita;Juan Carlos;C.;;',
    'TITLE:Information Technology Student',
    'NOTE:Aspiring Database Administrator',
    'ADR;TYPE=HOME:;;;;;;Philippines',
  ];
  if (details.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCard(details.email)}`);
  for (const key of ['github', 'linkedin', 'portfolio']) {
    if (details[key]) lines.push(`URL:${escapeVCard(details[key])}`);
  }
  lines.push('END:VCARD');
  const vcard = lines.map(foldVCardLine).join('\r\n') + '\r\n';
  const url = URL.createObjectURL(new Blob([vcard], { type: 'text/vcard;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Juan-Carlos-Agacita.vcf';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  notify(details.email ? 'Contact downloaded.' : 'Contact downloaded. Missing contact details were left out.');
}
document.querySelector('#download-contact').addEventListener('click', downloadContact);

// Keep the navigation's current section accurate as visitors scroll.
const sectionObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    navigation.querySelectorAll('a').forEach((link) => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
}, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

// Absolute sharing URLs are added only after the real portfolio URL is configured.
if (details.portfolio) {
  const canonical = document.createElement('link');
  canonical.rel = 'canonical';
  canonical.href = details.portfolio;
  document.head.append(canonical);
  for (const [property, content] of [
    ['og:url', details.portfolio],
    ['og:image', new URL('images/profile.jpg', details.portfolio.replace(/\/?$/, '/')).href],
    ['og:image:alt', `Portrait of ${fullName}`],
  ]) {
    const meta = document.createElement('meta');
    meta.setAttribute('property', property);
    meta.content = content;
    document.head.append(meta);
  }
}
renderContacts();
