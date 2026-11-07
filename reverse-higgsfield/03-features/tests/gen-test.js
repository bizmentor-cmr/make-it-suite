/**
 * GENERATION TEST — Test réel de génération chronométré
 * Usage: node gen-test.js image|video|cinema ["prompt custom"]
 * - note crédits avant/après
 * - saisit le prompt, clique Generate, chronomètre jusqu'au résultat
 * - capture le cycle de vie réseau (job creation → polling → résultat)
 * - screenshot + tentative de téléchargement du résultat
 */
const { launch, dismissCookies, log, OUT } = require('./hf-common');
const fs = require('fs');

const TARGETS = {
  image: { url: 'https://higgsfield.ai/ai/image', genBtn: /^(generate|create|create image|generate image)$/i },
  video: { url: 'https://higgsfield.ai/ai/video', genBtn: /^(generate|create|create video|generate video)$/i },
  cinema: { url: 'https://higgsfield.ai/generate', genBtn: /^(generate|create)$/i },
};

(async () => {
  const key = process.argv[2] || 'image';
  const target = TARGETS[key];
  if (!target) { log('cibles: image|video|cinema'); process.exit(1); }
  const PROMPT = process.argv[3] || 'A majestic golden eagle soaring over snowy mountains at sunrise, cinematic lighting, ultra detailed';

  const { browser, page } = await launch();
  const net = [];
  const jobEvents = [];

  // Réseau : tout XHR + détection cycles job
  page.on('request', (req) => {
    if (['xhr', 'fetch'].includes(req.resourceType())) {
      const u = req.url();
      if (/clerk|posthog|datadome|google|cloudflare|sentry/.test(u)) return;
      const entry = { t: Date.now(), dir: 'REQ', m: req.method(), url: u.substring(0, 220), body: (req.postData() || '').substring(0, 700) };
      net.push(entry);
      if (/generate|job|queue|predict|task/.test(u)) { jobEvents.push(entry); log('→ ' + req.method() + ' ' + u.substring(0, 130)); }
    }
  });
  page.on('response', async (res) => {
    const u = res.url();
    if (/clerk|posthog|datadome|google|cloudflare|sentry/.test(u)) return;
    if (['xhr', 'fetch'].includes(res.request().resourceType())) {
      let body = '';
      try { body = (await res.text()).substring(0, 800); } catch (e) { }
      const entry = { t: Date.now(), dir: 'RES', s: res.status(), url: u.substring(0, 220), body };
      net.push(entry);
      if (/generate|job|queue|predict|task/.test(u)) { jobEvents.push(entry); log('← ' + res.status() + ' ' + u.substring(0, 120) + ' :: ' + body.substring(0, 120)); }
    }
  });

  try {
    // ── Session check
    await page.goto('https://higgsfield.ai/generate', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(7000);
    if (page.url().includes('/auth') || page.url().includes('/login')) { log('❌ PAS DE SESSION'); await browser.close(); process.exit(2); }
    log('✅ session OK');

    const getCredits = () => page.evaluate(() => {
      const m = document.body.innerText.match(/(\d[\d,\.]*)\s*(?:\/\s*(\d[\d,\.]*))?\s*credits?/i);
      return m ? (m[2] ? `${m[1]}/${m[2]}` : m[1]) : null;
    });

    // ── Page outil
    await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(10000);
    await dismissCookies(page);
    // fermer onboarding
    const modalBtns = page.locator('button:visible', { hasText: /^(skip|got it|close|later|start creating|continue)$/i });
    let guard = 0;
    while ((await modalBtns.count()) > 0 && guard < 5) { try { await modalBtns.first().click({ timeout: 2500 }); guard++; await page.waitForTimeout(1500); } catch (e) { break; } }
    await page.screenshot({ path: `${OUT}/p9-gen-${key}-01-tool.png` });
    const creditsBefore = await getCredits();
    log('CRÉDITS AVANT: ' + creditsBefore);

    // ── Trouver le champ prompt (contenteditable > textarea > input)
    let promptSel = null;
    const cand = await page.evaluate(() => {
      const vis = (el) => el.offsetParent !== null || el.getClientRects().length > 0;
      const cands = [];
      document.querySelectorAll('[contenteditable="true"], textarea, input[type="text"], input:not([type])').forEach(el => {
        if (!vis(el)) return;
        const r = el.getBoundingClientRect();
        const ph = (el.getAttribute('placeholder') || el.getAttribute('data-placeholder') || '').toLowerCase();
        const isPrompt = /prompt|describe|imagine|create|dream/.test(ph) || el.getAttribute('contenteditable') === 'true' || el.tagName === 'TEXTAREA';
        cands.push({ tag: el.tagName, ce: el.getAttribute('contenteditable'), ph: ph.substring(0, 80), w: Math.round(r.width), h: Math.round(r.height), isPrompt });
      });
      return cands.sort((a, b) => (b.isPrompt - a.isPrompt) || (b.w * b.h - a.w * a.h)).slice(0, 8);
    });
    log('CANDIDATS PROMPT: ' + JSON.stringify(cand));
    if (cand.length > 0 && cand[0].isPrompt) promptSel = cand[0];

    if (!promptSel) { log('❌ champ prompt introuvable'); throw new Error('no prompt field'); }

    // ── Saisie du prompt
    if (promptSel.ce === 'true') {
      const el = page.locator('[contenteditable="true"]:visible').first();
      await el.click({ timeout: 8000 });
      await page.keyboard.type(PROMPT, { delay: 15 });
    } else if (promptSel.tag === 'TEXTAREA') {
      const el = page.locator('textarea:visible').first();
      await el.click({ timeout: 8000 });
      await el.fill(PROMPT);
    } else {
      const el = page.locator('input[type="text"]:visible, input:not([type]):visible').first();
      await el.click({ timeout: 8000 });
      await el.fill(PROMPT);
    }
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/p9-gen-${key}-02-prompt-filled.png` });
    log('PROMPT SAISI: "' + PROMPT.substring(0, 60) + '…"');

    // ── Bouton Generate
    const genBtn = page.locator('button:visible', { hasText: target.genBtn }).last();
    const genDisabled = (await genBtn.count()) > 0 ? await genBtn.isDisabled() : null;
    log('BOUTON GEN: count=' + (await genBtn.count()) + ' disabled=' + genDisabled);
    if ((await genBtn.count()) === 0) {
      // fallback : tout bouton avec "generate"
      const any = page.locator('button:visible', { hasText: /generat|create/i }).last();
      if ((await any.count()) === 0) throw new Error('bouton generate introuvable');
      log('fallback bouton: ' + await any.textContent());
      await any.click({ timeout: 8000 });
    } else {
      await genBtn.click({ timeout: 8000 });
    }
    log('🚀 GÉNÉRATION LANCÉE — chrono démarré');
    const T0 = Date.now();

    // ── Surveiller l'apparition du résultat (max 6 min pour image, 10 pour vidéo)
    const MAX_MS = key === 'video' ? 10 * 60 * 1000 : 6 * 60 * 1000;
    let done = false, elapsedMs = null, resultInfo = null;
    while (Date.now() - T0 < MAX_MS) {
      await page.waitForTimeout(5000);
      const state = await page.evaluate(() => {
        const vis = (el) => el.offsetParent !== null;
        const body = document.body.innerText;
        const imgs = [...document.querySelectorAll('img')].filter(vis).filter(i => i.naturalWidth > 300).map(i => ({ src: (i.currentSrc || i.src).substring(0, 200), w: i.naturalWidth, h: i.naturalHeight }));
        const videos = [...document.querySelectorAll('video')].filter(vis).map(v => ({ src: (v.currentSrc || v.src || '').substring(0, 200), dur: v.duration, w: v.videoWidth, h: v.videoHeight }));
        const progress = (body.match(/(\d{1,3})\s*%/) || [])[1];
        const queue = /queue|processing|generating|loading/i.test(body);
        const dlBtn = [...document.querySelectorAll('button, a')].filter(vis).filter(b => /download|save/i.test(b.textContent || '')).length;
        return { imgs, videos, progress, queue, dlBtn };
      });
      const dt = Math.round((Date.now() - T0) / 1000);
      if (state.videos.length > 0 && state.videos[0].dur > 0) { done = true; resultInfo = state; elapsedMs = Date.now() - T0; log(`[${dt}s] 🎬 VIDÉO PRÊTE`); break; }
      if (key !== 'video' && state.imgs.length > 0 && state.imgs.some(i => i.w >= 512)) { done = true; resultInfo = state; elapsedMs = Date.now() - T0; log(`[${dt}s] 🖼️ IMAGE PRÊTE`); break; }
      if (dt % 30 < 6) log(`[${dt}s] attente… progress=${state.progress || '-'} queue=${state.queue} imgs=${state.imgs.length} vids=${state.videos.length}`);
    }

    await page.screenshot({ path: `${OUT}/p9-gen-${key}-03-result.png` });
    const creditsAfter = await getCredits();

    // ── Résumé
    const summary = {
      tool: key, url: target.url, prompt: PROMPT,
      success: done, elapsedMs, elapsedSec: elapsedMs ? Math.round(elapsedMs / 1000) : null,
      creditsBefore, creditsAfter,
      result: resultInfo,
      netReqs: net.length, jobEvents: jobEvents.length,
    };
    fs.writeFileSync(`${OUT}/p9-gen-${key}-04-summary.json`, JSON.stringify(summary, null, 2));
    log('════════ RÉSUMÉ ════════');
    log(JSON.stringify(summary, null, 2).substring(0, 1500));
  } catch (e) {
    log('ERREUR: ' + e.message);
    await page.screenshot({ path: `${OUT}/p9-gen-${key}-error.png` }).catch(() => {});
  }
  fs.writeFileSync(`${OUT}/p9-gen-${key}-net.json`, JSON.stringify(net, null, 2));
  fs.writeFileSync(`${OUT}/p9-gen-${key}-jobs.json`, JSON.stringify(jobEvents, null, 2));
  await browser.close();
  log('Terminé');
})();
