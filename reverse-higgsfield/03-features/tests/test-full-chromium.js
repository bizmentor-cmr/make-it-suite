/** TEST — Chromium complet headful sous Xvfb (survit-il ?) */
const { chromium } = require('/home/z/.npm-global/lib/node_modules/playwright');
const log = (m) => console.log(`[${new Date().toISOString().substring(11, 19)}] ${m}`);

(async () => {
  log('lancement Chromium complet headful…');
  const browser = await chromium.launch({
    headless: false,
    executablePath: '/home/z/.cache/ms-playwright/chromium-1200/chrome-linux64/chrome',
    viewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--disable-software-rasterizer', '--disable-blink-features=AutomationControlled', '--window-size=1440,900'],
  });
  log('✔ navigateur lancé');
  const page = await browser.newPage();
  await page.goto('https://higgsfield.ai/auth/sign-up', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(8000);
  await page.screenshot({ path: '/tmp/test-full-chromium.png' });
  log('✔ screenshot pris — titre: ' + (await page.title()));
  // vérifier les marqueurs headless
  const markers = await page.evaluate(() => ({
    webdriver: navigator.webdriver,
    ua: navigator.userAgent.substring(0, 90),
    plugins: navigator.plugins.length,
    languages: navigator.languages.join(','),
  }));
  log('marqueurs: ' + JSON.stringify(markers));
  await browser.close();
  log('✔ test complet — le shell survit');
})().catch(e => { log('ERREUR: ' + e.message); process.exit(1); });
