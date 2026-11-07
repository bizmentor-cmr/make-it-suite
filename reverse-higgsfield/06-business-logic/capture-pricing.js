// ============================================================
// PHASE 7 — Business Logic : capture navigateur de la page
// pricing (tabs mensuel/annuel/business), plan finder,
// checkout-first et pages d'achat publiques.
// Session ANONYME — aucune donnée sensible n'est saisie.
// ============================================================
const { chromium } = require('/home/z/.npm-global/lib/node_modules/playwright');
const fs = require('fs');

const OUT = '/home/z/my-project/reverse-higgsfield/06-business-logic/captures';
const PROFILE = '/tmp/hf_phase7_profile';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// ---------- Interception ----------
const SECRET_KEYS = ['cookie', 'authorization', 'x-api-key', 'proxy-authorization'];
function maskValue(v) {
  if (!v) return v;
  const s = String(v);
  if (s.length <= 24) return s[0] + '***';
  return s.slice(0, 20) + `…[+${s.length - 20} chars masqués]`;
}
const events = [];
const reqMap = new Map();
let evId = 0;
let PHASE = 'init';
const MAX_BODY = 16384;
const SKIP_EXT = /\.(png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf|eot|mp4|webm|mp3|wav|css)(\?|$)/i;

function shouldCapture(req) {
  const url = req.url();
  if (/^(data|blob|chrome|about):/i.test(url)) return false;
  const rt = req.resourceType();
  if (['xhr', 'fetch', 'websocket', 'eventsource'].includes(rt)) return true;
  if (req.method() !== 'GET') return true;
  if (rt === 'document') return true;
  if (SKIP_EXT.test(url)) return false;
  return ['script', 'other'].includes(rt) ? false : true;
}

function attach(page) {
  page.on('request', req => {
    try {
      if (!shouldCapture(req)) return;
      const rec = {
        id: ++evId, phase: PHASE, ts: Date.now(),
        url: req.url(), method: req.method(), resourceType: req.resourceType(),
        reqHeaders: {}, postData: null, status: null, contentType: null,
        body: null, bodyTruncated: false, failed: null,
      };
      const hdrs = req.headers();
      for (const [k, v] of Object.entries(hdrs)) {
        rec.reqHeaders[k] = SECRET_KEYS.includes(k) ? maskValue(v) : v;
      }
      const pd = req.postData();
      if (pd) rec.postData = pd.length > MAX_BODY ? pd.slice(0, MAX_BODY) + '…[tronqué]' : pd;
      reqMap.set(req, rec);
      events.push(rec);
    } catch (e) { console.error('req err', e.message); }
  });
  page.on('response', async res => {
    try {
      const rec = reqMap.get(res.request());
      if (!rec) return;
      rec.status = res.status();
      rec.contentType = res.headers()['content-type'] || null;
      const rt = res.request().resourceType();
      if (rt === 'xhr' || rt === 'fetch') {
        try {
          const buf = await res.body();
          if (buf && buf.length) {
            rec.bodySize = buf.length;
            if (buf.length <= MAX_BODY) rec.body = buf.toString('utf8');
            else { rec.body = buf.toString('utf8').slice(0, 2048) + '…[tronqué]'; rec.bodyTruncated = true; }
          }
        } catch { /* stream */ }
      }
    } catch (e) { console.error('res err', e.message); }
  });
  page.on('requestfailed', req => {
    const rec = reqMap.get(req);
    if (rec) rec.failed = req.failure()?.errorText || 'failed';
  });
}

// ---------- Helpers ----------
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function extractPricingText(page) {
  return page.evaluate(() => {
    const txt = document.body.innerText || '';
    return txt;
  });
}

async function savePricingSnapshot(page, label) {
  // extrait les cartes de plans visibles
  const data = await page.evaluate(() => {
    const cards = [];
    // heuristique : chercher les éléments contenant "credits/mo" ou "per month"
    const walk = document.querySelectorAll('div,section');
    const seen = new Set();
    for (const el of walk) {
      const t = (el.innerText || '').trim();
      if (!t || t.length > 700 || seen.has(t)) continue;
      if (/credits\/mo|per month|credits for 2 days|per seat/.test(t) && /\$|Free/i.test(t)) {
        // ne garder que les blocs assez petits (cartes)
        if (t.split('\n').length <= 30) {
          seen.add(t);
          cards.push(t);
        }
      }
    }
    return { url: location.href, title: document.title, cards };
  }).catch(() => ({ url: 'erreur', cards: [] }));
  fs.writeFileSync(`${OUT}/pricing-${label}-cards.json`, JSON.stringify(data, null, 1));
  await page.screenshot({ path: `${OUT}/pricing-${label}.png`, fullPage: false });
  console.log(`  [snapshot ${label}] ${data.cards.length} cartes extraites`);
}

// ---------- Main ----------
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const ctx = await chromium.launchPersistentContext(PROFILE, {
    executablePath: '/home/z/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell',
    headless: true,
    viewport: { width: 1440, height: 900 },
    userAgent: UA,
    locale: 'en-US',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
  });
  const page = ctx.pages()[0] || await ctx.newPage();
  attach(page);

  // ===== 1. Pricing page =====
  PHASE = 'pricing-load';
  console.log('1. Ouverture /pricing …');
  await page.goto('https://higgsfield.ai/pricing', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(8000);
  await page.screenshot({ path: `${OUT}/pricing-01-initial.png`, fullPage: false });
  await savePricingSnapshot(page, '01-initial');

  // scroll pour tout charger
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } });
  await sleep(1500);
  await page.screenshot({ path: `${OUT}/pricing-02-full.png`, fullPage: true });

  // ===== 2. Toggle Annual =====
  PHASE = 'pricing-annual';
  try {
    const annualBtn = await page.$('text=Annual');
    if (annualBtn) {
      await annualBtn.click();
      await sleep(3500);
      console.log('2. Toggle Annual cliqué');
      await savePricingSnapshot(page, '03-annual');
    }
  } catch (e) { console.log('  annual toggle err:', e.message); }

  // ===== 3. Retour Monthly + tab Business =====
  PHASE = 'pricing-business';
  try {
    const monthlyBtn = await page.$('text=Monthly');
    if (monthlyBtn) { await monthlyBtn.click(); await sleep(2500); }
    const bizBtn = await page.$('text=Business plans');
    if (bizBtn) {
      await bizBtn.click();
      await sleep(4000);
      console.log('3. Tab Business plans cliqué');
      await savePricingSnapshot(page, '04-business');
      await page.screenshot({ path: `${OUT}/pricing-04-business-full.png`, fullPage: true });
    }
  } catch (e) { console.log('  business tab err:', e.message); }

  // ===== 4. Plan finder =====
  PHASE = 'plan-finder';
  try {
    await page.goto('https://higgsfield.ai/pricing', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await sleep(6000);
    const opt = await page.$('text=Social media videos');
    if (opt) {
      await opt.click(); await sleep(800);
      const qty = await page.$('text=~50 Kling 3.0 videos');
      if (qty) { await qty.click(); await sleep(800); }
      // chercher la recommandation
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } });
      await sleep(2000);
      const rec = await page.evaluate(() => {
        const t = document.body.innerText || '';
        const m = t.match(/We recommend[^\n]*/);
        return m ? m[0] : null;
      });
      console.log('4. Plan finder recommandation:', rec);
      await page.screenshot({ path: `${OUT}/pricing-05-planfinder.png`, fullPage: false });
      fs.writeFileSync(`${OUT}/pricing-05-planfinder-reco.json`, JSON.stringify({ recommendation: rec }, null, 1));
    }
  } catch (e) { console.log('  plan finder err:', e.message); }

  // ===== 5. Checkout-first (clic Get Plan) =====
  PHASE = 'checkout';
  try {
    await page.goto('https://higgsfield.ai/pricing', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await sleep(6000);
    const getBtn = await page.$('text=Get Plus');
    if (getBtn) {
      await getBtn.click();
      await sleep(6000);
      console.log('5. Checkout URL:', page.url());
      await page.screenshot({ path: `${OUT}/checkout-01-plus.png`, fullPage: false });
      const checkoutText = await page.evaluate(() => (document.body.innerText || '').slice(0, 3000));
      fs.writeFileSync(`${OUT}/checkout-01-plus.txt`, checkoutText);
    }
  } catch (e) { console.log('  checkout err:', e.message); }

  // ===== 6. Pages d'achat publiques =====
  PHASE = 'buy-pages';
  for (const path of ['/buy-credits', '/top-up', '/unlimited-models']) {
    try {
      await page.goto(`https://higgsfield.ai${path}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await sleep(5000);
      const url = page.url();
      console.log(`6. ${path} → ${url}`);
      const slug = path.replace(/\//g, '_');
      await page.screenshot({ path: `${OUT}/buypage${slug}.png`, fullPage: false });
      const t = await page.evaluate(() => (document.body.innerText || '').slice(0, 2500));
      fs.writeFileSync(`${OUT}/buypage${slug}.txt`, t);
    } catch (e) { console.log(`  ${path} err:`, e.message); }
  }

  // ===== Sauvegarde =====
  fs.writeFileSync(`${OUT}/net-phase7-events.json`, JSON.stringify({ capturedAt: new Date().toISOString(), totalEvents: events.length, events }, null, 1));
  console.log(`\nTerminé : ${events.length} événements réseau capturés`);

  await ctx.close();
})().catch(e => {
  console.error('FATAL:', e.message);
  fs.writeFileSync(`${OUT}/net-phase7-events.json`, JSON.stringify({ capturedAt: new Date().toISOString(), fatal: e.message, totalEvents: events.length, events }, null, 1));
  process.exit(1);
});
