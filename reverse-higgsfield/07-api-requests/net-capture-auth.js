// ============================================================
// PHASE 6 — Flux AUTHENTIFIÉ (login réel → gate OTP 2FA)
// + Test UPLOAD via filechooser + Structure du Bearer anonyme
// ============================================================
const { chromium } = require('/home/z/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT = '/home/z/my-project/reverse-higgsfield/07-api-requests/captures';
const PROFILE = '/tmp/hf_user_profile';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const EMAIL = process.env.HF_EMAIL;
const PASSWORD = process.env.HF_PASS;

if (!EMAIL || !PASSWORD) { console.error('⚠ HF_EMAIL et HF_PASS requis (variables d’environnement)'); process.exit(1); }

const SECRET_KEYS = ['cookie', 'authorization', 'x-api-key', 'proxy-authorization'];
function maskValue(v) { const s = String(v); return s.length <= 24 ? s[0] + '***' : s.slice(0, 20) + `…[+${s.length - 20}]`; }
function tryDecodeJwt(t) {
  try {
    const p = String(t).split('.'); if (p.length !== 3) return null;
    const b = s => s.replace(/-/g, '+').replace(/_/g, '/');
    return { header: JSON.parse(Buffer.from(b(p[0]), 'base64').toString('utf8')),
             payload: JSON.parse(Buffer.from(b(p[1]), 'base64').toString('utf8')) };
  } catch { return null; }
}

const events = []; const wsEvents = []; const bearerAnalysis = [];
const reqMap = new Map(); let evId = 0; let PHASE = 'init';
const MAX_BODY = 8192;
const SKIP_EXT = /\.(png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf|eot|mp4|webm|mp3|wav|css)(\?|$)/i;

function shouldCapture(req) {
  const url = req.url();
  if (/^(data|blob|chrome|about):/i.test(url)) return false;
  const rt = req.resourceType();
  if (['xhr', 'fetch', 'websocket', 'eventsource'].includes(rt)) return true;
  if (req.method() !== 'GET') return true;
  if (rt === 'document') return true;
  if (SKIP_EXT.test(url)) return false;
  return false;
}

function attach(page) {
  page.on('request', req => {
    try {
      if (!shouldCapture(req)) return;
      const rec = { id: ++evId, phase: PHASE, ts: Date.now(), url: req.url(), method: req.method(),
        resourceType: req.resourceType(), reqHeaders: {}, cookieNames: [], postData: null,
        status: null, respHeaders: null, contentType: null, body: null, bodyTruncated: false, failed: null, jwt: [] };
      const hdrs = req.headers();
      for (const [k, v] of Object.entries(hdrs)) {
        if (SECRET_KEYS.includes(k)) {
          rec.reqHeaders[k] = maskValue(v);
          if (k === 'authorization') {
            // analyse structurelle SANS exposer la valeur complète
            const m = String(v).match(/^Bearer\s+(.+)$/i);
            if (m) {
              const tok = m[1];
              const dec = tryDecodeJwt(tok);
              bearerAnalysis.push({
                phase: PHASE, url: req.url().slice(0, 90),
                tokenLength: tok.length,
                isJwt: !!dec,
                prefix: tok.slice(0, 6),
                charset: /[a-zA-Z0-9_-]+/.test(tok) ? 'base64url/alnum' : 'autre',
                decoded: dec,
              });
              if (dec) rec.jwt.push({ source: 'authorization', ...dec });
            }
          }
        } else rec.reqHeaders[k] = v;
      }
      const pd = req.postData();
      if (pd) rec.postData = pd.length > MAX_BODY ? pd.slice(0, MAX_BODY) + '…[tronqué]' : pd;
      reqMap.set(req, rec); events.push(rec);
    } catch (e) { console.error('req err', e.message); }
  });
  page.on('response', async res => {
    try {
      const rec = reqMap.get(res.request()); if (!rec) return;
      rec.status = res.status();
      rec.respHeaders = res.headers(); rec.contentType = res.headers()['content-type'] || null;
      const rt = res.request().resourceType();
      if (rt === 'xhr' || rt === 'fetch' || /json|text|event-stream/i.test(rec.contentType || '')) {
        try {
          const buf = await res.body();
          if (buf && buf.length <= MAX_BODY) {
            rec.body = /json|text|javascript/i.test(rec.contentType || '') ? buf.toString('utf8') : `[binaire ${buf.length}o]`;
          } else if (buf) { rec.body = `[${buf.length}o tronqué] ` + buf.toString('utf8').slice(0, 400); rec.bodyTruncated = true; }
        } catch {}
      }
    } catch (e) { console.error('res err', e.message); }
  });
  page.on('websocket', ws => {
    const meta = { phase: PHASE, url: ws.url(), frames: [] };
    wsEvents.push(meta);
    ws.on('framesent', f => meta.frames.push({ dir: 'sent', payload: String(f.payload).slice(0, 1024) }));
    ws.on('framereceived', f => meta.frames.push({ dir: 'recv', payload: String(f.payload).slice(0, 1024) }));
    ws.on('close', () => meta.closed = true);
  });
}

const log = m => console.log(`[${new Date().toISOString().slice(11, 19)}] ${m}`);
const save = () => {
  fs.writeFileSync(path.join(OUT, 'net-auth-events.json'), JSON.stringify(events, null, 1));
  fs.writeFileSync(path.join(OUT, 'net-auth-websockets.json'), JSON.stringify(wsEvents, null, 1));
  fs.writeFileSync(path.join(OUT, 'bearer-analysis.json'), JSON.stringify(bearerAnalysis, null, 1));
};

(async () => {
  const ctx = await chromium.launchPersistentContext(PROFILE, {
    executablePath: '/home/z/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell',
    headless: true, viewport: { width: 1440, height: 900 }, userAgent: UA, locale: 'en-US',
  });
  const page = await ctx.newPage();
  attach(page); // un seul attach cette fois

  // ============ 1. LOGIN FLOW ============
  PHASE = 'login-start';
  log('▶ ouverture /auth/email/sign-in');
  await page.goto('https://higgsfield.ai/auth/email/sign-in', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(8000);
  await page.screenshot({ path: path.join(OUT, 'auth-01-login-page.png') });

  PHASE = 'login-email';
  const emailInput = page.locator('input[name="email"]:visible').last();
  if (await emailInput.count() > 0) {
    await emailInput.click({ timeout: 10000 });
    await emailInput.pressSequentially(EMAIL, { delay: 20, timeout: 20000 });
    await page.waitForTimeout(800);
    const contBtn = page.locator('button:text-is("Continue"):visible').last();
    if (await contBtn.count() > 0) await contBtn.click({ timeout: 10000 });
    log('▶ email soumis');
    await page.waitForTimeout(8000);
    await page.screenshot({ path: path.join(OUT, 'auth-02-after-email.png') });
  } else log('⚠ pas de champ email visible');

  PHASE = 'login-password';
  const pwdInput = page.locator('input[type="password"]:visible').last();
  if (await pwdInput.count() > 0) {
    await pwdInput.click({ timeout: 10000 }).catch(() => {});
    await pwdInput.pressSequentially(PASSWORD, { delay: 15, timeout: 20000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, 'auth-03-password-filled.png') });
    await pwdInput.press('Enter').catch(() => {});
    await page.waitForTimeout(3000);
    if (page.url().includes('/auth/email/sign-in')) {
      const loginBtn = page.locator('button', { hasText: /^Log in$/ }).last();
      try { if (await loginBtn.count() > 0) await loginBtn.click({ timeout: 8000 }); } catch {}
    }
    log('▶ password soumis — attente réponse');
    await page.waitForTimeout(15000);
    await page.screenshot({ path: path.join(OUT, 'auth-04-after-password.png') });
    log(`URL après password: ${page.url()}`);
  } else { log('⚠ pas de champ password visible'); await page.screenshot({ path: path.join(OUT, 'auth-03-no-password.png') }); }

  PHASE = 'login-otp-gate';
  // Capturer le polling/état à l'écran OTP
  await page.waitForTimeout(12000);
  await page.screenshot({ path: path.join(OUT, 'auth-05-otp-gate.png') });
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 400)).catch(() => '');
  log(`État OTP: ${page.url()} — "${bodyText.replace(/\n/g, ' ').slice(0, 150)}"`);
  save();

  // ============ 2. UPLOAD TEST (filechooser) ============
  for (const [phase, url, shotPrefix] of [
    ['upload-ai-image', 'https://higgsfield.ai/ai/image?model=gpt_image_2', 'auth-06-upload-image'],
    ['upload-generate', 'https://higgsfield.ai/generate', 'auth-07-upload-generate'],
  ]) {
    PHASE = phase;
    log(`▶ test upload sur ${url}`);
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(9000);
      // candidats boutons d'upload
      const candidates = [
        '[aria-label*="upload" i]', 'button:has-text("Upload")', '[data-testid*="upload" i]',
        'button[title*="image" i]', 'button:has-text("Add image")', 'button:has-text("Image")',
        '[aria-label*="add" i]', '[aria-label*="image" i]',
      ];
      let done = false;
      for (const sel of candidates) {
        const loc = page.locator(sel).first();
        try {
          if (await loc.count() > 0 && await loc.isVisible()) {
            const fcPromise = page.waitForEvent('filechooser', { timeout: 5000 }).catch(() => null);
            await loc.click({ timeout: 4000 });
            const fc = await fcPromise;
            if (fc) {
              await fc.setFiles(path.join(OUT, 'test-upload.png'));
              log(`  ✓ upload déclenché via "${sel}"`);
              await page.waitForTimeout(10000); // laisser le protocole multipart se dérouler
              await page.screenshot({ path: path.join(OUT, `${shotPrefix}.png`) });
              done = true; break;
            }
          }
        } catch {}
      }
      if (!done) log('  ✗ aucun déclencheur d’upload trouvé');
      save();
    } catch (e) { log(`✗ ${phase}: ${e.message.slice(0, 100)}`); }
  }

  PHASE = 'final';
  await page.waitForTimeout(5000);
  save();
  log(`Terminé : ${events.length} requêtes, ${wsEvents.length} WS`);
  log(`Bearer analysés: ${bearerAnalysis.length} (structure seulement, valeurs non exposées)`);
  await ctx.close();
})().catch(e => { console.error('FATAL', e); save(); process.exit(1); });
