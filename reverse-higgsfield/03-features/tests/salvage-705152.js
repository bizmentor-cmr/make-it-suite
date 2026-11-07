/**
 * SALVAGE — Tente de compléter l'ancienne tentative 2FA avec le code 705152
 * (profil du compte réel). 2 stratégies : reprise UI si l'écran code est restauré,
 * sinon appel direct attempt_second_factor.
 */
const { chromium } = require('/home/z/.npm-global/lib/node_modules/playwright');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const PROFILE = '/home/z/my-project/.hf-phase9-profile';
const OUT = '/home/z/my-project/reverse-higgsfield/03-features/tests/captures';
const CODE = '705152';
const SIA = 'sia_3LYAGbj98q2IUdafpOeBqSwsf34';
const log = (m) => console.log(`[${new Date().toISOString().substring(11, 19)}] ${m}`);

(async () => {
  const browser = await chromium.launchPersistentContext(PROFILE, {
    headless: true,
    executablePath: '/home/z/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell',
    viewport: { width: 1440, height: 900 },
    userAgent: UA,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    locale: 'en-US', timezoneId: 'Europe/London',
  });
  const page = browser.pages()[0] || await browser.newPage();
  const cookies = await browser.cookies('https://higgsfield.ai');
  const client = cookies.find(c => c.name === '__client');
  log('__client: ' + (client ? `PRÉSENT (${client.value.length} chars)` : 'ABSENT — salvage impossible'));
  const result = { hasClient: !!client, strategy: null };

  try {
    if (client) {
      await page.goto('https://higgsfield.ai/auth/email/sign-in', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(7000);
      const codeField = page.locator('input[name="code"]:visible, input[autocomplete="one-time-code"]:visible').first();
      if ((await codeField.count()) > 0) {
        // Stratégie 1 : UI restaurée
        result.strategy = 'ui-resume';
        log('écran code restauré — saisie UI');
        await codeField.click({ timeout: 8000 });
        await codeField.pressSequentially(CODE, { delay: 40, timeout: 15000 });
        await codeField.press('Enter', { timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(15000);
      } else {
        // Stratégie 2 : appel direct API
        result.strategy = 'direct-api';
        log('pas d\'écran code — appel direct attempt_second_factor');
        result.attempt = await page.evaluate(async ({ sia, code }) => {
          const params = new URLSearchParams();
          params.append('strategy', 'email_code');
          params.append('code', code);
          try {
            const r = await fetch(`/_clerk/v1/client/sign_ins/${sia}/attempt_second_factor?__clerk_api_version=2026-08-20&_clerk_js_version=6.42.0`, {
              method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: params.toString(), credentials: 'include',
            });
            return { status: r.status, body: (await r.text()).substring(0, 1200) };
          } catch (e) { return { status: 0, body: e.message }; }
        }, { sia: SIA, code: CODE });
        log('attempt: ' + result.attempt.status + ' :: ' + result.attempt.body.substring(0, 250));
        await page.waitForTimeout(3000);
      }
      const authed = !/\/auth|\/login/.test(page.url());
      result.authedAfter = authed;
      result.urlAfter = page.url();
      if (authed) {
        await page.goto('https://higgsfield.ai/generate', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(10000);
        await page.screenshot({ path: `${OUT}/p9-salvage-logged-in.png` });
        result.state = await page.evaluate(() => ({
          url: location.href,
          credits: (document.body.innerText.match(/(\d[\d,\.]*)\s*(?:\/\s*\d[\d,\.]*)?\s*credits?/i) || [])[0] || null,
          bodySnippet: document.body.innerText.replace(/\s+/g, ' ').substring(0, 300),
        }));
        log('🎉 SALVAGE RÉUSSI — ' + JSON.stringify(result.state).substring(0, 200));
      }
    }
  } catch (e) {
    log('ERREUR: ' + e.message);
    result.error = e.message;
  }
  fs.writeFileSync(`${OUT}/p9-salvage-result.json`, JSON.stringify(result, null, 2));
  await browser.close();
  log('salvage terminé: ' + (result.authedAfter ? 'CONNECTÉ' : 'échec'));
})();
