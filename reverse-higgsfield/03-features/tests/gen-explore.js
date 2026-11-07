/**
 * GEN-EXPLORE — Explore ce qui est accessible au plan gratuit :
 * 1. Solde de crédits réel (menu compte → Manage Account)
 * 2. Liste des modèles du tool IMAGE (dropdown complet + captures)
 * 3. Liste des modèles du tool VIDEO
 * 4. État de « My generations »
 * Écrit p9-models.json + captures p9-explore-*.png
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

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function closeModals(page) {
  for (let i = 0; i < 5; i++) {
    const b = page.locator('button:visible', { hasText: /^(skip|got it|close|later|start creating|continue|next|start)$/i }).first();
    if ((await b.count()) === 0) break;
    try { await b.click({ timeout: 2500 }); await page.waitForTimeout(1500); } catch (e) { break; }
  }
}

(async () => {
  let browser = null, page = null;
  const result = { models: {}, balance: null, plan: null };
  writeStatus('EXPLORE_START');
  try {
    ({ browser, page } = await launch());
    await page.route('**/*', (route) => {
      const t = route.request().resourceType();
      if (t === 'font' || t === 'media') return route.abort();
      return route.continue();
    }).catch(e => slog('route: ' + e.message));

    // ── 1. Session
    await page.goto('https://higgsfield.ai/generate', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(8000);
    await dismissCookies(page);
    const authed = !/\/auth|\/login/.test(page.url());
    slog('session: ' + authed);
    writeStatus('EXPLORE_SESSION', { authed });
    if (!authed) throw new Error('session expirée');

    // ── 2. Solde de crédits (menu compte)
    try {
      // avatar en bas de la sidebar (profil "holographictomato2094")
      const profBtn = page.locator('button:has-text("holographictomato2094"), a:has-text("holographictomato2094")').first();
      if ((await profBtn.count()) > 0) {
        await profBtn.click({ timeout: 5000 });
        await page.waitForTimeout(2500);
        await page.screenshot({ path: `${OUT}/p9-explore-account-menu.png` });
        const menuTxt = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').substring(0, 800));
        const balMatch = menuTxt.match(/(\d[\d,\.]*)\s*credits?/i);
        result.balance = balMatch ? balMatch[1] : null;
        result.plan = /free plan/i.test(menuTxt) ? 'Free Plan' : (menuTxt.match(/(starter|plus|ultra|pro)\s*plan/i) || [])[1];
        slog('menu compte — balance: ' + result.balance + ' | plan: ' + result.plan);
        // Manage Account → page compte
        const manage = page.locator('button:has-text("Manage Account"), a:has-text("Manage Account")').first();
        if ((await manage.count()) > 0) {
          await manage.click({ timeout: 5000 }).catch(() => { });
          await page.waitForTimeout(6000);
          await dismissCookies(page);
          await page.screenshot({ path: `${OUT}/p9-explore-account-page.png` });
          const accTxt = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').substring(0, 1200));
          result.accountPageUrl = page.url();
          const bal2 = accTxt.match(/(\d[\d,\.]*)\s*\/\s*(\d[\d,\.]*)\s*credits?/i) || accTxt.match(/(\d[\d,\.]*)\s*credits?/i);
          if (bal2) result.balance = bal2[0];
          result.accountText = accTxt.substring(0, 600);
          slog('page compte: ' + page.url().substring(0, 80) + ' | ' + (bal2 ? bal2[0] : 'solde introuvé'));
        }
      } else {
        slog('bouton profil introuvable');
      }
    } catch (e) { slog('menu compte: ' + e.message.substring(0, 100)); }
    writeStatus('EXPLORE_BALANCE', { balance: result.balance, plan: result.plan });

    // ── 3. Modèles du tool IMAGE
    async function exploreModels(toolKey, url) {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(9000);
      await dismissCookies(page);
      await closeModals(page);
      // le sélecteur de modèle est dans la barre de prompt : bouton avec chevron près du champ
      const modelBtn = page.locator('button:visible', { hasText: /gpt image|image 2|model|flux|nano|seedance|cinema|studio|leonardo|veo|dall/i }).first();
      let clicked = null;
      const cands = await page.evaluate(() => {
        const vis = (el) => el.offsetParent !== null || el.getClientRects().length > 0;
        return [...document.querySelectorAll('button')].filter(vis).map(b => (b.textContent || '').trim().replace(/\s+/g, ' ').substring(0, 50)).filter(Boolean);
      });
      slog(`[${toolKey}] boutons visibles (20): ` + JSON.stringify(cands.slice(0, 20)));
      if ((await modelBtn.count()) > 0) {
        await modelBtn.click({ timeout: 6000 }).catch(async (e) => { slog('clic modèle échoué: ' + e.message.substring(0, 60)); });
        clicked = true;
        await page.waitForTimeout(2500);
        await page.screenshot({ path: `${OUT}/p9-explore-models-${toolKey}.png` });
        const items = await page.evaluate(() => {
          const vis = (el) => el.offsetParent !== null || el.getClientRects().length > 0;
          // items de dropdown/listbox/menu
          const sels = [...document.querySelectorAll('[role="option"], [role="menuitem"], [role="listbox"] *, [data-radix-popper-content-wrapper] *, [cmdk-item]')].filter(vis);
          const seen = new Set();
          return sels.map(e => (e.textContent || '').trim().replace(/\s+/g, ' ').substring(0, 90)).filter(t => t && !seen.has(t) && seen.add(t)).slice(0, 40);
        });
        result.models[toolKey] = items;
        slog(`[${toolKey}] modèles (${items.length}): ` + JSON.stringify(items.slice(0, 15)));
        await page.keyboard.press('Escape').catch(() => { });
      } else {
        result.models[toolKey] = null;
        slog(`[${toolKey}] sélecteur de modèle introuvable`);
      }
      return clicked;
    }

    await exploreModels('image', 'https://higgsfield.ai/ai/image');
    writeStatus('EXPLORE_MODELS', { done: 'image' });
    await exploreModels('video', 'https://higgsfield.ai/ai/video');
    writeStatus('EXPLORE_MODELS', { done: 'image,video' });

    // ── 4. My generations
    await page.goto('https://higgsfield.ai/my-generations', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => { });
    await page.waitForTimeout(7000);
    await dismissCookies(page);
    await page.screenshot({ path: `${OUT}/p9-explore-my-generations.png` });
    result.myGenerationsUrl = page.url();
    result.myGenerationsText = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').substring(0, 500));
    slog('my generations: ' + page.url().substring(0, 70) + ' | ' + result.myGenerationsText.substring(0, 150));

    fs.writeFileSync(`${OUT}/p9-models.json`, JSON.stringify(result, null, 2));
    writeStatus('EXPLORE_DONE', { balance: result.balance, plan: result.plan });
    slog('exploration terminée');
  } catch (e) {
    slog('ERREUR: ' + e.message);
    writeStatus('EXPLORE_FAILED', { error: e.message });
  }
  if (browser) await browser.close();
  slog('gen-explore terminé (process)');
})();
