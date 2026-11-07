// ============================================================
// PHASE 7 — Recherche externe : reviews & Reddit via navigateur
// ============================================================
const { chromium } = require('/home/z/.npm-global/lib/node_modules/playwright');
const fs = require('fs');

const OUT = '/home/z/my-project/reverse-higgsfield/06-business-logic/captures';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/z/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell',
    headless: true,
  });
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, userAgent: UA, locale: 'en-US' });
  const page = await ctx.newPage();

  // ===== 1. Reddit search =====
  try {
    console.log('1. Reddit search…');
    await page.goto('https://www.reddit.com/search/?q=higgsfield%20pricing%20credits', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await sleep(7000);
    await page.screenshot({ path: `${OUT}/ext-reddit-search.png` });
    const posts = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('a[data-testid="post-title"], faceplate-tracker a[slot="title"], shreddit-post a[slot="full-post-link"], a[href*="/comments/"]').forEach(a => {
        const t = (a.textContent || '').trim();
        const h = a.getAttribute('href') || '';
        if (t.length > 15 && h.includes('/comments/')) items.push({ title: t.slice(0, 140), href: h.startsWith('http') ? h : 'https://www.reddit.com' + h });
      });
      return items.slice(0, 25);
    });
    fs.writeFileSync(`${OUT}/ext-reddit-search.json`, JSON.stringify(posts, null, 1));
    console.log(`   ${posts.length} posts extraits`);
  } catch (e) { console.log('   reddit err:', e.message); }

  // ===== 2. Trustpilot =====
  try {
    console.log('2. Trustpilot…');
    await page.goto('https://www.trustpilot.com/review/higgsfield.ai', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await sleep(7000);
    await page.screenshot({ path: `${OUT}/ext-trustpilot.png` });
    const info = await page.evaluate(() => {
      const txt = (document.body.innerText || '');
      const score = txt.match(/TrustScore\s*([\d.]+)/i);
      const count = txt.match(/([\d,]+)\s+reviews?/i);
      // extraire quelques reviews
      const reviews = [];
      document.querySelectorAll('article').forEach(a => {
        const t = (a.innerText || '').trim();
        if (t.length > 60 && t.length < 1200) reviews.push(t.slice(0, 600));
      });
      return { score: score ? score[1] : null, count: count ? count[1] : null, reviews: reviews.slice(0, 8), snippet: txt.slice(0, 800) };
    });
    fs.writeFileSync(`${OUT}/ext-trustpilot.json`, JSON.stringify(info, null, 1));
    console.log(`   score: ${info.score} | ${info.count} reviews | ${info.reviews.length} extraits`);
  } catch (e) { console.log('   trustpilot err:', e.message); }

  // ===== 3. Comparatifs connus (search Bing dans le navigateur) =====
  try {
    console.log('3. Bing search (navigateur)…');
    await page.goto('https://www.bing.com/search?q=%22higgsfield%22+pricing+review+worth+it', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await sleep(5000);
    const results = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('#b_results h2 a').forEach(a => out.push({ title: (a.textContent || '').trim().slice(0, 120), href: a.getAttribute('href') }));
      return out.slice(0, 15);
    });
    fs.writeFileSync(`${OUT}/ext-bing-results.json`, JSON.stringify(results, null, 1));
    console.log(`   ${results.length} résultats`);
  } catch (e) { console.log('   bing err:', e.message); }

  await browser.close();
  console.log('Terminé');
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
