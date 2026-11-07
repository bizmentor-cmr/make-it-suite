/**
 * HF-COMMON — Helper partagé Phase 9 (Tests Fonctionnels)
 * Contexte navigateur PERSISTANT : survit aux pauses (2FA) entre les scripts.
 * ⚠️ Le profil (.hf-phase9-profile) contient cookies/session → JAMAIS dans les ZIPs livrables.
 */
const { chromium } = require('/home/z/.npm-global/lib/node_modules/playwright');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const PROFILE_DIR = process.env.HF_PROFILE || '/home/z/my-project/.hf-phase9-profile';
const OUT = '/home/z/my-project/reverse-higgsfield/03-features/tests/captures';
const COOKIES_FILE = '/home/z/my-project/.hf-cookies.json';

const EMAIL = 'charles.fabou@yahoo.fr';
const PASSWORD = 'U6B9iGs+quVj/79';

const log = (m) => console.log(`[${new Date().toISOString().substring(11, 19)}] ${m}`);

async function launch() {
  fs.mkdirSync(OUT, { recursive: true });
  const useFull = process.env.HF_BROWSER === 'full';
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: !useFull,
    executablePath: useFull
      ? '/home/z/.cache/ms-playwright/chromium-1200/chrome-linux64/chrome'
      : '/home/z/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell',
    viewport: { width: 1440, height: 900 },
    ...(useFull ? {} : { userAgent: UA }),
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-blink-features=AutomationControlled',
      '--disable-gpu', '--renderer-process-limit=1', '--disable-hang-monitor',
      '--disable-backgrounding-occluded-windows', '--disable-back-forward-cache',
      '--js-flags=--max-old-space-size=384',
      ...(useFull ? ['--window-size=900,650'] : [])],
    locale: 'en-US',
    timezoneId: 'Europe/London',
  });
  // Restaure la session Clerk sauvegardée (y compris cookies de session) si elle existe
  try {
    if (fs.existsSync(COOKIES_FILE)) {
      const cookies = JSON.parse(fs.readFileSync(COOKIES_FILE, 'utf8'));
      if (Array.isArray(cookies) && cookies.length) {
        await browser.addCookies(cookies);
        log(`session restaurée : ${cookies.length} cookies injectés`);
      }
    }
  } catch (e) { log('injection cookies: ' + e.message); }
  const page = browser.pages()[0] || await browser.newPage();
  return { browser, page };
}

/** Rejette le bandeau cookies Securiti (se régénère à chaque navigation) */
async function dismissCookies(page) {
  const selectors = [
    'button:has-text("Reject All")', 'button:has-text("Reject")',
    'button:has-text("Allow All")', 'button:has-text("Allow")',
    '.cc-dismiss', '.cc-close',
  ];
  for (const sel of selectors) {
    const el = page.locator(sel).first();
    try {
      if ((await el.count()) > 0 && (await el.isVisible())) {
        await el.click({ timeout: 3000 });
        log('Cookies dismissé via ' + sel);
        await page.waitForTimeout(1500);
        return true;
      }
    } catch (e) { /* continue */ }
  }
  try {
    const cc = page.locator('.cc-window, [aria-label="cookieconsent"]').first();
    if ((await cc.count()) > 0) {
      const closeBtn = cc.locator('button').first();
      if ((await closeBtn.count()) > 0) { await closeBtn.click({ timeout: 3000 }); log('Cookies fermé (premier bouton)'); await page.waitForTimeout(1500); return true; }
    }
  } catch (e) { /* ignore */ }
  try {
    const removed = await page.evaluate(() => {
      const w = document.querySelector('.cc-window, [aria-label="cookieconsent"]');
      if (w) { w.remove(); return true; }
      return false;
    });
    if (removed) { log('Cookies banner supprimé du DOM'); await page.waitForTimeout(500); return true; }
  } catch (e) { /* ignore */ }
  return false;
}

/** Réseau : journal des appels Clerk (sign_ins, 2FA) */
function watchAuth(page, sink) {
  page.on('request', (req) => {
    const u = req.url();
    if (u.includes('/_clerk/v1/client/sign_ins')) {
      sink.push({ t: Date.now(), dir: 'REQ', url: u.replace(/https:\/\/higgsfield.ai/, ''), method: req.method(), body: (req.postData() || '').substring(0, 300) });
      log('→ ' + req.method() + ' ' + u.replace('https://higgsfield.ai', '').substring(0, 90));
    }
  });
  page.on('response', async (res) => {
    const u = res.url();
    if (u.includes('/_clerk/v1/client/sign_ins')) {
      let snippet = '';
      try { snippet = (await res.text()).substring(0, 400); } catch (e) { snippet = '(body illisible)'; }
      sink.push({ t: Date.now(), dir: 'RES', status: res.status(), url: u.replace(/https:\/\/higgsfield.ai/, ''), body: snippet });
      log('← ' + res.status() + ' ' + u.replace('https://higgsfield.ai', '').substring(0, 80));
    }
  });
}

/** Snapshot DOM utile : inputs/boutons visibles + texte de la page */
async function domInfo(page) {
  return page.evaluate(() => {
    const inputs = [...document.querySelectorAll('input')].map(i => ({ type: i.type, name: i.name, id: i.id, placeholder: i.placeholder, visible: i.offsetParent !== null }));
    const buttons = [...document.querySelectorAll('button')].filter(b => b.offsetParent !== null).map(b => (b.textContent || '').trim().substring(0, 45)).filter(Boolean);
    const headings = [...document.querySelectorAll('h1,h2,h3')].filter(h => h.offsetParent !== null).map(h => h.textContent.trim().substring(0, 80)).filter(Boolean);
    return { url: location.href, title: document.title, inputs, buttons: buttons.slice(0, 25), headings: headings.slice(0, 12), bodySnippet: document.body.innerText.replace(/\s+/g, ' ').substring(0, 600) };
  });
}

module.exports = { launch, dismissCookies, watchAuth, domInfo, log, OUT, EMAIL, PASSWORD, PROFILE_DIR, COOKIES_FILE };
