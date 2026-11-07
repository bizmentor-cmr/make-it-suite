/**
 * Inspecteur : cookies du profil persistant + test direct API Clerk
 * Tente attempt_second_factor sur l'ANCIEN sia_id avec le code fourni.
 * Usage: node try-direct-code.js <CODE> <SIA_ID>
 */
const { chromium } = require('/home/z/.npm-global/lib/node_modules/playwright');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const PROFILE_DIR = '/home/z/my-project/.hf-phase9-profile';
const OUT = '/home/z/my-project/reverse-higgsfield/03-features/tests/captures';
const log = (m) => console.log(`[${new Date().toISOString().substring(11, 19)}] ${m}`);

(async () => {
  const CODE = process.argv[2] || '';
  const SIA = process.argv[3] || '';
  if (!CODE || !SIA) { log('usage: node try-direct-code.js <CODE> <SIA_ID>'); process.exit(1); }

  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: true,
    executablePath: '/home/z/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell',
    viewport: { width: 1440, height: 900 },
    userAgent: UA,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    locale: 'en-US', timezoneId: 'Europe/London',
  });
  const page = browser.pages()[0] || await browser.newPage();

  // Capturer tout protect token qui passe (dans les bodies POST)
  let protectToken = null;
  await page.route('**/*', async (route) => {
    const req = route.request();
    const body = req.postData() || '';
    const m = body.match(/__clerk_protect_token=([^&]+)/);
    if (m) protectToken = decodeURIComponent(m[1]);
    await route.continue();
  });

  await page.goto('https://higgsfield.ai/auth/sign-in', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(8000);

  // ── 1. Cookies du profil
  const cookies = await browser.cookies('https://higgsfield.ai');
  const cookieReport = cookies.map(c => ({ name: c.name, valuePreview: c.value.substring(0, 60), valueLen: c.value.length, domain: c.domain, path: c.path, expires: c.expires > 0 ? new Date(c.expires * 1000).toISOString() : 'session' }));
  fs.writeFileSync(`${OUT}/p9-direct-cookies.json`, JSON.stringify(cookieReport, null, 2));
  log('COOKIES: ' + JSON.stringify(cookieReport.map(c => c.name)));

  // Le protect token existe-t-il en cookie ?
  const ptCookie = cookies.find(c => c.name.includes('protect'));
  if (ptCookie) { protectToken = ptCookie.value; log('protect token trouvé en cookie'); }

  // ── 2. Test direct : attempt_second_factor sur l'ancien sia
  log('TEST DIRECT: attempt_second_factor sur ' + SIA);
  const attemptDirect = async (token) => {
    return page.evaluate(async ({ sia, code, token }) => {
      const params = new URLSearchParams();
      params.append('strategy', 'email_code');
      params.append('code', code);
      if (token) params.append('__clerk_protect_token', token);
      try {
        const res = await fetch(`/_clerk/v1/client/sign_ins/${sia}/attempt_second_factor?__clerk_api_version=2026-08-20&_clerk_js_version=6.42.0`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
          credentials: 'include',
        });
        const text = await res.text();
        return { status: res.status, body: text.substring(0, 800) };
      } catch (e) { return { status: 0, body: e.message }; }
    }, { sia, code, token });
  };

  let result = await attemptDirect(protectToken);
  log('RÉSULTAT (avec token ' + (protectToken ? 'récupéré' : 'ABSENT') + '): status=' + result.status);
  log('BODY: ' + result.body.substring(0, 500));

  // Si erreur de protection → retenter SANS token ou avec un 2e passage
  if (result.status !== 200) {
    log('RETRY sans token…');
    result = await attemptDirect(null);
    log('RÉSULTAT 2: status=' + result.status + ' body=' + result.body.substring(0, 300));
  }

  fs.writeFileSync(`${OUT}/p9-direct-attempt.json`, JSON.stringify(result, null, 2));

  if (result.status === 200) {
    log('🎉 CODE ACCEPTÉ — vérifions la session…');
    await page.goto('https://higgsfield.ai/generate', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(10000);
    await page.screenshot({ path: `${OUT}/p9-direct-after-login.png`, fullPage: false });
    const state = await page.evaluate(() => ({
      url: location.href,
      credits: (document.body.innerText.match(/(\d[\d,\.]*)\s*(?:\/\s*\d[\d,\.]*)?\s*credits?/i) || [])[0] || null,
      bodySnippet: document.body.innerText.replace(/\s+/g, ' ').substring(0, 500),
    }));
    fs.writeFileSync(`${OUT}/p9-direct-state.json`, JSON.stringify(state, null, 2));
    log('URL: ' + state.url + ' | CREDITS: ' + state.credits);
  }

  await browser.close();
  log('Terminé');
})();
