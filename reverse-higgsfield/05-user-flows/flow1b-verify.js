/**
 * Analyse de l'état "Verify your email" + exploration du flow de vérification
 */
const { chromium } = require('/home/z/.npm-global/lib/node_modules/playwright');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const OUT = '/home/z/my-project/reverse-higgsfield/05-user-flows/captures';
const EMAIL = 'charles.fabou@yahoo.fr';
const PASSWORD = 'U6B9iGs+quVj/79';

(async () => {
  const browser = await chromium.launchPersistentContext('/tmp/hf_user_profile', {
    headless: true,
    executablePath: '/home/z/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell',
    viewport: { width: 1440, height: 900 },
    userAgent: UA,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-blink-features=AutomationControlled'],
    locale: 'en-US',
  });
  const page = browser.pages()[0] || await browser.newPage();
  const log = (m) => console.log(`[${new Date().toISOString().substring(11, 19)}] ${m}`);
  const dismissCookies = async () => {
    try {
      await page.evaluate(() => { document.querySelector('.cc-window, [aria-label="cookieconsent"]')?.remove(); });
    } catch (e) {}
  };

  try {
    // Reprendre le flow jusqu'à l'étape vérification
    log('Navigation sign-in');
    await page.goto('https://higgsfield.ai/auth/sign-in', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(8000);
    await dismissCookies();
    const emailInput = page.locator('input[name="email"]:visible').last();
    await emailInput.click({ timeout: 10000 });
    await emailInput.pressSequentially(EMAIL, { delay: 25, timeout: 20000 });
    await page.waitForTimeout(800);
    await page.locator('button:text-is("Continue"):visible').last().click({ timeout: 10000 });
    await page.waitForTimeout(6000);
    await dismissCookies();
    const pwdInput = page.locator('input[type="password"]:visible').last();
    await pwdInput.click({ timeout: 10000 });
    await pwdInput.pressSequentially(PASSWORD, { delay: 15, timeout: 20000 });
    await page.waitForTimeout(500);
    await pwdInput.press('Enter');
    await page.waitForTimeout(8000);

    // ÉTAT : page de vérification — analyse exhaustive
    log('URL: ' + page.url());
    await page.screenshot({ path: `${OUT}/flow1-10-verify-email-state.png` });
    const verifyState = await page.evaluate(() => {
      const inputs = [...document.querySelectorAll('input')].filter(i => i.offsetParent !== null).map(i => ({ type: i.type, name: i.name, placeholder: i.placeholder, inputmode: i.inputmode, maxLength: i.maxLength }));
      const buttons = [...document.querySelectorAll('button, a')].filter(b => b.offsetParent !== null).map(b => ({ tag: b.tagName, text: (b.textContent || '').trim().substring(0, 50) })).filter(b => b.text).slice(0, 25);
      return { url: location.href, title: document.title, inputs, buttons, bodyText: document.body.innerText.substring(0, 1500) };
    });
    fs.writeFileSync(`${OUT}/flow1-11-verify-state.json`, JSON.stringify(verifyState, null, 2));
    log('VERIFY STATE: ' + JSON.stringify(verifyState).substring(0, 1500));

    // Capturer les requêtes réseau de vérification (un resend déclencherait un email — on NE le fait PAS)
    // À la place : capturer la structure complète pour la doc
    log('État de vérification capturé (sans resend pour ne pas spammer la mailbox)');

  } catch (e) {
    log('ERREUR: ' + e.message);
    await page.screenshot({ path: `${OUT}/flow1-verify-error.png` }).catch(() => {});
  }
  await browser.close();
  log('Terminé');
})();
