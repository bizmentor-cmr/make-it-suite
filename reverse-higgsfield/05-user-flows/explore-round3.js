/**
 * ROUND 3 — Dernières explorations : templates, relight, soul, pricing checkout, cinema generate
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
  const analyze = () => page.evaluate(() => {
    const vis = (el) => el.offsetParent !== null || el.getClientRects().length > 0;
    return {
      url: location.href,
      headings: [...document.querySelectorAll('h1,h2,h3')].filter(vis).map(h => h.textContent.trim().substring(0, 70)).filter(Boolean).slice(0, 10),
      tabs: [...document.querySelectorAll('[role="tab"]')].filter(vis).map(t => (t.textContent || '').trim().substring(0, 40)),
      buttons: [...document.querySelectorAll('button')].filter(vis).map(b => (b.textContent || '').trim().substring(0, 45)).filter(Boolean).slice(0, 40),
      links: [...document.querySelectorAll('a[href]')].filter(vis).map(a => ({ t: (a.textContent || '').trim().substring(0, 35), h: (a.getAttribute('href') || '').substring(0, 60) })).filter(l => l.t && l.h).slice(0, 40),
      inputs: [...document.querySelectorAll('input:not([type=hidden]), textarea, [contenteditable="true"]')].filter(vis).map(i => ({ tag: i.tagName, type: i.type || 'ce', ph: (i.placeholder || i.getAttribute('data-placeholder') || '').substring(0, 50) })).slice(0, 10),
      uploads: [...document.querySelectorAll('input[type=file]')].map(f => ({ accept: f.accept, multiple: f.multiple })),
      bodySnippet: document.body.innerText.replace(/\n{2,}/g, '\n').substring(0, 1200),
    };
  });

  // ══ 1. TEMPLATES (/apps/trending-templates) ══
  try {
    log('══ templates ══');
    await page.goto('https://higgsfield.ai/apps/trending-templates', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(8000); await dismiss(); await page.waitForTimeout(500);
    results.templates = await analyze();
    await page.screenshot({ path: `${OUT}/tool-templates.png` });
    log('headings: ' + results.templates.headings.join(' | ').substring(0, 150));
    log('tabs: ' + JSON.stringify(results.templates.tabs.slice(0, 8)));
  } catch (e) { log('ERR templates: ' + e.message.substring(0, 80)); }

  // ══ 2. RELIGHT approfondi ══
  try {
    log('══ relight ══');
    await page.goto('https://higgsfield.ai/apps/relight', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(8000); await dismiss(); await page.waitForTimeout(500);
    results.relight = await analyze();
    await page.screenshot({ path: `${OUT}/tool-relight-detail.png` });
    log('headings: ' + results.relight.headings.join(' | ').substring(0, 120));
    log('body: ' + results.relight.bodySnippet.substring(0, 400));
  } catch (e) { log('ERR relight: ' + e.message.substring(0, 80)); }

  // ══ 3. SOUL approfondi (flow création SOUL ID) ══
  try {
    log('══ soul ══');
    await page.goto('https://higgsfield.ai/soul', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(8000); await dismiss(); await page.waitForTimeout(500);
    results.soul = await analyze();
    // Chercher le bouton de création / upload
    const soulActions = await page.evaluate(() => {
      const vis = (el) => el.offsetParent !== null;
      return [...document.querySelectorAll('button, a[href]')].filter(vis).filter(b => /upload|create|train|generate|new|start|cinema|photo/i.test(b.textContent || '')).map(b => ({ t: (b.textContent || '').trim().substring(0, 50), h: b.tagName === 'A' ? b.getAttribute('href') : null })).slice(0, 20);
    });
    results.soul.actions = soulActions;
    await page.screenshot({ path: `${OUT}/tool-soul-detail.png` });
    log('actions SOUL: ' + JSON.stringify(soulActions.slice(0, 12)));
  } catch (e) { log('ERR soul: ' + e.message.substring(0, 80)); }

  // ══ 4. MOODBOARD ══
  try {
    log('══ moodboard ══');
    await page.goto('https://higgsfield.ai/moodboard', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(8000); await dismiss(); await page.waitForTimeout(500);
    results.moodboard = await analyze();
    await page.screenshot({ path: `${OUT}/tool-moodboard-detail.png` });
    log('headings: ' + results.moodboard.headings.join(' | ').substring(0, 120));
    log('body: ' + results.moodboard.bodySnippet.substring(0, 350));
  } catch (e) { log('ERR moodboard: ' + e.message.substring(0, 80)); }

  // ══ 5. CINEMA STUDIO — GENERATE (retry) ══
  try {
    log('══ cinema studio generate ══');
    await page.goto('https://higgsfield.ai/generate', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(9000); await dismiss(); await page.waitForTimeout(500);
    const ce = page.locator('[contenteditable="true"]').last();
    await ce.click({ timeout: 8000 });
    await ce.fill('a film noir detective walking in a rainy alley');
    await page.waitForTimeout(1500);
    // Chercher TOUS les boutons generate visibles avec JS pour comprendre
    const genInfo = await page.evaluate(() => {
      const vis = (el) => el.offsetParent !== null;
      return [...document.querySelectorAll('button')].filter(vis).filter(b => /generate/i.test(b.textContent || '')).map(b => {
        const r = b.getBoundingClientRect();
        return { text: (b.textContent || '').trim().substring(0, 40), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), disabled: b.disabled };
      });
    });
    log('boutons GENERATE: ' + JSON.stringify(genInfo));
    if (genInfo.length > 0) {
      await page.mouse.click(genInfo[genInfo.length - 1].x + genInfo[genInfo.length - 1].w / 2, genInfo[genInfo.length - 1].y + 15);
      await page.waitForTimeout(7000);
      await page.screenshot({ path: `${OUT}/flow2-cinema-after-generate.png` });
      const after = await page.evaluate(() => {
        const vis = (el) => el.offsetParent !== null;
        const dialogs = [...document.querySelectorAll('[role="dialog"]')].filter(vis).map(d => d.textContent.trim().substring(0, 350));
        return { url: location.href, dialogs, body: document.body.innerText.replace(/\n+/g, ' | ').substring(0, 300) };
      });
      results.cinemaAfterGenerate = after;
      log('APRÈS GENERATE cinema: ' + JSON.stringify(after).substring(0, 400));
    }
  } catch (e) { log('ERR cinema: ' + e.message.substring(0, 100)); }

  // ══ 6. PRICING → CHECKOUT ══
  try {
    log('══ pricing checkout ══');
    await page.goto('https://higgsfield.ai/pricing', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(9000); await dismiss(); await page.waitForTimeout(500);
    // Structure des plans
    const plans = await page.evaluate(() => {
      const vis = (el) => el.offsetParent !== null;
      const cards = [...document.querySelectorAll('[class*="plan"], [class*="card"], section')].filter(vis);
      const text = document.body.innerText;
      const planBlocks = text.split(/\n(?=\w)/).filter(l => /starter|plus|ultra|scale|business|enterprise|pro/i.test(l)).slice(0, 30);
      const ctas = [...document.querySelectorAll('button, a[href]')].filter(vis).filter(b => /get (starter|plus|ultra|plan)|buy|subscribe/i.test(b.textContent || '')).map(b => {
        const r = b.getBoundingClientRect();
        return { text: (b.textContent || '').trim().substring(0, 50), x: Math.round(r.x), y: Math.round(r.y), tag: b.tagName, href: b.tagName === 'A' ? b.getAttribute('href') : null };
      });
      return { planBlocks, ctas };
    });
    results.pricingPlans = plans;
    log('CTAs plans: ' + JSON.stringify(plans.ctas.slice(0, 8)));
    // Cliquer "Get Starter" (le premier CTA plan)
    if (plans.ctas.length > 0) {
      const c = plans.ctas.find(x => /starter/i.test(x.text)) || plans.ctas[0];
      await page.mouse.click(c.x + 60, c.y + 15);
      await page.waitForTimeout(8000);
      await page.screenshot({ path: `${OUT}/flow4-after-plan-click.png` });
      const after = await page.evaluate(() => {
        const vis = (el) => el.offsetParent !== null;
        const dialogs = [...document.querySelectorAll('[role="dialog"]')].filter(vis).map(d => d.textContent.trim().substring(0, 500));
        return { url: location.href, dialogs, body: document.body.innerText.replace(/\n+/g, ' | ').substring(0, 300) };
      });
      results.pricingAfterClick = after;
      log('APRÈS clic plan: ' + JSON.stringify(after).substring(0, 500));
    }
  } catch (e) { log('ERR pricing: ' + e.message.substring(0, 100)); }

  fs.writeFileSync(`${OUT}/flows-round3.json`, JSON.stringify(results, null, 1));
  await browser.close();
  log('SAUVÉ flows-round3.json');
})();
