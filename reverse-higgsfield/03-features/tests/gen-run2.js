/**
 * GEN-RUN2 — Génération réelle Soul 2.0, 2e itération (commit du prompt vérifié).
 * Améliorations : URL directe ?model=soul-v2, prompt saisi UNE fois + vérifié caractère par caractère,
 * blur (Tab) avant Generate, détection immédiate du POST réseau, retry Enter+Generate à 25 s si silence.
 */
const { launch, dismissCookies, OUT } = require('./hf-common');
const fs = require('fs');

const PROMPT = 'A majestic golden eagle soaring over snowy mountains at sunrise, golden light, ultra detailed';
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

const JUNK = /folder-brand|video-banner|feed\/step|avatar|placeholder|logo|empty|onboarding|default/i;

(async () => {
  let browser = null, page = null;
  const result = { tool: 'image', model: 'soul-v2', prompt: PROMPT, success: false };
  const NET = [];
  writeStatus('GENRUN2_START');
  try {
    ({ browser, page } = await launch());
    // Réseau : POST détecté immédiatement
    page.on('request', (req) => {
      if (req.method() === 'POST' && ['xhr', 'fetch'].includes(req.resourceType())) {
        const u = req.url();
        if (/clerk|posthog|datadome|sentry|analytics|secapi/i.test(u)) return;
        NET.push({ t: Date.now(), url: u.substring(0, 220), body: (req.postData() || '').substring(0, 600) });
        slog('📡 POST: ' + u.substring(60, 160));
        result.postFired = (result.postFired || 0) + 1;
      }
    });
    page.on('response', async (res) => {
      if (res.request().method() === 'POST' && ['xhr', 'fetch'].includes(res.request().resourceType())) {
        const u = res.url();
        if (/clerk|posthog|datadome|sentry|analytics|secapi/i.test(u)) return;
        let body = '';
        try { body = (await res.text()).substring(0, 600); } catch (e) { }
        NET.push({ t: Date.now(), res: res.status(), url: u.substring(0, 220), body });
        slog('📡 ← ' + res.status() + ' ' + u.substring(60, 140));
      }
    });
    await page.route('**/*', (route) => {
      const t = route.request().resourceType();
      if (t === 'font') return route.abort();
      return route.continue();
    }).catch(e => slog('route: ' + e.message));

    // ── Page directe soul-v2
    await page.goto('https://higgsfield.ai/ai/image?model=soul-v2', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(9000);
    await dismissCookies(page);
    // fermer popups (offre -55%, onboarding)
    for (let i = 0; i < 4; i++) {
      let closed = false;
      const x = page.locator('button[aria-label*="lose" i], button[aria-label*="ismiss" i]').first();
      if ((await x.count()) > 0) { try { await x.click({ timeout: 2000 }); await page.waitForTimeout(1000); closed = true; } catch (e) { } }
      const skip = page.locator('button:visible', { hasText: /^(skip|got it|close|later|not now)$/i }).first();
      if ((await skip.count()) > 0) { try { await skip.click({ timeout: 2000 }); await page.waitForTimeout(1000); closed = true; } catch (e) { } }
      if (!closed) break;
    }
    await page.screenshot({ path: `${OUT}/p9-genrun2-01.png` });
    const bar = await page.evaluate(() => {
      const vis = (el) => el.offsetParent !== null;
      return [...document.querySelectorAll('button')].filter(vis).map(b => (b.textContent || '').trim().replace(/\s+/g, ' ').substring(0, 40)).filter(Boolean).slice(0, 18);
    });
    result.barText = bar;
    slog('barre: ' + JSON.stringify(bar));

    // ── Prompt : saisie UNE fois, vérifiée
    const ce = page.locator('[contenteditable="true"]:visible').first();
    if ((await ce.count()) === 0) throw new Error('champ prompt introuvable');
    let fieldOk = false;
    for (let i = 1; i <= 3 && !fieldOk; i++) {
      await ce.click({ timeout: 8000 });
      await page.keyboard.press('Control+a').catch(() => { });
      await page.keyboard.press('Delete').catch(() => { });
      await page.waitForTimeout(300);
      await page.keyboard.type(PROMPT, { delay: 18 });
      await page.waitForTimeout(500);
      const txt = await page.evaluate(() => {
        const els = [...document.querySelectorAll('[contenteditable="true"]')].filter(e => e.offsetParent !== null);
        return els.length ? els.map(e => (e.textContent || '').trim()).join(' | ') : null;
      });
      slog(`tentative ${i} — champ: « ${(txt || '').substring(0, 90)}… »`);
      fieldOk = (txt || '').startsWith(PROMPT.substring(0, 30)) && (txt || '').length < PROMPT.length + 15;
    }
    result.promptFieldOk = fieldOk;
    if (!fieldOk) slog('⚠️ champ prompt non conforme — on tente quand même');
    await page.keyboard.press('Tab'); // blur → commit de l'état applicatif
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/p9-genrun2-02-prompt.png` });

    // ── Snapshot avant
    const beforeSrcs = new Set(await page.evaluate(() => [
      ...[...document.querySelectorAll('img')].map(i => i.currentSrc || i.src),
      ...[...document.querySelectorAll('video')].map(v => v.currentSrc || v.src),
    ]));
    const beforeHtml = await page.evaluate(() => document.body.innerText.substring(0, 400));

    // ── GENERATE
    const gen = page.locator('button:visible', { hasText: /generate/i }).last();
    const genLabel = ((await gen.textContent()) || '').trim().replace(/\s+/g, ' ');
    result.genButton = genLabel;
    await gen.click({ timeout: 8000 });
    slog(`🚀 clic Generate (« ${genLabel} »)`);
    const T0 = Date.now();
    writeStatus('GENRUN2_MONITOR', { genButton: genLabel });

    // ── Surveillance (6 min)
    let finalState = null, retried = false;
    while (Date.now() - T0 < 6 * 60 * 1000) {
      await page.waitForTimeout(5000);
      const dt = Math.round((Date.now() - T0) / 1000);
      const st = await page.evaluate(() => {
        const vis = (el) => el.offsetParent !== null || el.getClientRects().length > 0;
        const imgs = [...document.querySelectorAll('img')].filter(vis).filter(i => i.naturalWidth > 300).map(i => ({ src: (i.currentSrc || i.src).substring(0, 200), w: i.naturalWidth, h: i.naturalHeight }));
        const videos = [...document.querySelectorAll('video')].filter(vis).map(v => ({ src: (v.currentSrc || v.src || '').substring(0, 200), dur: v.duration, w: v.videoWidth, h: v.videoHeight }));
        const bt = document.body.innerText.replace(/\s+/g, ' ');
        const paywall = /UNLOCK [A-Z0-9. ]+|UPGRADE REQUIRED/i.test(bt);
        const noCredits = /not enough|insufficient|out of credits/i.test(bt);
        const genWord = /generating|in progress|in queue|queued|processing/i.test(bt);
        const errs = (bt.match(/[^.]{0,40}(?:error|failed)[^.]{0,60}/i) || []).slice(0, 3);
        return { imgs, videos, paywall, noCredits, genWord, errs, url: location.href, bodyStart: bt.substring(0, 200) };
      }).catch(() => null);
      if (!st) continue;
      finalState = st;
      beat({ elapsedSec: dt, post: result.postFired || 0 });

      // à 25 s : si aucun POST et aucun changement → Enter dans le champ + re-clic Generate
      if (dt >= 25 && !retried && !result.postFired && !st.genWord) {
        retried = true;
        slog('⚠️ silence total à 25s — Enter + re-clic Generate');
        await page.screenshot({ path: `${OUT}/p9-genrun2-03-silent.png` });
        try {
          const ce2 = page.locator('[contenteditable="true"]:visible').first();
          if ((await ce2.count()) > 0) { await ce2.click({ timeout: 3000 }); await page.keyboard.press('Enter'); await page.waitForTimeout(1500); }
          const gen2 = page.locator('button:visible', { hasText: /generate/i }).last();
          if ((await gen2.count()) > 0) await gen2.click({ timeout: 5000 });
        } catch (e) { slog('retry: ' + e.message.substring(0, 60)); }
        continue;
      }

      if (st.paywall) { result.outcome = 'PAYWALL'; await page.screenshot({ path: `${OUT}/p9-genrun2-04-paywall.png` }); slog(`🧱 PAYWALL à ${dt}s`); break; }
      if (st.noCredits) { result.outcome = 'NO_CREDITS'; await page.screenshot({ path: `${OUT}/p9-genrun2-04-nocredits.png` }); slog(`💸 NO_CREDITS à ${dt}s`); break; }
      const newImg = st.imgs.find(i => !beforeSrcs.has(i.src) && !JUNK.test(i.src));
      const newVid = st.videos.find(v => !beforeSrcs.has(v.src) && !JUNK.test(v.src) && v.dur > 0);
      if (newImg || newVid) {
        result.outcome = 'GENERATED'; result.success = true; result.elapsedSec = dt;
        result.output = newImg || newVid;
        slog(`✅ GÉNÉRÉ en ${dt}s: ${JSON.stringify(result.output).substring(0, 160)}`);
        await page.screenshot({ path: `${OUT}/p9-genrun2-04-result.png` });
        break;
      }
      if (dt % 30 < 6) slog(`${dt}s… post=${result.postFired || 0} genWord=${st.genWord} imgs=${st.imgs.length} url=${st.url.substring(30, 80)}`);
    }
    if (!result.outcome) result.outcome = 'TIMEOUT';
    await page.screenshot({ path: `${OUT}/p9-genrun2-05-final.png` });

    // ── My generations + solde
    await page.goto('https://higgsfield.ai/my-generations', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => { });
    await page.waitForTimeout(6000);
    await dismissCookies(page);
    await page.screenshot({ path: `${OUT}/p9-genrun2-06-my-generations.png` });
    result.myGenText = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').substring(0, 400));
    result.finalState = finalState ? { url: finalState.url, genWord: finalState.genWord, errs: finalState.errs, bodyStart: finalState.bodyStart } : null;
    result.net = NET.slice(-60);
    fs.writeFileSync(`${OUT}/p9-genrun2.json`, JSON.stringify(result, null, 2));
    slog(`RÉSULTAT: ${result.outcome} ${result.success ? result.elapsedSec + 's' : ''} | POSTs: ${result.postFired || 0}`);
    writeStatus(result.success ? 'GENRUN2_SUCCESS' : 'GENRUN2_' + result.outcome, { elapsedSec: result.elapsedSec, posts: result.postFired || 0 });
  } catch (e) {
    slog('ERREUR: ' + e.message);
    writeStatus('GENRUN2_FAILED', { error: e.message });
  }
  if (browser) await browser.close();
  slog('gen-run2 terminé (process)');
})();
