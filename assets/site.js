/* JFW Academy shared behaviour: page fade-in, reveals, nav and mobile menu, sign-up forms */
(() => {
'use strict';
/* ====== settings: change these in one place ====== */
const WHATSAPP_NUMBER = '62818105777';   // digits only with country code, e.g. 62812XXXXXXX. While empty, forms open an email instead and the WhatsApp card stays hidden.
const CONTACT_EMAIL = 'jakartafootballwarrior@gmail.com';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ====== page fade-in and tab pause ====== */
const showPage = () => document.body.classList.add('ready');
(document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]) : Promise.resolve()).then(showPage);
setTimeout(showPage, 2000);
document.addEventListener('visibilitychange', () => document.body.classList.toggle('paused', document.hidden));

/* ====== reveal choreography ====== */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  setTimeout(() => e.target.classList.add('settled'), 1800);
  io.unobserve(e.target);
}), { threshold: .14 });
$$('.rvc').forEach(el => io.observe(el));

/* sections get .vis-on while on screen so their living element runs only then */
const vio = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('vis-on', e.isIntersecting)), { threshold: .05 });
$$('section.sec').forEach(s => vio.observe(s));

/* ====== nav: solid on scroll, mobile menu ====== */
const nav = $('#nav');
if (nav) {
  let solid = false;
  const onScroll = () => { const s = window.scrollY > 40; if (s !== solid) { solid = s; nav.classList.toggle('solid', s); } };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const toggle = $('.nav-toggle', nav);
  const setOpen = open => { nav.classList.toggle('open', open); if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false'); };
  if (toggle) {
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    $$('.links a', nav).forEach(a => a.addEventListener('click', () => setOpen(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    addEventListener('resize', () => { if (innerWidth > 900) setOpen(false); });
  }
}

/* ====== WhatsApp card appears once a number is set ====== */
if (WHATSAPP_NUMBER) {
  $$('[data-whatsapp]').forEach(a => {
    a.href = 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER;
    a.hidden = false;
  });
}

/* ====== sign-up forms ====== */
$$('.join-card').forEach(card => {
  const form = $('.join-form', card);
  if (!form) return;
  const val = n => (form.elements[n] ? form.elements[n].value : '').toString().trim();
  form.addEventListener('submit', e => {
    e.preventDefault();
    const player = val('player'), age = val('age'), parent = val('parent'), note = val('note');
    let ok = true;
    [['player', player], ['age', age], ['parent', parent]].forEach(([n, v]) => {
      const fld = form.elements[n].closest('.field');
      fld.classList.toggle('bad', !v);
      if (!v) ok = false;
    });
    if (!ok) { const first = $('.field.bad input, .field.bad select', form); if (first) first.focus(); return; }
    const msg = 'Hi JFW Academy. I would like to join the JFW Squad.\nPlayer: ' + player + '\nAge group: ' + age + '\nParent: ' + parent + (note ? '\nNote: ' + note : '');
    const title = $('.success h3', card), text = $('.success p', card);
    if (WHATSAPP_NUMBER) {
      window.open('https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + encodeURIComponent(msg), '_blank', 'noopener');
      title.textContent = 'Got it.';
      text.textContent = 'WhatsApp opened with your details ready. Press send and we will message you with the trial details soon.';
    } else {
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('JFW Squad: ' + player + ' (' + age + ')') + '&body=' + encodeURIComponent(msg);
      title.textContent = 'Got it.';
      text.textContent = 'Your email app opened with your details ready. Press send and we will message you with the trial details soon.';
    }
    card.classList.add('sent');
  });
  $$('.field input,.field select', form).forEach(el => el.addEventListener('input', () => el.closest('.field').classList.remove('bad')));
});
})();
