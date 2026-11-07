/**
 * ROUND 2 — Flows interactifs approfondis
 * 1. Composer contenteditable (cinema studio, ai/video) : frappe + GENERATE → login wall
 * 2. URLs alternatives des outils 404 (soul cinema, relight video, templates)
 * 3. Flow pricing → checkout (clic plan → modal/redirect)
 */
const { chromium } = require('/home/z/.npm-global/lib/node_modules/playwright');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const OUT = '/home/z/my-project/reverse-higgsfield/05-user-flows/captures';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/home/z/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell',
    viewport: { width: 1440, height: 900 },
    userAgent: UA,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const log = (m) => console.log(`[${new Date().toISOString().substring(11, 19)}] ${m}`);
  const results = {};
  const dismiss = () => page.evaluate(() => { document.querySelector('.cc-window, [aria-label="cookieconsent"]')?.remove(); }).catch(() => {});

  // ══ 1. FLOW CINEMA STUDIO INTERACTIF ══
  try {
    log('══ CINEMA STUDIO interactif ══');
    await page.goto('https://higgsfield.ai/generate', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(9000); await dismiss(); await page.waitForTimeout(500);
    // Trouver le champ prompt (contenteditable ou textarea ou input)
    const promptSel = await page.evaluate(() => {
      const cands = [];
      document.querySelectorAll('[contenteditable="true"], textarea, input[type="text"]').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width > 200 && r.height > 30) cands.push({ tag: el.tagName, ce: el.getAttribute('contenteditable'), ph: (el.placeholder || el.getAttribute('data-placeholder') || '').substring(0, 60), w: Math.round(r.width), h: Math.round(r.height) });
      });
      return cands;
    });
    log('Champs prompt candidats: ' + JSON.stringify(promptSel));
    results.cinemaPromptFields = promptSel;

    const ph = page.locator('[contenteditable="true"], textarea').last();
    if (await ph.count() > 0) {
      await ph.click({ timeout: 8000 });
      await ph.fill('a film noir detective walking in rainy alley');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${OUT}/flow2-cinema-prompt.png` });
      // GENERATE
      const gen = page.locator('button:has-text("GENERATE"):visible, button:has-text("Generate"):visible').last();
      if (await gen.count() > 0) {
        await gen.click({ timeout: 8000 });
        log('Clic GENERATE effectué');
        await page.waitForTimeout(8000);
        await page.screenshot({ path: `${OUT}/flow2-cinema-after-generate.png` });
        const after = await page.evaluate(() => {
          const vis = (el) => el.offsetParent !== null;
          const dialogs = [...document.querySelectorAll('[role="dialog"], [class*="modal"], [class*="Modal"]')].filter(vis).map(d => d.textContent.trim().substring(0, 300));
          const toasts = [...document.querySelectorAll('[class*="toast"], [class*="Toast"], [data-sonner-toast]')].filter(vis).map(t => t.textContent.trim().substring(0, 150));
          return { url: location.href, dialogs, toasts, bodySnippet: document.body.innerText.replace(/\n+/g, ' | ').substring(0, 400) };
        });
        results.cinemaAfterGenerate = after;
        log('APRÈS GENERATE: ' + JSON.stringify(after).substring(0, 500));
      }
    }
  } catch (e) { log('ERREUR cinema: ' + e.message.substring(0, 120)); }

  // ══ 2. FLOW AI/VIDEO INTERACTIF ══
  try {
    log('══ AI/VIDEO interactif ══');
    await page.goto('https://higgsfield.ai/ai/video', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(8000); await dismiss();
    const ph = page.locator('[contenteditable="true"], textarea').last();
    if (await ph.count() > 0) {
      await ph.click({ timeout: 8000 });
      await ph.fill('a red sports car drifting through tokyo streets at night in the rain');
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${OUT}/flow2-aivideo-prompt.png` });
      const gen = page.locator('button:has-text("Generate"):visible').last();
      if (await gen.count() > 0) {
        await gen.click({ timeout: 8000 });
        await page.waitForTimeout(7000);
        await page.screenshot({ path: `${OUT}/flow2-aivideo-after-generate.png` });
        const after = await page.evaluate(() => {
          const vis = (el) => el.offsetParent !== null;
          const dialogs = [...document.querySelectorAll('[role="dialog"], [class*="modal"]')].filter(vis).map(d => d.textContent.trim().substring(0, 300));
          return { url: location.href, dialogs, body: document.body.innerText.replace(/\n+/g, ' | ').substring(0, 350) };
        });
        results.aiVideoAfterGenerate = after;
        log('APRÈS GENERATE: ' + JSON.stringify(after).substring(0, 400));
      }
    }
  } catch (e) { log('ERREUR aivideo: ' + e.message.substring(0, 120)); }

  // ══ 3. URLs ALTERNATIVES (soul cinema, relight video, templates, moodboard) ══
  const altRoutes = [
    { id: 'soul-page-tabs', url: 'https://higgsfield.ai/soul' },
    { id: 'apps-directory', url: 'https://higgsfield.ai/apps' },
    { id: 'mixed-media-presets', url: 'https://higgsfield.ai/mixed-media-presets' },
    { id: 'pricing-checkout-click', url: 'https://higgsfield.ai/pricing' },
  ];
  for (const r of altRoutes) {
    try {
      log(`══ ${r.id} ══`);
      await page.goto(r.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(8000); await dismiss(); await page.waitForTimeout(500);

      if (r.id === 'apps-directory') {
        const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => ({ t: (a.textContent || '').trim().substring(0, 40), h: a.getAttribute('href') })).filter(l => l.h && l.h.startsWith('/') && l.t).slice(0, 50));
        results.appsLinks = links;
        log('Liens apps: ' + links.filter(l => /relight|soul|photodump|template/i.test(l.h + l.t)).map(l => l.t + '→' + l.h).join(' · ').substring(0, 300));
      }

      if (r.id === 'soul-page-tabs') {
        const soulUI = await page.evaluate(() => {
          const vis = (el) => el.offsetParent !== null;
          const tabs = [...document.querySelectorAll('[role="tab"], button')].filter(vis).map(b => (b.textContent || '').trim().substring(0, 35)).filter(t => t && t.length < 35);
          const presets = (document.body.innerText.match(/^[A-Z][A-Z\s&'-]{3,30}$/gm) || []).slice(0, 30);
          const ctas = [...document.querySelectorAll('a[href], button')].filter(vis).filter(b => /create|generate|start|upload/i.test(b.textContent || '')).map(b => (b.textContent || '').trim().substring(0, 40)).slice(0, 10);
          return { tabs: [...new Set(tabs)].slice(0, 30), presets, ctas };
        });
        results.soulUI = soulUI;
        log('SOUL tabs: ' + JSON.stringify(soulUI.tabs.slice(0, 15)));
        log('SOUL presets: ' + soulUI.presets.slice(0, 15).join(' · '));
      }

      if (r.id === 'mixed-media-presets') {
        const mm = await page.evaluate(() => {
          const vis = (el) => el.offsetParent !== null;
          const cards = [...document.querySelectorAll('a[href]')].filter(vis).map(a => ({ t: (a.textContent || '').trim().substring(0, 50), h: (a.getAttribute('href') || '').substring(0, 60) })).filter(c => c.t && c.h).slice(0, 40);
          const headings = [...document.querySelectorAll('h1,h2,h3')].filter(vis).map(h => h.textContent.trim().substring(0, 60)).slice(0, 10);
          return { headings, cards };
        });
        results.mixedMedia = mm;
        log('MM headings: ' + mm.headings.join(' | ').substring(0, 200));
      }

      if (r.id === 'pricing-checkout-click') {
        await page.screenshot({ path: `${OUT}/flow4-pricing-initial.png` });
        // Cliquer le CTA du plan Pro (mensuel)
        const cta = page.locator('button:has-text("Get Pro"), a:has-text("Get Pro"), button:has-text("Upgrade"), button:has-text("Subscribe"), button:has-text("Buy"), a:has-text("Buy")').first();
        const allBtns = await page.evaluate(() => [...document.querySelectorAll('button, a[href]')].filter(b => b.offsetParent !== null).map(b => (b.textContent || '').trim().substring(0, 45)).filter(t => /get|buy|subscribe|upgrade|start|choose|pay/i.test(t)).slice(0, 20));
        results.pricingCTAs = allBtns;
        log('CTAs pricing: ' + allBtns.join(' · '));
        if (await cta.count() > 0) {
          await cta.click({ timeout: 8000 });
          await page.waitForTimeout(7000);
          await page.screenshot({ path: `${OUT}/flow4-pricing-after-cta.png` });
          const after = await page.evaluate(() => {
            const vis = (el) => el.offsetParent !== null;
            const dialogs = [...document.querySelectorAll('[role="dialog"], [class*="modal"]')].filter(vis).map(d => d.textContent.trim().substring(0, 400));
            return { url: location.href, dialogs, body: document.body.innerText.replace(/\n+/g, ' | ').substring(0, 300) };
          });
          results.pricingAfterCTA = after;
          log('APRÈS CTA pricing: ' + JSON.stringify(after).substring(0, 500));
        }
      }
      await page.screenshot({ path: `${OUT}/flow2-${r.id}.png` });
    } catch (e) { log(`ERREUR ${r.id}: ` + e.message.substring(0, 100)); }
  }

  fs.writeFileSync(`${OUT}/flows-round2.json`, JSON.stringify(results, null, 1));
  await browser.close();
  log('SAUVÉ flows-round2.json');
})();
