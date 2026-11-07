/**
 * PHASE 9 — LOGIN ÉTAPE 2 : saisie du code 2FA → session authentifiée
 * Reprend le profil persistant (état Clerk conservé), saisit le code, capture le dashboard.
 * Usage: node login-step2.js <CODE>
 */
const { launch, dismissCookies, watchAuth, domInfo, log, OUT } = require('./hf-common');
const fs = require('fs');

const CODE = process.argv[2] || '';

(async () => {
  if (!/^\d{6}$/.test(CODE)) { log('❌ code invalide en argument'); process.exit(1); }
  const { browser, page } = await launch();
  const authNet = [];
  watchAuth(page, authNet);

  try {
    // ── Reprendre l'écran 2FA (l'état Clerk est dans les cookies du profil)
    log('NAV: reprise écran 2FA');
    await page.goto('https://higgsfield.ai/auth/email/sign-in', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(9000);
    await dismissCookies(page);
    await page.screenshot({ path: `${OUT}/p9-login2-01-resume.png` });

    let info = await domInfo(page);
    log('ÉTAT: ' + JSON.stringify({ url: info.url, headings: info.headings }));
    const codeInput = page.locator('input[name="code"]:visible, input[autocomplete="one-time-code"]:visible').first();

    if ((await codeInput.count()) > 0) {
      log('champ code présent — saisie du code');
      await codeInput.click({ timeout: 8000 });
      await codeInput.pressSequentially(CODE, { delay: 40, timeout: 15000 });
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}/p9-login2-02-code-filled.png` });
      await codeInput.press('Enter', { timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(4000);
      // fallback bouton submit / verify / continue
      const vBtn = page.locator('button:visible', { hasText: /^(verify|continue|submit|log ?in)$/i }).first();
      if (page.url().includes('/auth') && (await vBtn.count()) > 0) {
        try { await vBtn.click({ timeout: 6000 }); log('clic bouton verify'); } catch (e) { log('err: ' + e.message.substring(0, 50)); }
      }
      // attendre la redirection vers l'app
      log('attente redirection…');
      await page.waitForTimeout(20000);
      await dismissCookies(page);
      await page.screenshot({ path: `${OUT}/p9-login2-03-after-code.png` });
      log('URL après code: ' + page.url().substring(0, 120));
    } else {
      log('⚠️ pas de champ code visible — état inattendu (session expirée ? déjà connecté ?)');
    }

    // ── Diagnostic final : connecté ?
    info = await domInfo(page);
    const loggedIn = !/\/auth|\/login/.test(info.url);
    const full = await page.evaluate(() => {
      const nav = [...document.querySelectorAll('nav a, aside a, [role="navigation"] a')].map(a => ({ text: (a.textContent || '').trim().substring(0, 35), href: (a.getAttribute('href') || '').substring(0, 70) })).filter(l => l.text && l.href).slice(0, 50);
      const credits = (document.body.innerText.match(/(\d[\d,\.]*)\s*(?:\/\s*\d[\d,\.]*)?\s*credits?/i) || [])[0] || null;
      const userBtn = [...document.querySelectorAll('button')].filter(b => b.offsetParent !== null).map(b => (b.textContent || '').trim().substring(0, 40)).filter(Boolean);
      return { nav, credits, userBtn: userBtn.slice(0, 40), bodyText: document.body.innerText.replace(/\s+/g, ' ').substring(0, 1200) };
    });
    fs.writeFileSync(`${OUT}/p9-login2-04-final-state.json`, JSON.stringify({ ...info, ...full, loggedIn }, null, 2));
    log(`LOGGED IN: ${loggedIn}`);
    log('CREDITS: ' + full.credits);
    log('NAV: ' + JSON.stringify(full.nav.slice(0, 25)));
    log('BOUTONS: ' + JSON.stringify(full.userBtn.slice(0, 25)));
    log('BODY: ' + full.bodyText.substring(0, 400));

    if (loggedIn) {
      log('🎉 SESSION AUTHENTIFIÉE — profil persistant conservé pour les tests de features');
    } else {
      log('❌ Pas connecté — le code a peut-être expiré ou été rejeté');
      // détecter un message d'erreur
      const err = (full.bodyText.match(/(incorrect|invalid|expired|error|failed|too many)[^\n]{0,80}/i) || [])[0];
      if (err) log('ERREUR DÉTECTÉE: ' + err);
    }
  } catch (e) {
    log('ERREUR: ' + e.message);
    await page.screenshot({ path: `${OUT}/p9-login2-error.png` }).catch(() => {});
  }

  fs.writeFileSync(`${OUT}/p9-login2-auth-net.json`, JSON.stringify(authNet, null, 2));
  log('appels Clerk: ' + authNet.length);
  await browser.close();
  log('Terminé');
})();
