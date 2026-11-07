// ============================================================
// PHASE 6 — Interception réseau Playwright (session anonyme)
// Capture TOUTES les requêtes/réponses/WebSockets/SSE pendant
// l'usage réel de la plateforme higgsfield.ai
// ============================================================
const { chromium } = require('/home/z/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT = '/home/z/my-project/reverse-higgsfield/07-api-requests/captures';
const PROFILE = '/tmp/hf_user_profile';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// ---------- Génération d'un PNG de test 256x256 (pour tester l'upload) ----------
function makeTestPng(w = 256, h = 256) {
  const crcTable = [];
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcTable[n] = c >>> 0; }
  const crc32 = buf => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB
  const row = Buffer.alloc(1 + w * 3);
  for (let x = 0; x < w; x++) { row[1 + x * 3] = 90; row[2 + x * 3] = 120; row[3 + x * 3] = 160; }
  const raw = Buffer.concat(Array(h).fill(row));
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------- Utilitaires ----------
const SECRET_KEYS = ['cookie', 'authorization', 'x-api-key', 'proxy-authorization'];
function maskValue(v) {
  if (!v) return v;
  const s = String(v);
  if (s.length <= 24) return s[0] + '***';
  return s.slice(0, 20) + `…[+${s.length - 20} chars masqués]`;
}
function tryDecodeJwt(token) {
  try {
    const parts = String(token).split('.');
    if (parts.length !== 3) return null;
    const b64 = s => s.replace(/-/g, '+').replace(/_/g, '/');
    const header = JSON.parse(Buffer.from(b64(parts[0]), 'base64').toString('utf8'));
    const payload = JSON.parse(Buffer.from(b64(parts[1]), 'base64').toString('utf8'));
    return { header, payload };
  } catch { return null; }
}
function cookieNames(headerVal) {
  if (!headerVal) return [];
  return String(headerVal).split(';').map(c => c.trim().split('=')[0]).filter(Boolean);
}

// ---------- État de capture ----------
const events = [];       // requêtes + réponses appariées
const wsEvents = [];     // websockets
const reqMap = new Map();
let evId = 0;
let PHASE = 'init';
const MAX_BODY = 8192;

const SKIP_EXT = /\.(png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf|eot|mp4|webm|mp3|wav|css)(\?|$)/i;

function shouldCapture(req) {
  const url = req.url();
  if (/^(data|blob|chrome|about):/i.test(url)) return false;
  const rt = req.resourceType();
  if (['xhr', 'fetch', 'websocket', 'eventsource'].includes(rt)) return true;
  if (req.method() !== 'GET') return true; // POST/PUT/DELETE toujours
  if (rt === 'document') return true;
  if (SKIP_EXT.test(url)) return false;
  return ['script', 'other'].includes(rt) ? false : true;
}

function attach(page, label) {
  page.on('request', req => {
    try {
      if (!shouldCapture(req)) return;
      const url = req.url();
      const rec = {
        id: ++evId, phase: PHASE, page: label, ts: Date.now(),
        url, method: req.method(), resourceType: req.resourceType(),
        reqHeaders: {}, cookieNames: [], postDataMime: req.postDataBuffer()?.toString('base64') ? null : null,
        postData: null, status: null, respHeaders: null, contentType: null,
        body: null, bodyTruncated: false, failed: null, jwt: [],
      };
      const hdrs = req.headers();
      for (const [k, v] of Object.entries(hdrs)) {
        if (SECRET_KEYS.includes(k)) {
          rec.reqHeaders[k] = maskValue(v);
          if (k === 'cookie') rec.cookieNames = cookieNames(v);
          if (k === 'authorization') {
            const m = String(v).match(/^Bearer\s+(.+)$/i);
            if (m) { const d = tryDecodeJwt(m[1]); if (d) rec.jwt.push({ source: 'authorization', ...d }); }
          }
        } else rec.reqHeaders[k] = v;
      }
      // JWT dans les cookies (Clerk __session / __client)
      const ck = hdrs['cookie'];
      if (ck) {
        for (const pair of String(ck).split(';')) {
          const [name, ...rest] = pair.trim().split('=');
          const val = rest.join('=');
          if (/^(__session|__client|__client_uat)/.test(name)) {
            const d = tryDecodeJwt(val);
            if (d) rec.jwt.push({ source: `cookie:${name}`, ...d });
          }
        }
      }
      const pd = req.postData();
      if (pd) {
        rec.postData = pd.length > MAX_BODY ? pd.slice(0, MAX_BODY) + `\n…[tronqué, ${pd.length} octets]` : pd;
        rec.postDataMime = hdrs['content-type'] || null;
      }
      reqMap.set(req, rec);
      events.push(rec);
    } catch (e) { console.error('req err', e.message); }
  });

  page.on('response', async res => {
    try {
      const rec = reqMap.get(res.request());
      if (!rec) return;
      rec.status = res.status();
      const rh = res.headers();
      rec.respHeaders = {};
      for (const [k, v] of Object.entries(rh)) rec.respHeaders[k] = SECRET_KEYS.includes(k) ? maskValue(v) : v;
      rec.contentType = rh['content-type'] || null;
      const rt = res.request().resourceType();
      const isTextual = /json|text|event-stream|javascript|graphql/i.test(rec.contentType || '');
      if (rt === 'xhr' || rt === 'fetch' || (isTextual && rec.status < 400)) {
        try {
          const buf = await res.body();
          if (buf && buf.length) {
            const b64 = buf.toString('base64');
            rec.bodySize = buf.length;
            if (buf.length <= MAX_BODY && !/\.(mp4|webm|woff2?)(\?|$)/i.test(rec.url)) {
              rec.body = isTextual ? buf.toString('utf8') : `[binaire ${buf.length} octets, base64 tronqué: ${b64.slice(0, 256)}…]`;
            } else {
              rec.body = `[corps de ${buf.length} octets — tronqué] ${(isTextual ? buf.toString('utf8') : b64).slice(0, 512)}…`;
              rec.bodyTruncated = true;
            }
          }
        } catch { /* body indisponible (stream/redirect) */ }
      }
    } catch (e) { console.error('res err', e.message); }
  });

  page.on('requestfailed', req => {
    const rec = reqMap.get(req);
    if (rec) rec.failed = req.failure()?.errorText || 'failed';
  });

  page.on('websocket', ws => {
    const meta = { id: ++evId, phase: PHASE, kind: 'ws-open', url: ws.url(), ts: Date.now(), frames: [] };
    wsEvents.push(meta);
    ws.on('framesent', f => {
      const d = f.payload;
      meta.frames.push({ dir: 'sent', ts: Date.now(), payload: d.length > 2048 ? d.slice(0, 2048) + '…' : d });
      if (meta.frames.length > 400) meta.frames.splice(0, 200);
    });
    ws.on('framereceived', f => {
      const d = f.payload;
      meta.frames.push({ dir: 'recv', ts: Date.now(), payload: d.length > 2048 ? d.slice(0, 2048) + '…' : d });
      if (meta.frames.length > 400) meta.frames.splice(0, 200);
    });
    ws.on('close', () => meta.closedAt = Date.now());
  });
}

const log = m => console.log(`[${new Date().toISOString().slice(11, 19)}] ${m}`);
const save = () => {
  fs.writeFileSync(path.join(OUT, 'net-public-events.json'), JSON.stringify(events, null, 1));
  fs.writeFileSync(path.join(OUT, 'net-public-websockets.json'), JSON.stringify(wsEvents, null, 1));
};

// ---------- Interactions helpers ----------
async function findPromptInput(page) {
  for (const sel of ['div[contenteditable="true"]', 'textarea', '[role="textbox"]']) {
    const loc = page.locator(sel).first();
    try { if (await loc.count() > 0 && await loc.isVisible()) return loc; } catch {}
  }
  return null;
}
async function clickGenerate(page) {
  for (const sel of [
    'button:has-text("Generate")', 'button:has-text("Create")',
    '[data-testid*="generate" i]', 'button[type="submit"]',
  ]) {
    const loc = page.locator(sel).first();
    try { if (await loc.count() > 0 && await loc.isVisible()) { await loc.click({ timeout: 5000 }); return true; } } catch {}
  }
  return false;
}

(async () => {
  fs.writeFileSync(path.join(OUT, 'test-upload.png'), makeTestPng());
  const ctx = await chromium.launchPersistentContext(PROFILE, {
    executablePath: '/home/z/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell',
    headless: true,
    viewport: { width: 1440, height: 900 },
    userAgent: UA,
    locale: 'en-US',
    timezoneId: 'Europe/London',
    args: ['--disable-blink-features=AutomationControlled'],
  });
  ctx.on('page', p => attach(p, 'auto'));
  const page = await ctx.newPage();
  attach(page, 'main');

  const steps = [
    // ---- 1. HOMEPAGE ----
    {
      phase: 'homepage', url: 'https://higgsfield.ai/', settle: 12000,
      shot: 'pub-01-homepage.png',
    },
    // ---- 2. AI/IMAGE : prompt + generate ----
    {
      phase: 'ai-image', url: 'https://higgsfield.ai/ai/image?model=gpt_image_2', settle: 9000,
      shot: 'pub-02-ai-image.png',
      async act(p) {
        const inp = await findPromptInput(p);
        if (inp) {
          await inp.click({ timeout: 8000 }).catch(() => {});
          await inp.fill ? null : null;
          await p.keyboard.type('a majestic golden eagle soaring over snowy mountain peaks at dawn, cinematic lighting, ultra detailed', { delay: 12 });
          await p.screenshot({ path: path.join(OUT, 'pub-03-ai-image-prompt.png') });
          const ok = await clickGenerate(p);
          log(`ai-image generate click: ${ok}`);
          await p.waitForTimeout(14000);
          await p.screenshot({ path: path.join(OUT, 'pub-04-ai-image-after-generate.png') });
        } else log('ai-image: pas d’input prompt trouvé');
      },
    },
    // ---- 3. UPLOAD test sur /ai/image ----
    {
      phase: 'upload-image', url: 'https://higgsfield.ai/ai/image?model=gpt_image_2', settle: 8000,
      async act(p) {
        // chercher tout input file (même caché)
        const inputs = p.locator('input[type="file"]');
        const n = await inputs.count();
        log(`upload: ${n} input[type=file] détectés`);
        for (let i = 0; i < Math.min(n, 4); i++) {
          try {
            await inputs.nth(i).setInputFiles(path.join(OUT, 'test-upload.png'), { timeout: 8000 });
            log(`upload: fichier posé sur input #${i}`);
            await p.waitForTimeout(8000);
            await p.screenshot({ path: path.join(OUT, `pub-05-upload-${i}.png`) });
            return; // un seul suffit s'il a déclenché l'upload
          } catch (e) { log(`upload input #${i}: ${e.message.slice(0, 80)}`); }
        }
      },
    },
    // ---- 4. AI/VIDEO : prompt + generate ----
    {
      phase: 'ai-video', url: 'https://higgsfield.ai/ai/video', settle: 9000,
      async act(p) {
        const inp = await findPromptInput(p);
        if (inp) {
          await inp.click({ timeout: 8000 }).catch(() => {});
          await p.keyboard.type('drone shot flying over a futuristic neon city at night, rain, reflections', { delay: 12 });
          await p.screenshot({ path: path.join(OUT, 'pub-06-ai-video-prompt.png') });
          const ok = await clickGenerate(p);
          log(`ai-video generate click: ${ok}`);
          await p.waitForTimeout(14000);
          await p.screenshot({ path: path.join(OUT, 'pub-07-ai-video-after-generate.png') });
        } else log('ai-video: pas d’input prompt trouvé');
      },
    },
    // ---- 5. CINEMA STUDIO (/generate) ----
    {
      phase: 'cinema-studio', url: 'https://higgsfield.ai/generate', settle: 11000,
      shot: 'pub-08-cinema-studio.png',
    },
    // ---- 6. PRICING + clic plan ----
    {
      phase: 'pricing', url: 'https://higgsfield.ai/pricing', settle: 9000,
      shot: 'pub-09-pricing.png',
      async act(p) {
        for (const sel of ['button:has-text("Get Starter")', 'a:has-text("Get Starter")', 'button:has-text("Get Plus")']) {
          const loc = p.locator(sel).first();
          try {
            if (await loc.count() > 0 && await loc.isVisible()) {
              await loc.click({ timeout: 6000 });
              log(`pricing: clic ${sel}`);
              break;
            }
          } catch {}
        }
        await p.waitForTimeout(9000);
        await p.screenshot({ path: path.join(OUT, 'pub-10-pricing-after-click.png') });
        log(`pricing: URL après clic = ${p.url()}`);
      },
    },
    // ---- 7. COMMUNITY ----
    { phase: 'community', url: 'https://higgsfield.ai/community', settle: 7000, shot: 'pub-11-community.png' },
    // ---- 8. EFFECTS ----
    { phase: 'effects', url: 'https://higgsfield.ai/effects', settle: 7000, shot: 'pub-12-effects.png' },
    // ---- 9. APPS ----
    { phase: 'apps', url: 'https://higgsfield.ai/apps', settle: 7000, shot: 'pub-13-apps.png' },
    // ---- 10. ACADEMY (API /v1/courses etc.) ----
    { phase: 'academy', url: 'https://higgsfield.ai/academy', settle: 7000, shot: 'pub-14-academy.png' },
  ];

  for (const s of steps) {
    PHASE = s.phase;
    log(`▶ ${s.phase} → ${s.url}`);
    try {
      await page.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(s.settle);
      // DataDome interstitial ?
      const title = await page.title().catch(() => '');
      if (/datadome|verify you are human|just a moment/i.test(title)) {
        log(`⚠ interstitial anti-bot détecté ("${title}") — attente 20s`);
        await page.waitForTimeout(20000);
      }
      if (s.shot) await page.screenshot({ path: path.join(OUT, s.shot) });
      if (s.act) await s.act(page);
      save();
    } catch (e) {
      log(`✗ étape ${s.phase}: ${e.message.slice(0, 140)}`);
      await page.screenshot({ path: path.join(OUT, `pub-ERR-${s.phase}.png`) }).catch(() => {});
    }
  }

  PHASE = 'final-wait';
  await page.waitForTimeout(5000);
  save();
  log(`Terminé : ${events.length} requêtes, ${wsEvents.length} websockets`);
  await ctx.close();
})().catch(e => { console.error('FATAL', e); save(); process.exit(1); });
