import './site.css';
import { api } from './utils/api.js';
import { DESIGN_SEED } from './design-seed.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const read = (key, fallback) => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } };
const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Preferences still work for this visit. */ } };
let theme = read('theme', 'light');
let accent = read('portfolio-accent', '#3155e7');
let contrast = read('colorblindMode', 'false') === 'true';
let tracking = read('trackingEnabled', 'true') !== 'false';
const accents = ['#3155e7', '#8b4bce', '#17755d', '#a43b4a', '#695428'];
function applyPreferences() {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.contrast = String(contrast);
    document.documentElement.style.setProperty('--accent', accent);
    $('#theme-setting').checked = theme === 'dark';
    $('#contrast-setting').checked = contrast;
    $('#tracking-setting').checked = tracking;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#171a21' : '#f8f9fb';
    $$('[data-accent]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.accent === accent)));
}
applyPreferences();
function toggleTheme() { theme = theme === 'dark' ? 'light' : 'dark'; save('theme', theme); applyPreferences(); }
function changeAccent(color) { accent = color; save('portfolio-accent', color); applyPreferences(); }
function randomAccent() { changeAccent(accents.filter(color => color !== accent)[Math.floor(Math.random() * (accents.length - Number(accents.includes(accent))))]); }
$('#theme-setting').addEventListener('change', toggleTheme);
$('#contrast-setting').addEventListener('change', event => { contrast = event.target.checked; save('colorblindMode', contrast); applyPreferences(); });
$('#tracking-setting').addEventListener('change', event => { tracking = event.target.checked; save('trackingEnabled', tracking); tracking ? window.posthog?.opt_in_capturing?.() : window.posthog?.opt_out_capturing?.(); if (tracking) initializeAnalytics(); });
$$('[data-accent]').forEach(button => button.addEventListener('click', () => changeAccent(button.dataset.accent)));
$('#random-accent').addEventListener('click', randomAccent);

// A deterministic radial mark derived from the original 20-digit design seed.
const mark = $('#seed-mark');
if (mark) {
    let state = BigInt(DESIGN_SEED);
    document.body.dataset.designSeed = DESIGN_SEED;
    const random = () => { state = (state * 6364136223846793005n + 1442695040888963407n) & ((1n << 64n) - 1n); return Number(state >> 32n) / 4294967296; };
    for (let i = 0; i < 40; i++) {
        const angle = i / 40 * Math.PI * 2;
        const inner = 20 + random() * 13;
        const outer = 70 + random() * 12;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        for (const [key, value] of Object.entries({ x1: 90 + Math.cos(angle) * inner, y1: 90 + Math.sin(angle) * inner, x2: 90 + Math.cos(angle) * outer, y2: 90 + Math.sin(angle) * outer, stroke: 'currentColor', 'stroke-width': 1.3 })) line.setAttribute(key, value);
        mark.append(line);
    }
}

// Native dialogs provide focus containment, Escape dismissal, and focus return.
function openDialog(id) { const dialog = $(id); if (dialog && !dialog.open) dialog.showModal(); }
$('#settings-open').addEventListener('click', () => openDialog('#settings-dialog'));
$('#shortcuts-open').addEventListener('click', () => openDialog('#shortcuts-dialog'));
$$('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
$$('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
});

const certs = $$('[data-certificate]');
let certIndex = 0;
function updateCertificate() {
    const cert = certs[certIndex];
    $('#certificate-title').textContent = cert.dataset.title;
    $('#certificate-image').src = `/certificates/${cert.dataset.certificate}.jpg`;
    $('#certificate-image').alt = cert.dataset.title;
    $('#certificate-download').href = $('#certificate-image').src;
    $('#certificate-prev').disabled = certIndex === 0;
    $('#certificate-next').disabled = certIndex === certs.length - 1;
    $('.certificate-image').classList.remove('zoomed');
    $('#certificate-zoom').setAttribute('aria-pressed', 'false');
}
certs.forEach((button, index) => button.addEventListener('click', () => { certIndex = index; updateCertificate(); openDialog('#certificate-dialog'); }));
$('#certificate-prev')?.addEventListener('click', () => { if (certIndex > 0) { certIndex--; updateCertificate(); } });
$('#certificate-next')?.addEventListener('click', () => { if (certIndex < certs.length - 1) { certIndex++; updateCertificate(); } });
$('#certificate-zoom')?.addEventListener('click', event => event.currentTarget.setAttribute('aria-pressed', String($('.certificate-image').classList.toggle('zoomed'))));
$('#video-open')?.addEventListener('click', () => {
    $('#video-frame').innerHTML = '<iframe src="https://www.youtube.com/embed/IlZNzD0GKhw?autoplay=1" title="Ashar Rai Mujeeb introduction" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    openDialog('#video-dialog');
});
$('#video-dialog')?.addEventListener('close', () => { $('#video-frame').replaceChildren(); });

let toastTimer;
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3000); }
$('#share-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('https://ashar.site'); toast('Portfolio link copied.'); }
    catch { toast('Copy this address: https://ashar.site'); }
});

let filter = 'All';
function filterProjects() {
    const search = ($('#project-search')?.value || '').trim().toLowerCase();
    let count = 0;
    $$('.directory-grid .project-card').forEach(card => {
        card.hidden = !((filter === 'All' || card.dataset.category === filter) && card.dataset.search.includes(search));
        if (!card.hidden) count++;
    });
    $('#project-count').textContent = `${count} PROJECT${count === 1 ? '' : 'S'}`;
    $('#no-projects').hidden = count !== 0;
}
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    $$('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    filterProjects();
}));
$('#project-search')?.addEventListener('input', filterProjects);

// Submit using the documented existing API; report success only after acknowledgement.
$('#contact-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const input = $('#contact-input'), status = $('#contact-status');
    const contact = input.value.trim();
    const phone = contact.replace(/[\s()-]/g, '');
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const valid = isEmail || /^[6-9]\d{9}$/.test(phone) || /^\+[1-9]\d{9,14}$/.test(phone);
    input.setAttribute('aria-invalid', String(!valid));
    if (!valid) { status.textContent = 'Enter a valid email address or phone number.'; input.focus(); return; }
    const button = event.currentTarget.querySelector('button');
    button.disabled = true; button.textContent = 'Sending…'; status.textContent = 'Sending your contact details…';
    try {
        const result = await api.submitContact({ contact, type: isEmail ? 'email' : 'phone', timestamp: new Date().toISOString(), source: 'portfolio', user_agent: navigator.userAgent, theme, accent_color: accent });
        if (result?.success !== true) throw new Error('Contact was not acknowledged');
        status.textContent = 'Thanks — your details were received. I’ll get back to you.'; input.value = '';
    } catch {
        status.textContent = 'Couldn’t send right now. Please email asharrm18@gmail.com or try again.';
    } finally { button.disabled = false; button.textContent = 'Send ↗'; }
});

let lastKey = '', lastTime = 0;
document.addEventListener('keydown', event => {
    if (event.target.closest('input, textarea, [contenteditable="true"]') || event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
    const key = event.key.toLowerCase();
    if ($('#certificate-dialog')?.open) {
        if (key === 'arrowleft') $('#certificate-prev').click();
        if (key === 'arrowright') $('#certificate-next').click();
        return;
    }
    if ($$('dialog').some(dialog => dialog.open)) return;
    if (key === '/') { event.preventDefault(); openDialog('#shortcuts-dialog'); return; }
    if (Date.now() - lastTime < 1000) {
        const chord = lastKey + key;
        if (chord === 'zn') toggleTheme();
        if (chord === 'zx') randomAccent();
        if (chord === 'zc') { if ($('#contact')) { $('#contact').scrollIntoView({ behavior: 'instant' }); $('#contact-input').focus({ preventScroll: true }); } else location.href = '/#contact'; }
        if (chord === 'cv') { const link = document.createElement('a'); link.href = '/cv.pdf'; link.download = 'Ashar-Rai-Mujeeb-CV.pdf'; link.click(); }
        if (chord === 'zr') location.href = 'mailto:asharrm18@gmail.com?subject=Portfolio%20issue';
    }
    lastKey = key; lastTime = Date.now();
});

function initializeAnalytics() {
    const key = import.meta.env.VITE_POSTHOG_KEY;
    if (!key || !tracking || window.posthog) return;
    const host = import.meta.env.VITE_POSTHOG_HOST || 'https://us.posthog.com';
    const queue = [];
    for (const method of ['capture', 'opt_in_capturing', 'opt_out_capturing']) queue[method] = (...args) => queue.push([method, ...args]);
    queue._i = [[key, { api_host: host, opt_out_capturing_by_default: !tracking }, 'posthog']];
    queue.__SV = 1;
    window.posthog = queue;
    const script = document.createElement('script'); script.async = true; script.src = `${host}/static/array.js`; document.head.appendChild(script);
}
initializeAnalytics();
