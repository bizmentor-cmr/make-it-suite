/**
 * GEN-RUN — Tentative de GÉNÉRATION RÉELLE avec un modèle donné (compte Free Plan).
 * Usage : node gen-run.js <image|video> "<nom exact du modèle>" "<prompt>"
 * Détection robuste : paywall / crédits insuffisants / vraie génération (média NOUVEAU).
 */
const { launch, dismissCookies, log, OUT } = require('./hf-common');
const fs = require('fs');

const TOOL = process.argv[2] || 'image';
const MODEL_MATCH = process.argv[3] || 'Higgsfield Soul 2.0';
const PROMPT = process.argv[4] || 'A majestic golden eagle soaring over snowy mountains at sunrise, cinematic lighting, ultra detailed';

const ROOT = '/home/z/my-project';
const STATUS_FILE = `${ROOT}/.hf-phase9-status.json`;
let LAST_STATUS = { status: 'INIT' };
const writeStatus = (s, extra = {}) => {
  LAST_STATUS = { status: s, ...extra };
  fs.writeFileSync(STATUS_FILE, JSON.stringify({ ...LAST_STATUS, t: new Date().toISOString() }, null, 2));
};
const beat = (extra = {}) => fs.writeFileSync(STATUS_FILE, JSON.stringify({ ...LAST_STATUS, ...extra, t: new Date().toISOString() }, null, 2));
const LOG_FILE = `${ROOT}/.hf-mega.log`;
const slog = (m) => { const line = `[${new Date().toISOString().substring(11, 19)}] ${m}`; try { fs.appendFileSync(LOG_FILE, line + '\n'); } catch (e) { } console.log(line); };
process.on('unhandledRejection', (r) => slog('⚠️ unhandledRejection: ' + (r && r.message ? r.message : String(r)).substring(0, 200)));

const URLS = { image: 'https://higgsfield.ai/ai/image', video: 'https://higgsfield.ai/ai/video' };
const MAX_MS = TOOL === 'video' ? 10 * 60 * 1000 : 6 * 60 * 1000;
const JUNK = /folder-brand|video-banner|feed\/step|avatar|placeholder|logo|empty|onboarding|default/i;

// Réseau : tout ce qui ressemble à un appel d'API métier
function watchNet(page, sink) {
  page.on('request', (req) => {
    if (['xhr', 'fetch'].includes(req.resourceType())) {
      const u = req.url();
      if (/clerk|posthog|datadome|google|cloudflare|sentry|analytics|secapi|securiti/i.test(u)) return;
      const body = req.postData() || '';
      if (req.method() === 'POST' || /generate|job|_serverFn|asset|creation/i.test(u)) {
        sink.push({ t: Date.now(), dir: 'REQ', m: req.method(), url: u.substring(0, 220), body: body.substring(0, 800) });
      }
    }
  });
  page.on('response', async (res) => {
    const u = res.url();
    if (/clerk|posthog|datadome|google|cloudflare|sentry|analytics|secapi|securiti/i.test(u)) return;
    if (['xhr', 'fetch'].includes(res.request().resourceType())) {
      if (/generate|job|_serverFn|asset|creation/i.test(u) || (res.request().method() === 'POST' && res.status() >= 400)) {
        let body = '';
        try { body = (await res.text()).substring(0, 800); } catch (e) { }
        sink.push({ t: Date.now(), dir: 'RES', s: res.status(), url: u.substring(0, 220), body });
      }
    }
  });
}

async function closePopups(page) {
  for (let i = 0; i < 4; i++) {
    let closed = false;
    const x = page.locator('button[aria-label*="lose" i], button[aria-label*="ismiss" i]').first();
    if ((await x.count()) > 0) { try { await x.click({ timeout: 2000 }); await page.waitForTimeout(1200); closed = true; } catch (e) { } }
    const skip = page.locator('button:visible', { hasText: /^(skip|got it|close|later|not now|maybe later|no thanks)$/i }).first();
    if ((await skip.count()) > 0) { try { await skip.click({ timeout: 2000 }); await page.waitForTimeout(1200); closed = true; } catch (e) { } }
    if (!closed) { await page.keyboard.press('Escape').catch(() => { }); break; }
    await page.waitForTimeout(600);
  }
}

/** Solde de crédits : menu profil (fiable depuis /generate) puis page /me/settings en secours */
async function getBalance(page) {
  try {
    const profBtn = page.locator('button:has-text("holographictomato2094"), a:has-text("holographictomato2094")').first();
    if ((await profBtn.count()) > 0) {
      await profBtn.click({ timeout: 4000 });
      await page.waitForTimeout(2200);
      await page.screenshot({ path: `${OUT}/p9-balance-debug.png` }).catch(() => { });
      const b = await page.evaluate(() => {
        const m = document.body.innerText.match(/(\d[\d,\.]*)\s*credits?/i);
        return m ? m[1] : null;
      });
      await page.keyboard.press('Escape').catch(() => { });
      await page.waitForTimeout(600);
      if (b) return b;
    }
    // secours : page settings
    await page.goto('https://higgsfield.ai/me/settings', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);
    const t = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
    const m = t.match(/(\d[\d,\.]*)\s*credits?/i);
    return m ? m[1] : null;
  } catch (e) { return null; }
}

(async () => {
  let browser = null, page = null;
  const result = { tool: TOOL, model: MODEL_MATCH, prompt: PROMPT, success: false };
  const NET = [];
  writeStatus('GENRUN_START', { tool: TOOL, model: MODEL_MATCH });
  try {
    ({ browser, page } = await launch());
    watchNet(page, NET);
    await page.route('**/*', (route) => {
      const t = route.request().resourceType();
      if (t === 'font') return route.abort();
      return route.continue();
    }).catch(e => slog('route: ' + e.message));

    // ── Session + solde avant
    await page.goto('https://higgsfield.ai/generate', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(7000);
    await dismissCookies(page);
    if (/\/auth|\/login/.test(page.url())) throw new Error('session expirée');
    result.balanceBefore = await getBalance(page);
    slog(`session OK — solde avant: ${result.balanceBefore}`);

    // ── Outil
    await page.goto(URLS[TOOL], { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(9000);
    await dismissCookies(page);
    await closePopups(page);
    await page.screenshot({ path: `${OUT}/p9-genrun-${TOOL}-01.png` });

    // ── Sélection du modèle (texte EXACT, élément le plus profond, vérification barre)
    let modelSelected = false;
    for (let attempt = 1; attempt <= 2 && !modelSelected; attempt++) {
      const modelBtn = page.locator('button:visible', { hasText: /model|gpt image|seedance|soul|nano|seedream|cinema|genjutsu/i }).first();
      if ((await modelBtn.count()) === 0) { slog('bouton modèle introuvable'); break; }
      await modelBtn.click({ timeout: 6000 }).catch((e) => slog('clic modèle: ' + e.message.substring(0, 60)));
      await page.waitForTimeout(2200);
      await page.screenshot({ path: `${OUT}/p9-genrun-${TOOL}-02-dropdown.png` });
      // clic DOM sur l'élément au texte EXACT (nom du modèle), le plus profond
      const clicked = await page.evaluate((name) => {
        const vis = (el) => el.offsetParent !== null || el.getClientRects().length > 0;
        const matches = [...document.querySelectorAll('button, [role="option"], [role="menuitem"], div, span, li, a')]
          .filter(el => (el.textContent || '').trim() === name && vis(el));
        if (!matches.length) return false;
        matches.sort((a, b) => a.querySelectorAll('*').length - b.querySelectorAll('*').length);
        matches[0].click();
        return true;
      }, MODEL_MATCH).catch(() => false);
      slog(`clic option « ${MODEL_MATCH} » (tentative ${attempt}): ${clicked}`);
      await page.waitForTimeout(2800);
      const bar = await page.evaluate(() => {
        const vis = (el) => el.offsetParent !== null;
        return [...document.querySelectorAll('button')].filter(vis).map(b => (b.textContent || '').trim().replace(/\s+/g, ' ').substring(0, 40)).filter(Boolean).slice(0, 18);
      });
      result.barText = bar;
      result.urlAfterModel = page.url();
      const short = MODEL_MATCH.split(' ').slice(0, 2).join(' ').toLowerCase();
      modelSelected = bar.some(b => b.toLowerCase().includes(short));
      slog('barre: ' + JSON.stringify(bar) + ' → modèle actif: ' + modelSelected);
      await page.screenshot({ path: `${OUT}/p9-genrun-${TOOL}-03-model-selected.png` });
      if (!modelSelected) { await page.keyboard.press('Escape').catch(() => { }); await page.waitForTimeout(1000); }
    }
    result.modelSelected = modelSelected;

    // ── Prompt
    const ce = page.locator('[contenteditable="true"]:visible').first();
    if ((await ce.count()) > 0) {
      await ce.click({ timeout: 8000 });
      await page.keyboard.type(PROMPT, { delay: 10 });
    } else {
      const ta = page.locator('textarea:visible').first();
      await ta.click({ timeout: 8000 });
      await ta.fill(PROMPT);
    }
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/p9-genrun-${TOOL}-04-prompt.png` });

    // ── Snapshot médias AVANT
    const beforeSrcs = new Set(await page.evaluate(() => [
      ...[...document.querySelectorAll('img')].map(i => i.currentSrc || i.src),
      ...[...document.querySelectorAll('video')].map(v => v.currentSrc || v.src),
    ]));

    // ── GENERATE
    const gen = page.locator('button:visible', { hasText: /generate/i }).last();
    if ((await gen.count()) === 0) throw new Error('bouton Generate introuvable');
    const genLabel = ((await gen.textContent()) || '').trim().replace(/\s+/g, ' ');
    result.genButton = genLabel;
    slog(`🚀 clic Generate (« ${genLabel} ») — chrono démarré`);
    await gen.click({ timeout: 8000 });
    const T0 = Date.now();
    writeStatus('GENRUN_MONITOR', { tool: TOOL, model: MODEL_MATCH, genButton: genLabel });

    // ── Surveillance
    let finalState = null;
    while (Date.now() - T0 < MAX_MS) {
      await page.waitForTimeout(5000);
      const dt = Math.round((Date.now() - T0) / 1000);
      const st = await page.evaluate(() => {
        const vis = (el) => el.offsetParent !== null || el.getClientRects().length > 0;
        const imgs = [...document.querySelectorAll('img')].filter(vis).filter(i => i.naturalWidth > 300).map(i => ({ src: (i.currentSrc || i.src).substring(0, 200), w: i.naturalWidth, h: i.naturalHeight }));
        const videos = [...document.querySelectorAll('video')].filter(vis).map(v => ({ src: (v.currentSrc || v.src || '').substring(0, 200), dur: v.duration, w: v.videoWidth, h: v.videoHeight }));
        const bt = document.body.innerText.replace(/\s+/g, ' ');
        const paywall = /UNLOCK [A-Z0-9. ]+|UPGRADE REQUIRED|upgrade to (?:a )?(?:starter|plus|ultra)/i.test(bt);
        const noCredits = /not enough|insufficient|out of credits|no credits/i.test(bt);
        const pb = [...document.querySelectorAll('[role="progressbar"], [aria-valuenow]')].filter(vis).map(p => p.getAttribute('aria-valuenow')).filter(Boolean);
        const genWord = /generating|in progress|in queue|queued|processing/i.test(bt);
        const errs = (bt.match(/[^.]{0,40}(?:error|failed)[^.]{0,60}/i) || []).slice(0, 3);
        return { imgs, videos, paywall, noCredits, progressAria: pb, genWord, errs, url: location.href };
      }).catch(() => null);
      if (!st) continue;
      finalState = st;
      beat({ elapsedSec: dt, paywall: st.paywall || undefined, noCredits: st.noCredits || undefined });

      if (st.paywall) {
        result.outcome = 'PAYWALL';
        result.success = false;
        slog(`🧱 PAYWALL détecté à ${dt}s`);
        await page.screenshot({ path: `${OUT}/p9-genrun-${TOOL}-05-paywall.png` });
        break;
      }
      if (st.noCredits) {
        result.outcome = 'NO_CREDITS';
        result.success = false;
        result.error = (st.errs[0] || 'crédits insuffisants');
        slog(`💸 CRÉDITS INSUFFISANTS à ${dt}s`);
        await page.screenshot({ path: `${OUT}/p9-genrun-${TOOL}-05-nocredits.png` });
        break;
      }
      const newImg = st.imgs.find(i => !beforeSrcs.has(i.src) && !JUNK.test(i.src));
      const newVid = st.videos.find(v => !beforeSrcs.has(v.src) && !JUNK.test(v.src) && v.dur > 0);
      if (newVid) {
        result.outcome = 'GENERATED'; result.success = true; result.elapsedSec = dt; result.output = newVid;
        slog(`✅ VIDÉO générée en ${dt}s: ${JSON.stringify(newVid).substring(0, 140)}`);
        await page.screenshot({ path: `${OUT}/p9-genrun-${TOOL}-05-result.png` });
        break;
      }
      if (TOOL !== 'video' && newImg) {
        result.outcome = 'GENERATED'; result.success = true; result.elapsedSec = dt; result.output = newImg;
        slog(`✅ IMAGE générée en ${dt}s: ${JSON.stringify(newImg).substring(0, 140)}`);
        await page.screenshot({ path: `${OUT}/p9-genrun-${TOOL}-05-result.png` });
        break;
      }
      if (dt % 30 < 6) slog(`${dt}s… progress=${JSON.stringify(st.progressAria)} genWord=${st.genWord} imgs=${st.imgs.length} (+new:${st.imgs.filter(i => !beforeSrcs.has(i.src)).length})`);
    }
    if (!result.outcome) { result.outcome = 'TIMEOUT'; result.success = false; }
    await page.screenshot({ path: `${OUT}/p9-genrun-${TOOL}-06-final.png` });

    // ── Solde après + My generations
    result.balanceAfter = await getBalance(page);
    await page.goto('https://higgsfield.ai/my-generations', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => { });
    await page.waitForTimeout(6000);
    await dismissCookies(page);
    await page.screenshot({ path: `${OUT}/p9-genrun-${TOOL}-07-my-generations.png` });
    result.myGenText = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').substring(0, 400));
    result.finalState = finalState;
    result.net = NET.slice(-120);
    fs.writeFileSync(`${OUT}/p9-genrun-${TOOL}.json`, JSON.stringify(result, null, 2));
    slog(`RÉSULTAT ${TOOL}: ${result.outcome} ${result.success ? result.elapsedSec + 's' : ''} — solde ${result.balanceBefore} → ${result.balanceAfter}`);
    writeStatus(result.success ? 'GENRUN_SUCCESS' : (result.outcome === 'PAYWALL' ? 'GENRUN_PAYWALL' : 'GENRUN_FAIL'), { tool: TOOL, outcome: result.outcome, elapsedSec: result.elapsedSec, balance: result.balanceAfter });
  } catch (e) {
    slog('ERREUR: ' + e.message);
    writeStatus('GENRUN_FAILED', { error: e.message });
    fs.writeFileSync(`${OUT}/p9-genrun-${TOOL}.json`, JSON.stringify({ ...result, error: e.message }, null, 2));
  }
  if (browser) await browser.close();
  slog(`gen-run ${TOOL} terminé (process)`);
})();
