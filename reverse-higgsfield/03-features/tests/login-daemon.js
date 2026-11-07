/**
 * LOGIN DAEMON — Login complet SANS fermer le navigateur entre 2FA et code.
 * 1. email + password → écran 2FA (nouveau code envoyé automatiquement)
 * 2. écrit status WAITING_FOR_CODE + attend le code dans .hf-phase9-code.txt
 * 3. saisit le code → session → dump état complet + cookies
 * Status dans .hf-phase9-status.json : RUNNING / WAITING_FOR_CODE / DONE / FAILED
 */
const { launch, dismissCookies, watchAuth, domInfo, log, OUT, EMAIL, PASSWORD, PROFILE_DIR } = require('./hf-common');
const fs = require('fs');

const ROOT = '/home/z/my-project';
const CODE_FILE = `${ROOT}/.hf-phase9-code.txt`;
const STATUS_FILE = `${ROOT}/.hf-phase9-status.json`;
const writeStatus = (s, extra) => fs.writeFileSync(STATUS_FILE, JSON.stringify({ status: s, t: new Date().toISOString(), ...extra }, null, 2));

(async () => {
  writeStatus('RUNNING', { step: 'start' });
  const { browser, page } = await launch();
  const authNet = [];
  watchAuth(page, authNet);

  try {
    // ── Email
    log('DAEMON: page login');
    await page.goto('https://higgsfield.ai/auth/sign-in', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(9000);
    await dismissCookies(page);
    const emailInput = page.locator('input[name="email"]:visible').last();
    if ((await emailInput.count()) === 0) throw new Error('champ email introuvable');
    await emailInput.click({ timeout: 10000 });
    await emailInput.pressSequentially(EMAIL, { delay: 25, timeout: 20000 });
    await page.waitForTimeout(800);
    const contBtn = page.locator('button:text-is("Continue"):visible').last();
    if ((await contBtn.count()) > 0) await contBtn.click({ timeout: 10000 });
    else await emailInput.press('Enter');
    await page.waitForTimeout(8000);
    await dismissCookies(page);
    log('après email: ' + page.url().substring(0, 100));

    // ── Password
    const pwdInput = page.locator('input[type="password"]:visible').last();
    if ((await pwdInput.count()) === 0) throw new Error('champ password introuvable après email');
    await pwdInput.click({ timeout: 10000 }).catch(() => {});
    await pwdInput.pressSequentially(PASSWORD, { delay: 15, timeout: 20000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/p9d-01-password.png` });
    await pwdInput.press('Enter', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(2500);
    if (page.url().includes('/auth/email/sign-in')) {
      const loginBtn = page.locator('button', { hasText: /^Log in$/ }).last();
      const alt = page.locator('button:visible', { hasText: /log ?in/i }).last();
      try {
        if ((await loginBtn.count()) > 0) await loginBtn.click({ timeout: 8000 });
        else if ((await alt.count()) > 0) await alt.click({ timeout: 8000 });
      } catch (e) { log('err clic login: ' + e.message.substring(0, 60)); }
    }

    // ── Attendre l'écran 2FA (champ code)
    log('attente écran 2FA…');
    let codeField = null;
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(2000);
      codeField = page.locator('input[name="code"]:visible, input[autocomplete="one-time-code"]:visible').first();
      if ((await codeField.count()) > 0) break;
      if (!page.url().includes('/auth')) break; // peut-être déjà connecté
    }
    await dismissCookies(page);
    await page.screenshot({ path: `${OUT}/p9d-02-2fa-screen.png` });
    log('URL: ' + page.url());

    if ((await codeField.count()) > 0 && page.url().includes('/auth')) {
      // confirmer que le code a bien été envoyé (prepare_second_factor dans le réseau)
      const sent = authNet.some(e => e.url.includes('prepare_second_factor') && e.dir === 'RES');
      log('2FA screen OK — code envoyé: ' + sent);
      writeStatus('WAITING_FOR_CODE', { codeSent: sent, url: page.url() });

      // ── Attendre le code dans le fichier (max 25 min)
      let code = null;
      const deadline = Date.now() + 25 * 60 * 1000;
      while (Date.now() < deadline) {
        await page.waitForTimeout(2000);
        try {
          const c = (fs.readFileSync(CODE_FILE, 'utf8') || '').trim();
          if (/^\d{6}$/.test(c)) { code = c; fs.writeFileSync(CODE_FILE, ''); break; }
        } catch (e) { /* fichier pas encore là */ }
        // rafraîchir la page toutes les 3 min pour garder l'attempt vivant ? NON — risque de perdre l'état. L'attempt vit ~72 min.
      }
      if (!code) throw new Error('timeout attente code (25 min)');

      log('CODE REÇU: ' + code);
      writeStatus('SUBMITTING_CODE', { code });
      await codeField.click({ timeout: 8000 });
      await codeField.pressSequentially(code, { delay: 40, timeout: 15000 });
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}/p9d-03-code-filled.png` });
      await codeField.press('Enter', { timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(4000);
      const vBtn = page.locator('button:visible', { hasText: /^(verify|continue|submit|log ?in)$/i }).first();
      if (page.url().includes('/auth') && (await vBtn.count()) > 0) {
        try { await vBtn.click({ timeout: 6000 }); } catch (e) { }
      }
    } else if (!page.url().includes('/auth')) {
      log('déjà connecté sans 2FA ?');
    } else {
      throw new Error('écran 2FA non atteint — url=' + page.url());
    }

    // ── Attendre la redirection hors /auth
    log('attente redirection…');
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(2000);
      if (!page.url().includes('/auth') && !page.url().includes('/login')) break;
    }
    await dismissCookies(page);
    await page.waitForTimeout(6000);
    await page.screenshot({ path: `${OUT}/p9d-04-after-login.png` });
    log('URL FINALE: ' + page.url());

    // ── Dump état complet + cookies
    const full = await page.evaluate(() => {
      const nav = [...document.querySelectorAll('nav a, aside a, [role="navigation"] a')].map(a => ({ text: (a.textContent || '').trim().substring(0, 35), href: (a.getAttribute('href') || '').substring(0, 70) })).filter(l => l.text && l.href).slice(0, 60);
      const credits = (document.body.innerText.match(/(\d[\d,\.]*)\s*(?:\/\s*\d[\d,\.]*)?\s*credits?/i) || [])[0] || null;
      const btns = [...document.querySelectorAll('button')].filter(b => b.offsetParent !== null).map(b => (b.textContent || '').trim().substring(0, 40)).filter(Boolean);
      return { url: location.href, title: document.title, nav, credits, buttons: btns.slice(0, 50), bodyText: document.body.innerText.replace(/\s+/g, ' ').substring(0, 1500) };
    });
    const cookies = await browser.cookies('https://higgsfield.ai');
    const cookieNames = cookies.map(c => ({ name: c.name, persistent: c.expires > 0, expires: c.expires > 0 ? new Date(c.expires * 1000).toISOString() : 'session', len: c.value.length }));
    const loggedIn = !/\/auth|\/login/.test(page.url());
    fs.writeFileSync(`${OUT}/p9d-05-final-state.json`, JSON.stringify({ loggedIn, ...full, cookies: cookieNames }, null, 2));
    fs.writeFileSync(`${OUT}/p9d-auth-net.json`, JSON.stringify(authNet, null, 2));
    log(`LOGGED IN: ${loggedIn} | CREDITS: ${full.credits}`);
    log('NAV(15): ' + JSON.stringify(full.nav.slice(0, 15)));
    log('COOKIES: ' + JSON.stringify(cookieNames));
    writeStatus(loggedIn ? 'DONE' : 'FAILED', { url: page.url(), credits: full.credits });
  } catch (e) {
    log('ERREUR: ' + e.message);
    await page.screenshot({ path: `${OUT}/p9d-error.png` }).catch(() => {});
    writeStatus('FAILED', { error: e.message });
  }
  await browser.close();
  log('daemon terminé');
})();
