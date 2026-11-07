/**
 * PHASE 9 — LOGIN ÉTAPE 1 : email + mot de passe → gate 2FA
 * Atteint l'écran "code envoyé par email" puis s'arrête proprement.
 * Le profil persistant conserve l'état Clerk (sia_id) pour l'étape 2.
 * Sortie : captures/p9-login-*.png + auth-net.json
 */
const { launch, dismissCookies, watchAuth, domInfo, log, OUT, EMAIL, PASSWORD } = require('./hf-common');
const fs = require('fs');

(async () => {
  const { browser, page } = await launch();
  const authNet = [];
  watchAuth(page, authNet);

  try {
    // ── Page login directe
    log('NAV: page login');
    await page.goto('https://higgsfield.ai/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(9000);
    await dismissCookies(page);
    await page.screenshot({ path: `${OUT}/p9-login-01-page.png` });

    let info = await domInfo(page);
    log('ÉTAT: ' + JSON.stringify({ url: info.url, headings: info.headings, nInputs: info.inputs.filter(i => i.visible).length }));

    // ── Saisie email
    const emailInput = page.locator('input[name="email"]:visible').last();
    if ((await emailInput.count()) === 0) {
      log('⚠️ pas de champ email visible — dump');
      fs.writeFileSync(`${OUT}/p9-login-01-nomail.json`, JSON.stringify(info, null, 2));
      throw new Error('champ email introuvable');
    }
    await emailInput.click({ timeout: 10000 });
    await emailInput.pressSequentially(EMAIL, { delay: 25, timeout: 20000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/p9-login-02-email.png` });

    // Submit email : bouton "Continue" visible sinon submit du form
    const contBtn = page.locator('button:text-is("Continue"):visible').last();
    const formBtn = emailInput.locator('xpath=ancestor::form[1]').locator('button[type="submit"]:visible').last();
    if ((await contBtn.count()) > 0) { await contBtn.click({ timeout: 10000 }); log('clic Continue (email)'); }
    else if ((await formBtn.count()) > 0) { await formBtn.click({ timeout: 10000 }); log('clic submit form (email)'); }
    else { await emailInput.press('Enter'); log('Enter (email)'); }
    await page.waitForTimeout(8000);
    await dismissCookies(page);
    await page.screenshot({ path: `${OUT}/p9-login-03-after-email.png` });
    log('URL après email: ' + page.url().substring(0, 120));

    // ── Saisie mot de passe
    const pwdInput = page.locator('input[type="password"]:visible').last();
    if ((await pwdInput.count()) === 0) {
      log('⚠️ pas de champ password visible');
      info = await domInfo(page);
      fs.writeFileSync(`${OUT}/p9-login-03-nopwd.json`, JSON.stringify(info, null, 2));
    } else {
      await pwdInput.click({ timeout: 10000 }).catch(() => {});
      await pwdInput.pressSequentially(PASSWORD, { delay: 15, timeout: 20000 });
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}/p9-login-04-password.png` });
      await pwdInput.press('Enter', { timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(2500);
      if (page.url().includes('/auth/email/sign-in')) {
        const loginBtn = page.locator('button', { hasText: /^Log in$/ }).last();
        const alt = page.locator('button:visible', { hasText: /log ?in/i }).last();
        try {
          if ((await loginBtn.count()) > 0) { await loginBtn.click({ timeout: 8000 }); log('clic bouton "Log in"'); }
          else if ((await alt.count()) > 0) { await alt.click({ timeout: 8000 }); log('clic bouton login (regex)'); }
        } catch (e) { log('err clic login: ' + e.message.substring(0, 60)); }
      }
      // attendre la transition (2FA ou dashboard)
      await page.waitForTimeout(20000);
      await dismissCookies(page);
      await page.screenshot({ path: `${OUT}/p9-login-05-after-password.png` });
      log('URL après password: ' + page.url().substring(0, 120));

      // ── Détection état : 2FA ? erreur ? dashboard ?
      info = await domInfo(page);
      fs.writeFileSync(`${OUT}/p9-login-05-state.json`, JSON.stringify(info, null, 2));
      const body = info.bodySnippet.toLowerCase();
      const otpInputs = info.inputs.filter(i => i.visible && (i.type === 'text' || i.type === 'number' || i.autocomplete === 'one-time-code'));
      const is2FA = /code|verif|two.factor|2fa|six.digit|enter the code/i.test(body) || info.inputs.some(i => i.visible && (i.name === 'code' || i.autocomplete === 'one-time-code'));
      const isErr = /(incorrect|invalid|error|failed|wrong|too many|locked)/i.test(body);
      log(`ANALYSE: is2FA=${is2FA} isErr=${isErr} url=${info.url.substring(0, 100)}`);
      log('HEADINGS: ' + JSON.stringify(info.headings));
      log('BOUTONS: ' + JSON.stringify(info.buttons.slice(0, 12)));
      log('INPUTS visibles: ' + JSON.stringify(info.inputs.filter(i => i.visible)));

      if (is2FA) {
        log('🎯 GATE 2FA ATTEINT — le code email a été envoyé (ou bouton resend disponible)');
        // Si un bouton "Send code" explicite existe (envoi non automatique), le cliquer
        const sendBtn = page.locator('button:visible', { hasText: /send|resend|email me/i }).first();
        const alreadySent = authNet.some(e => e.url.includes('prepare_second_factor'));
        if (!alreadySent && (await sendBtn.count()) > 0) {
          try { await sendBtn.click({ timeout: 6000 }); log('clic bouton send-code'); await page.waitForTimeout(5000); } catch (e) { log('err send-code: ' + e.message.substring(0, 60)); }
        }
        await page.screenshot({ path: `${OUT}/p9-login-06-2fa-screen.png` });
      } else if (info.url.includes('/auth') === false && !info.url.endsWith('/login')) {
        log('✅ Peut-être déjà connecté (session persistante ?) — à vérifier à l\'étape 2');
      }
    }
  } catch (e) {
    log('ERREUR: ' + e.message);
    await page.screenshot({ path: `${OUT}/p9-login-error.png` }).catch(() => {});
  }

  fs.writeFileSync(`${OUT}/p9-login-auth-net.json`, JSON.stringify(authNet, null, 2));
  log('appels Clerk capturés: ' + authNet.length);
  await browser.close();
  log('Terminé — profil sauvegardé pour l\'étape 2');
})();
