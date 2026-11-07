/**
 * RE-AUDIT — Ré-audit des outils avec le sélecteur radio corrigé + extraction crédits.
 * Réutilise la session sauvegardée (.hf-cookies.json + profil persistant) : PAS de re-login.
 * Usage : node re-audit.js
 */
const { launch, dismissCookies, log, OUT } = require('./hf-common');
const fs = require('fs');

const ROOT = '/home/z/my-project';
const STATUS_FILE = `${ROOT}/.hf-phase9-status.json`;
let LAST_STATUS = { status: 'INIT' };
const writeStatus = (s, extra = {}) => {
  LAST_STATUS = { status: s, ...extra };
  fs.writeFileSync(STATUS_FILE, JSON.stringify({ ...LAST_STATUS, t: new Date().toISOString() }, null, 2));
};
const LOG_FILE = `${ROOT}/.hf-mega.log`;
const slog = (m) => { const line = `[${new Date().toISOString().substring(11, 19)}] ${m}`; try { fs.appendFileSync(LOG_FILE, line + '\n'); } catch (e) { } console.log(line); };
process.on('unhandledRejection', (r) => slog('⚠️ unhandledRejection: ' + (r && r.message ? r.message : String(r)).substring(0, 200)));

const BLOCK = { img: false, media: true, font: true };

async function toolInfo(page) {
  return page.evaluate(() => {
    const vis = (el) => el.offsetParent !== null || el.getClientRects().length > 0;
    const textareas = [...document.querySelectorAll('textarea')].filter(vis).map(t => ({ ph: (t.placeholder || '').substring(0, 90), ce: false }));
    const editables = [...document.querySelectorAll('[contenteditable="true"]')].filter(vis).map(t => ({ ph: (t.getAttribute('data-placeholder') || '').substring(0, 90), ce: true }));
    const selects = [...document.querySelectorAll('select')].filter(vis).map(s => ({ name: s.name || s.id, options: [...s.options].map(o => o.textContent.trim()).slice(0, 30) }));
    const radios = [...document.querySelectorAll('input[type="radio"]')].filter(vis).slice(0, 30).map(i => ({ name: i.name, value: i.value, checked: i.checked }));
    const tabs = [...document.querySelectorAll('[role="tab"]')].filter(vis).map(t => t.textContent.trim().substring(0, 40)).slice(0, 20);
    const costs = [...document.body.innerText.matchAll(/(\d[\d,\.]*)\s*(?:credits?|cr\.?)/gi)].map(m => m[0]).slice(0, 25);
    const genBtns = [...document.querySelectorAll('button')].filter(vis).map(b => (b.textContent || '').trim().replace(/\s+/g, ' ')).filter(t => /generate|create/i.test(t)).slice(0, 10);
    const sliders = [...document.querySelectorAll('input[type="range"]')].filter(vis).map(s => ({ name: s.name || s.id || s.getAttribute('aria-label') || '', min: s.min, max: s.max, value: s.value })).slice(0, 15);
    const btns = [...document.querySelectorAll('button')].filter(vis).map(b => ({ t: (b.textContent || '').trim().substring(0, 45), d: b.disabled })).filter(b => b.t).slice(0, 50);
    const headings = [...document.querySelectorAll('h1,h2,h3')].filter(vis).map(h => h.textContent.trim().substring(0, 70)).filter(Boolean).slice(0, 12);
    // éléments texte contenant "credit" (solde)
    const creditTexts = [...document.querySelectorAll('button, a, span, div, p')].filter(vis).map(e => (e.textContent || '').trim().replace(/\s+/g, ' ')).filter(t => /credit/i.test(t) && t.length < 60).slice(0, 12);
    return { url: location.href, headings, prompts: [...editables, ...textareas], selects, radios, tabs, costs, genBtns, sliders, btns, creditTexts, bodyText: document.body.innerText.replace(/\s+/g, ' ').substring(0, 2200) };
  });
}

async function closeModals(page) {
  for (let i = 0; i < 6; i++) {
    const b = page.locator('button:visible', { hasText: /^(skip|got it|close|later|start creating|continue|next|start)$/i }).first();
    if ((await b.count()) === 0) break;
    try { await b.click({ timeout: 2500 }); await page.waitForTimeout(1800); } catch (e) { break; }
  }
}

(async () => {
  let browser = null, page = null;
  writeStatus('REAUDIT_START');
  try {
    ({ browser, page } = await launch());
    await page.route('**/*', (route) => {
      const t = route.request().resourceType();
      if (t === 'font') return route.abort();
      if (BLOCK.media && t === 'media') return route.abort();
      return route.continue();
    }).catch(e => slog('route: ' + e.message));

    // ── Vérif session (sinon → signaler, pas de login auto)
    await page.goto('https://higgsfield.ai/generate', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(9000);
    await dismissCookies(page);
    await closeModals(page);
    const authed = !/\/auth|\/login/.test(page.url());
    slog('session valide après restauration cookies : ' + authed + ' | url=' + page.url().substring(0, 70));
    writeStatus('REAUDIT_SESSION', { authed });
    if (!authed) throw new Error('session expirée — re-login nécessaire (relancer mega-daemon)');

    // ── Solde de crédits : explorer le menu avatar / billing
    try {
      const avBtn = page.locator('button:has(img[alt*="avatar" i]), button[aria-label*="account" i], button:has-text("credits"), [data-testid*="avatar"]').first();
      if ((await avBtn.count()) > 0) {
        await avBtn.click({ timeout: 5000 }).catch(() => { });
        await page.waitForTimeout(2500);
        const billing = await page.evaluate(() => [...document.querySelectorAll('a, button')].filter(e => e.offsetParent !== null).map(e => ({ t: (e.textContent || '').trim().substring(0, 50), h: (e.getAttribute('href') || '') })).filter(x => /billing|plan|credit|subscription|account/i.test(x.t + x.h)).slice(0, 10));
        fs.writeFileSync(`${OUT}/p9-billing-menu.json`, JSON.stringify(billing, null, 2));
        slog('menu compte: ' + JSON.stringify(billing).substring(0, 200));
        await page.keyboard.press('Escape').catch(() => { });
      }
    } catch (e) { slog('menu avatar: ' + e.message.substring(0, 80)); }

    // ── Audits des 6 outils
    const auditTools = [
      ['image', 'https://higgsfield.ai/ai/image'],
      ['video', 'https://higgsfield.ai/ai/video'],
      ['cinema', 'https://higgsfield.ai/generate'],
      ['effects', 'https://higgsfield.ai/effects/use'],
      ['layers', 'https://higgsfield.ai/layers'],
      ['canvas', 'https://higgsfield.ai/canvas'],
    ];
    const audits = {};
    for (const [k, u] of auditTools) {
      const t0 = Date.now();
      try {
        await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(9000);
        await dismissCookies(page);
        await closeModals(page);
        await page.screenshot({ path: `${OUT}/p9-audit-${k}.png` });
        const info = await toolInfo(page);
        audits[k] = { loadMs: Date.now() - t0, ...info };
        fs.writeFileSync(`${OUT}/p9-audit-${k}.json`, JSON.stringify(audits[k], null, 2));
        slog(`[audit ${k}] OK ${Date.now() - t0}ms | coûts: ${JSON.stringify(info.costs.slice(0, 8))} | tabs: ${JSON.stringify(info.tabs.slice(0, 6))} | prompts: ${info.prompts.length}`);
      } catch (e) {
        audits[k] = { error: e.message.substring(0, 200) };
        slog(`[audit ${k}] ERREUR: ${e.message.substring(0, 120)}`);
      }
      writeStatus('REAUDIT', { done: Object.keys(audits).join(',') });
    }
    fs.writeFileSync(`${OUT}/p9-audits-all.json`, JSON.stringify(audits, null, 2));
    writeStatus('REAUDIT_DONE');
    slog('ré-audit terminé');
  } catch (e) {
    slog('ERREUR: ' + e.message);
    writeStatus('REAUDIT_FAILED', { error: e.message });
  }
  if (browser) await browser.close();
  slog('re-audit terminé (process)');
})();
