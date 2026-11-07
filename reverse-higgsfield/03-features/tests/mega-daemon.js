/**
 * MEGA-DAEMON Phase 9 — Login compte réel + TOUS les tests features en UNE session
 * (le navigateur reste ouvert : les cookies de session Clerk meurent à la fermeture)
 *
 * A. LOGIN : email → password → écran 2FA → WAITING_FOR_CODE (code fichier)
 *    → saisie → si expiré : Resend + réattente (3 cycles max)
 * B. DASHBOARD : crédits, plan, navigation
 * C. TESTS : audits UI (image/video/effects/cinema/layers/canvas) +
 *    génération IMAGE réelle chronométrée + génération VIDÉO si crédits
 * Status : .hf-phase9-status.json (RUNNING, WAITING_FOR_CODE, DONE_ALL, FAILED)
 */
const { launch, dismissCookies, OUT, EMAIL, PASSWORD } = require('./hf-common');
const fs = require('fs');

const ROOT = '/home/z/my-project';
const CODE_FILE = `${ROOT}/.hf-phase9-code.txt`;
const RESEND_FILE = `${ROOT}/.hf-phase9-resend.txt`;
const COOKIES_FILE = `${ROOT}/.hf-cookies.json`;
const STATUS_FILE = `${ROOT}/.hf-phase9-status.json`;
let LAST_STATUS = { status: 'INIT' };
const writeStatus = (s, extra = {}) => {
  LAST_STATUS = { status: s, ...extra };
  fs.writeFileSync(STATUS_FILE, JSON.stringify({ ...LAST_STATUS, t: new Date().toISOString() }, null, 2));
};
/** Heartbeat : rafraîchit l'horodatage du statut courant sans changer de phase (l'UI affiche « en ligne ») */
const beat = (extra = {}) => fs.writeFileSync(STATUS_FILE, JSON.stringify({ ...LAST_STATUS, ...extra, t: new Date().toISOString() }, null, 2));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Log durable (appendFileSync) — survit à un SIGKILL là où stdout serait perdu
const LOG_FILE = `${ROOT}/.hf-mega.log`;
const log = (m) => { const line = `[${new Date().toISOString().substring(11, 19)}] ${m}`; try { fs.appendFileSync(LOG_FILE, line + '\n'); } catch (e) { } console.log(line); };
process.on('unhandledRejection', (r) => log('⚠️ unhandledRejection: ' + (r && r.message ? r.message : String(r)).substring(0, 200)));

// Heartbeat global (toutes les 5 s) : l'UI web sait en permanence que le robot vit
const HB = setInterval(() => { try { beat(); } catch (e) { } }, 5000);
HB.unref();

// ── Blocage de ressources lourdes (machine limitée à 4 Go, dev server ~1,6 Go) ──
const BLOCK = { img: true, media: true, font: true };
async function installBlocking(page) {
  try {
    await page.route('**/*', (route) => {
      const t = route.request().resourceType();
      if (t === 'font') return route.abort();
      if (BLOCK.media && t === 'media') return route.abort();
      if (BLOCK.img && t === 'image') return route.abort();
      return route.continue();
    });
  } catch (e) { log('route: ' + e.message); }
}

// ───────────────────────── utilitaires tests ─────────────────────────
let NET = [];
function watchNet(page) {
  page.on('request', (req) => {
    if (['xhr', 'fetch'].includes(req.resourceType())) {
      const u = req.url();
      if (/clerk|posthog|datadome|google|cloudflare|sentry|analytics/.test(u)) return;
      NET.push({ t: Date.now(), dir: 'REQ', m: req.method(), url: u.substring(0, 200), body: (req.postData() || '').substring(0, 600) });
    }
  });
  page.on('response', async (res) => {
    const u = res.url();
    if (/clerk|posthog|datadome|google|cloudflare|sentry|analytics/.test(u)) return;
    if (['xhr', 'fetch'].includes(res.request().resourceType())) {
      let body = '';
      try { body = (await res.text()).substring(0, 700); } catch (e) { }
      NET.push({ t: Date.now(), dir: 'RES', s: res.status(), url: u.substring(0, 200), body });
    }
  });
}

const getCredits = (page) => page.evaluate(() => {
  const m = document.body.innerText.match(/(\d[\d,\.]*)\s*(?:\/\s*(\d[\d,\.]*))?\s*credits?/i);
  return m ? (m[2] ? `${m[1]}/${m[2]}` : m[1]) : null;
}).catch(() => null);

async function toolInfo(page) {
  return page.evaluate(() => {
    const vis = (el) => el.offsetParent !== null;
    const textareas = [...document.querySelectorAll('textarea')].filter(vis).map(t => ({ ph: (t.placeholder || '').substring(0, 90), ce: false }));
    const editables = [...document.querySelectorAll('[contenteditable="true"]')].filter(vis).map(t => ({ ph: (t.getAttribute('data-placeholder') || '').substring(0, 90), ce: true }));
    const selects = [...document.querySelectorAll('select')].filter(vis).map(s => ({ name: s.name || s.id, options: [...s.options].map(o => o.textContent.trim()).slice(0, 25) }));
    const radios = [...document.querySelectorAll('input[type="radio"]')].filter(vis).slice(0, 30).map(i => ({ name: i.name, value: i.value, checked: i.checked }));
    const tabs = [...document.querySelectorAll('[role="tab"]')].filter(vis).map(t => t.textContent.trim().substring(0, 40)).slice(0, 20);
    const costs = [...document.body.innerText.matchAll(/(\d[\d,\.]*)\s*(?:credits?|cr\.?)/gi)].map(m => m[0]).slice(0, 25);
    const btns = [...document.querySelectorAll('button')].filter(vis).map(b => ({ t: (b.textContent || '').trim().substring(0, 45), d: b.disabled })).filter(b => b.t).slice(0, 50);
    const headings = [...document.querySelectorAll('h1,h2,h3')].filter(vis).map(h => h.textContent.trim().substring(0, 70)).filter(Boolean).slice(0, 12);
    return { url: location.href, headings, prompts: [...editables, ...textareas], selects, radios, tabs, costs, btns, bodyText: document.body.innerText.replace(/\s+/g, ' ').substring(0, 1800) };
  });
}

async function closeModals(page) {
  for (let i = 0; i < 6; i++) {
    const b = page.locator('button:visible', { hasText: /^(skip|got it|close|later|start creating|continue|next|start)$/i }).first();
    if ((await b.count()) === 0) break;
    try { await b.click({ timeout: 2500 }); await page.waitForTimeout(1800); } catch (e) { break; }
  }
}

// ───────────────────────── A. LOGIN ─────────────────────────
async function doLogin(page) {
  writeStatus('GOTO_LOGIN');
  await page.goto('https://higgsfield.ai/auth/sign-in', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(9000);
  await dismissCookies(page);
  const em = page.locator('input[name="email"]:visible').last();
  if ((await em.count()) === 0) throw new Error('champ email introuvable');
  await em.click({ timeout: 10000 });
  await em.pressSequentially(EMAIL, { delay: 25 });
  await page.waitForTimeout(800);
  const cont = page.locator('button:text-is("Continue"):visible').last();
  if ((await cont.count()) > 0) await cont.click({ timeout: 10000 }); else await em.press('Enter');
  await page.waitForTimeout(8000);
  await dismissCookies(page);
  writeStatus('EMAIL_OK');

  const pwd = page.locator('input[type="password"]:visible').last();
  if ((await pwd.count()) === 0) throw new Error('champ password introuvable');
  await pwd.click({ timeout: 10000 }).catch(() => { });
  await pwd.pressSequentially(PASSWORD, { delay: 15 });
  await page.waitForTimeout(600);
  await pwd.press('Enter', { timeout: 5000 }).catch(() => { });
  await page.waitForTimeout(2500);
  if (page.url().includes('/auth/email/sign-in')) {
    const loginBtn = page.locator('button', { hasText: /^Log in$/ }).last();
    try { if ((await loginBtn.count()) > 0) await loginBtn.click({ timeout: 8000 }); } catch (e) { }
  }
  writeStatus('PASSWORD_OK');
  // attendre l'écran 2FA (champ code)
  let codeField = null;
  for (let i = 0; i < 15; i++) {
    await page.waitForTimeout(2000);
    codeField = page.locator('input[name="code"]:visible, input[autocomplete="one-time-code"]:visible').first();
    if ((await codeField.count()) > 0) return codeField;
    if (!/\/auth|\/login/.test(page.url())) return null; // déjà connecté
  }
  return codeField && (await codeField.count()) > 0 ? codeField : null;
}

async function enterCodeAndWait(page, codeField, code) {
  await codeField.click({ timeout: 8000 });
  await codeField.fill('').catch(() => { }); // purge un éventuel ancien code refusé
  await codeField.pressSequentially(code, { delay: 40 });
  await page.waitForTimeout(600);
  await codeField.press('Enter', { timeout: 5000 }).catch(() => { });
  await page.waitForTimeout(5000);
  const vBtn = page.locator('input[type="submit"]:visible, button:text-is("Verify"):visible, button:text-is("Continue"):visible').first();
  if (/\/auth/.test(page.url()) && (await vBtn.count()) > 0) { await vBtn.click({ timeout: 6000 }).catch(() => { }); }
  for (let i = 0; i < 15; i++) {
    await page.waitForTimeout(2000);
    if (!/\/auth|\/login/.test(page.url())) return true;
  }
  return false;
}

// ───────────────────────── C. TESTS ─────────────────────────
async function uiAudit(page, key, url) {
  const t0 = Date.now();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(9000);
  await dismissCookies(page);
  await closeModals(page);
  await page.screenshot({ path: `${OUT}/p9-audit-${key}.png` });
  const info = await toolInfo(page);
  fs.writeFileSync(`${OUT}/p9-audit-${key}.json`, JSON.stringify({ loadMs: Date.now() - t0, ...info }, null, 2));
  log(`[audit ${key}] ${info.url.substring(0, 60)} | coûts: ${JSON.stringify(info.costs.slice(0, 6))} | tabs: ${JSON.stringify(info.tabs.slice(0, 8))}`);
  return info;
}

async function genTest(page, key, url, prompt) {
  const result = { tool: key, prompt, success: false };
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(10000);
  await dismissCookies(page);
  await closeModals(page);
  await page.screenshot({ path: `${OUT}/p9-gen-${key}-01.png` });
  result.creditsBefore = await getCredits(page);
  log(`[gen ${key}] crédits avant: ${result.creditsBefore}`);

  // champ prompt : contenteditable > textarea > input texte
  const cand = await page.evaluate(() => {
    const vis = (el) => el.offsetParent !== null || el.getClientRects().length > 0;
    const cands = [];
    document.querySelectorAll('[contenteditable="true"], textarea, input[type="text"], input:not([type])').forEach(el => {
      if (!vis(el)) return;
      const r = el.getBoundingClientRect();
      const ph = (el.getAttribute('placeholder') || el.getAttribute('data-placeholder') || '').toLowerCase();
      const isPrompt = /prompt|describe|imagine|create|dream/.test(ph) || el.getAttribute('contenteditable') === 'true' || el.tagName === 'TEXTAREA';
      cands.push({ tag: el.tagName, ce: el.getAttribute('contenteditable'), ph: ph.substring(0, 60), w: Math.round(r.width), h: Math.round(r.height), isPrompt });
    });
    return cands.sort((a, b) => (b.isPrompt - a.isPrompt) || (b.w * b.h - a.w * a.h)).slice(0, 6);
  });
  log(`[gen ${key}] candidats prompt: ${JSON.stringify(cand).substring(0, 300)}`);
  if (cand.length === 0) throw new Error('aucun champ prompt');
  const c = cand[0];
  if (c.ce === 'true') {
    const el = page.locator('[contenteditable="true"]:visible').first();
    await el.click({ timeout: 8000 });
    await page.keyboard.type(prompt, { delay: 12 });
  } else if (c.tag === 'TEXTAREA') {
    const el = page.locator('textarea:visible').first();
    await el.click({ timeout: 8000 });
    await el.fill(prompt);
  } else {
    const el = page.locator('input[type="text"]:visible, input:not([type]):visible').first();
    await el.click({ timeout: 8000 });
    await el.fill(prompt);
  }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/p9-gen-${key}-02-prompt.png` });

  // bouton generate
  const gen = page.locator('button:visible', { hasText: /^(generate|create|create image|generate image|create video|generate video)$/i }).last();
  const any = page.locator('button:visible', { hasText: /generat|create/i }).last();
  let clicked = null;
  if ((await gen.count()) > 0) { await gen.click({ timeout: 8000 }); clicked = 'gen'; }
  else if ((await any.count()) > 0) { await any.click({ timeout: 8000 }); clicked = 'any:' + ((await any.textContent()) || '').trim().substring(0, 30); }
  if (!clicked) throw new Error('bouton generate introuvable');
  log(`[gen ${key}] 🚀 lancé (${clicked}) — chrono démarré`);
  result.clickedVia = clicked;
  const T0 = Date.now();

  // surveiller (max 6 min image / 10 min vidéo)
  const MAX = key === 'video' ? 10 * 60 * 1000 : 6 * 60 * 1000;
  let lastState = null;
  while (Date.now() - T0 < MAX) {
    await page.waitForTimeout(5000);
    const st = await page.evaluate(() => {
      const vis = (el) => el.offsetParent !== null;
      const imgs = [...document.querySelectorAll('img')].filter(vis).filter(i => i.naturalWidth > 300).map(i => ({ src: (i.currentSrc || i.src).substring(0, 180), w: i.naturalWidth, h: i.naturalHeight }));
      const videos = [...document.querySelectorAll('video')].filter(vis).map(v => ({ src: (v.currentSrc || v.src || '').substring(0, 180), dur: v.duration, w: v.videoWidth, h: v.videoHeight }));
      const progress = (document.body.innerText.match(/(\d{1,3})\s*%/) || [])[1];
      const errs = (document.body.innerText.match(/[^\n]{0,30}(?:error|failed|not enough|insufficient)[^\n]{0,60}/i) || []).slice(0, 3);
      return { imgs, videos, progress, errs };
    });
    lastState = st;
    const dt = Math.round((Date.now() - T0) / 1000);
    beat({ elapsedSec: dt, progress: st.progress || undefined }); // heartbeat + progression pour l'UI
    if (st.videos.length > 0 && st.videos[0].dur > 0) { result.success = true; result.elapsedSec = dt; result.output = st.videos[0]; break; }
    if (key !== 'video' && st.imgs.length > 0 && st.imgs.some(i => i.w >= 512)) { result.success = true; result.elapsedSec = dt; result.output = st.imgs[st.imgs.length - 1]; break; }
    if (st.errs.length > 0) { result.error = st.errs[0]; log(`[gen ${key}] ⚠️ ${st.errs[0]}`); if (/not enough|insufficient/i.test(st.errs[0] || '')) break; }
    if (dt % 30 < 6) log(`[gen ${key}] ${dt}s… progress=${st.progress || '-'} imgs=${st.imgs.length} vids=${st.videos.length}`);
  }
  await page.screenshot({ path: `${OUT}/p9-gen-${key}-03-result.png` });
  result.creditsAfter = await getCredits(page);
  result.lastState = lastState;
  log(`[gen ${key}] ${result.success ? '✅ ' + result.elapsedSec + 's' : '❌ ' + (result.error || 'timeout')} — crédits: ${result.creditsBefore} → ${result.creditsAfter}`);
  fs.writeFileSync(`${OUT}/p9-gen-${key}-summary.json`, JSON.stringify(result, null, 2));
  return result;
}

// ───────────────────────── MAIN ─────────────────────────
(async () => {
  let browser = null, page = null;
  // purge d'un éventuel code/renvoi obsolète d'un run précédent
  try { fs.unlinkSync(CODE_FILE); } catch (e) { }
  try { fs.unlinkSync(RESEND_FILE); } catch (e) { }
  writeStatus('LOGIN_START');
  try {
    ({ browser, page } = await launch());
    watchNet(page);
    await installBlocking(page); // économie mémoire : images/vidéos/fonts bloquées pendant le login

    // ── A. LOGIN
    const codeField = await doLogin(page);
    if (codeField === null && !/\/auth|\/login/.test(page.url())) {
      log('déjà connecté !');
    } else if (codeField) {
      log('écran 2FA atteint — code envoyé par email');
      writeStatus('WAITING_FOR_CODE');
      let authed = false;
      for (let cycle = 1; cycle <= 3 && !authed; cycle++) {
        // attendre le code dans le fichier (jusqu'à 25 min)
        let code = null;
        const deadline = Date.now() + 25 * 60 * 1000;
        while (Date.now() < deadline) {
          await page.waitForTimeout(2000);
          beat({ heartbeat: true }); // l'UI web sait que le robot est vivant
          // demande de renvoi envoyée depuis l'interface web
          try {
            if (fs.existsSync(RESEND_FILE)) {
              fs.unlinkSync(RESEND_FILE);
              log("renvoi demandé via l'UI — clic Resend");
              const rb = page.locator('button:visible', { hasText: /resend|send again/i }).first();
              if ((await rb.count()) > 0 && (await rb.isEnabled().catch(() => false))) {
                await rb.click({ timeout: 5000 }).catch(() => { });
                await page.waitForTimeout(3000);
                writeStatus('WAITING_FOR_CODE', { note: 'Nouveau code renvoyé à ' + new Date().toISOString().substring(11, 19) + ' — saisis le nouveau code', cycle });
              } else {
                writeStatus('WAITING_FOR_CODE', { note: 'Resend indisponible (compte à rebours en cours) — retente dans ~1 min', cycle });
              }
            }
          } catch (e) { }
          try {
            const c = (fs.readFileSync(CODE_FILE, 'utf8') || '').trim();
            if (/^\d{6}$/.test(c)) { code = c; fs.writeFileSync(CODE_FILE, ''); break; }
          } catch (e) { }
        }
        if (!code) throw new Error('timeout attente code (25 min)');
        log(`code reçu (cycle ${cycle}): ${code}`);
        writeStatus('SUBMITTING_CODE');
        authed = await enterCodeAndWait(page, codeField, code);
        if (!authed) {
          // code expiré/incorrect ? cliquer Resend et réattendre
          const errTxt = await page.evaluate(() => {
            const m = document.body.innerText.match(/[^\n]{0,30}(expired|incorrect|invalid|wrong)[^\n]{0,50}/i);
            return m ? m[0] : null;
          }).catch(() => null);
          log(`code refusé (${errTxt || 'raison inconnue'}) — Resend + réattente`);
          writeStatus('WAITING_FOR_CODE', { note: 'Code refusé — un nouveau code a été renvoyé, saisis le nouveau code reçu', cycle });
          const resend = page.locator('button:visible', { hasText: /resend|send again/i }).first();
          if ((await resend.count()) > 0) { await resend.click({ timeout: 5000 }).catch(() => { }); await page.waitForTimeout(4000); }
        }
      }
      if (!authed) throw new Error('non authentifié après 3 cycles de code');
    } else {
      throw new Error('écran 2FA non atteint — url=' + page.url());
    }
    log('🎉 SESSION AUTHENTIFIÉE');
    writeStatus('LOGGED_IN');
    // Sauvegarde des cookies (y compris cookies de session Clerk) pour les scripts futurs
    try {
      const cookies = await browser.cookies('https://higgsfield.ai');
      fs.writeFileSync(COOKIES_FILE, JSON.stringify(cookies, null, 2));
      log(`cookies sauvegardés (${cookies.length}) → ${COOKIES_FILE}`);
    } catch (e) { log('save cookies: ' + e.message); }

    // ── B. DASHBOARD
    await page.goto('https://higgsfield.ai/generate', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(10000);
    await dismissCookies(page);
    await closeModals(page);
    await page.screenshot({ path: `${OUT}/p9-dash-01.png` });
    const dash = await page.evaluate(() => {
      const credits = (document.body.innerText.match(/(\d[\d,\.]*)\s*(?:\/\s*\d[\d,\.]*)?\s*credits?/i) || [])[0] || null;
      const nav = [...document.querySelectorAll('nav a, aside a')].map(a => ({ t: (a.textContent || '').trim().substring(0, 32), h: (a.getAttribute('href') || '').substring(0, 60) })).filter(l => l.t && l.h).slice(0, 45);
      return { url: location.href, credits, nav, bodyText: document.body.innerText.replace(/\s+/g, ' ').substring(0, 1500) };
    });
    fs.writeFileSync(`${OUT}/p9-dash-state.json`, JSON.stringify(dash, null, 2));
    log('CRÉDITS: ' + dash.credits + ' | NAV: ' + dash.nav.length + ' liens');
    writeStatus('DASHBOARD_DONE', { credits: dash.credits });

    // ── C1. AUDITS UI (sans génération)
    BLOCK.img = false; // miniatures visibles pour les captures, vidéos restent bloquées (mémoire)
    const audits = {};
    const auditTools = [
      ['image', 'https://higgsfield.ai/ai/image'],
      ['video', 'https://higgsfield.ai/ai/video'],
      ['cinema', 'https://higgsfield.ai/generate'],
      ['effects', 'https://higgsfield.ai/effects/use'],
      ['layers', 'https://higgsfield.ai/layers'],
      ['canvas', 'https://higgsfield.ai/canvas'],
    ];
    for (const [k, u] of auditTools) {
      try { audits[k] = await uiAudit(page, k, u); } catch (e) { log(`[audit ${k}] ERREUR: ${e.message}`); audits[k] = { error: e.message }; }
      writeStatus('AUDITS', { done: Object.keys(audits).join(',') });
    }
    fs.writeFileSync(`${OUT}/p9-audits-all.json`, JSON.stringify(Object.fromEntries(Object.entries(audits).map(([k, v]) => [k, { url: v.url, costs: v.costs, tabs: v.tabs, headings: v.headings, prompts: v.prompts, selects: v.selects ? v.selects.map(s => ({ name: s.name, n: s.options.length })) : [] }])), null, 2));

    // ── C2. GÉNÉRATION IMAGE réelle
    BLOCK.media = false; // la détection d'output a besoin des médias chargés
    writeStatus('GEN_IMAGE');
    try {
      await genTest(page, 'image', 'https://higgsfield.ai/ai/image', 'A majestic golden eagle soaring over snowy mountains at sunrise, cinematic lighting, ultra detailed, 4k');
    } catch (e) { log('[gen image] ERREUR: ' + e.message); fs.writeFileSync(`${OUT}/p9-gen-image-summary.json`, JSON.stringify({ error: e.message }, null, 2)); }

    // ── C3. GÉNÉRATION VIDÉO réelle (si crédits suffisants)
    writeStatus('GEN_VIDEO');
    try {
      await genTest(page, 'video', 'https://higgsfield.ai/ai/video', 'Slow cinematic drone shot over a foggy pine forest at dawn, golden light rays through mist');
    } catch (e) { log('[gen video] ERREUR: ' + e.message); fs.writeFileSync(`${OUT}/p9-gen-video-summary.json`, JSON.stringify({ error: e.message }, null, 2)); }

    // ── dump réseau global
    fs.writeFileSync(`${OUT}/p9-net-all.json`, JSON.stringify(NET.slice(-400), null, 2));
    log('réseau capturé: ' + NET.length + ' req');
    writeStatus('DONE_ALL', { credits: dash.credits });
  } catch (e) {
    log('ERREUR: ' + e.message);
    writeStatus('FAILED', { error: e.message });
    if (page) await page.screenshot({ path: `${OUT}/p9-mega-error.png` }).catch(() => { });
  }
  if (browser) await browser.close();
  log('mega-daemon terminé');
})();
