/**
 * PROBE CLERK-DIRECT — Full chromium + réseau complet + appel direct Clerk API
 * 1. flux UI jusqu'à l'écran 2 (champs remplis)
 * 2. clic Sign up + observation réseau complète (challenges.cloudflare, clerk)
 * 3. si rien : window.Clerk.client.signUp.create() direct
 * 4. prepareVerification email_code → mail.tm → attemptVerification
 */
const { launch, dismissCookies, log, OUT } = require('./hf-common');
const { loadMailbox, pollForCode } = require('./mail-provider');
const fs = require('fs');

(async () => {
  const mail = loadMailbox();
  const { browser, page } = await launch();

  await page.route('**/*', async (route) => {
    const req = route.request();
    if (['image', 'media', 'font', 'stylesheet'].includes(req.resourceType())) { return route.abort(); }
    if (req.resourceType() === 'document') {
      try {
        const response = await route.fetch();
        const headers = { ...response.headers };
        delete headers['content-security-policy'];
        delete headers['content-security-policy-report-only'];
        await route.fulfill({ response, headers });
      } catch (e) { await route.continue(); }
    } else { await route.continue(); }
  });

  // Réseau COMPLET : clerk + cloudflare + erreurs
  page.on('response', async (res) => {
    const u = res.url();
    if (/_clerk|challenges\.cloudflare|turnstile/i.test(u)) {
      let b = ''; try { b = (await res.text()).substring(0, 180); } catch (e) { }
      log('← ' + res.status() + ' ' + res.request().method() + ' ' + u.replace('https://', '').split('?')[0].substring(0, 75) + (b && res.status() >= 400 ? ' :: ' + b.replace(/\n/g, ' ').substring(0, 120) : ''));
    }
  });
  page.on('console', (msg) => {
    const t = msg.text();
    if (msg.type() === 'error' && !/GSI_LOGGER|accounts list|favicon/.test(t)) log('CONSOLE: ' + t.substring(0, 110));
  });

  try {
    // ── Flux écran 1 → 2
    await page.goto('https://higgsfield.ai/auth/sign-up', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(10000);
    await dismissCookies(page);
    const em = page.locator('input[name="email"]:visible').last();
    await em.click({ timeout: 8000 });
    await em.pressSequentially(mail.address, { delay: 30 });
    await page.waitForTimeout(800);
    await page.evaluate(() => {
      const vis = (el) => el.offsetParent !== null;
      const cands = [...document.querySelectorAll('span, label')].filter(vis).filter(el => /^I agree/i.test((el.textContent || '').trim()));
      if (cands.length) cands[cands.length - 1].click();
    });
    await page.waitForTimeout(700);
    const cont = em.locator('xpath=ancestor::form[1]').locator('button[type="submit"]:visible').first();
    await cont.click({ timeout: 6000 });
    await page.waitForTimeout(9000);
    log('écran 2: ' + page.url());

    const em2 = page.locator('input[name="email"]:visible').last();
    if (!(await em2.inputValue().catch(() => ''))) { await em2.click(); await em2.pressSequentially(mail.address, { delay: 30 }); }
    const pwd = page.locator('input[type="password"]:visible').last();
    await pwd.click({ timeout: 8000 });
    await pwd.pressSequentially('Phase9-HfTest!2026', { delay: 20 });
    await page.waitForTimeout(1500);

    // ── window.Clerk dispo ?
    const clerkInfo = await page.evaluate(() => ({
      hasClerk: typeof window.Clerk !== 'undefined',
      hasClient: !!(window.Clerk && window.Clerk.client),
      hasSignUp: !!(window.Clerk && window.Clerk.client && window.Clerk.client.signUp),
      signUpStatus: window.Clerk && window.Clerk.client && window.Clerk.client.signUp ? window.Clerk.client.signUp.status : null,
      version: window.Clerk && window.Clerk.version,
    })).catch(e => ({ err: e.message.substring(0, 80) }));
    log('CLERK JS: ' + JSON.stringify(clerkInfo));

    // ── Clic Sign up + 25 s d'observation réseau
    const submit = page.locator('input[type="submit"]:visible').first();
    await submit.click({ timeout: 8000 });
    log('clic Sign up — observation 25 s…');
    await page.waitForTimeout(25000);
    const st1 = await page.evaluate(() => ({
      url: location.href,
      code: !!document.querySelector('input[name="code"]'),
      err: (document.body.innerText.match(/[^\n]{0,40}(captcha|error|failed)[^\n]{0,60}/i) || [])[0] || null,
    }));
    log('état après clic: ' + JSON.stringify(st1));

    // ── Appel direct Clerk signUp.create
    log('— essai DIRECT window.Clerk.client.signUp.create —');
    const direct = await page.evaluate(async ({ email, password }) => {
      try {
        if (!window.Clerk || !window.Clerk.client || !window.Clerk.client.signUp) return { ok: false, err: 'Clerk API indisponible' };
        const su = await window.Clerk.client.signUp.create({ emailAddress: email, password });
        return { ok: true, status: su.status, id: su.id, verification: su.verifications && su.verifications.emailAddress ? su.verifications.emailAddress.status : null, missing: su.missingFields, unnecessary: su.unverifiedFields };
      } catch (e) {
        return { ok: false, err: (e.errors || [{ message: e.message }]).map(x => x.message || x.longMessage).join(' | ').substring(0, 300), clerkErr: !!e.errors };
      }
    }, { email: mail.address, password: 'Phase9-HfTest!2026' }).catch(e => ({ ok: false, err: 'eval: ' + e.message.substring(0, 100) }));
    log('DIRECT create: ' + JSON.stringify(direct));
    fs.writeFileSync(`${OUT}/p9-direct-create.json`, JSON.stringify(direct, null, 2));

    if (direct.ok) {
      // ── prepareVerification
      const prep = await page.evaluate(async () => {
        try {
          const v = await window.Clerk.client.signUp.prepareVerification({ strategy: 'email_code' });
          return { ok: true, status: v.status, strategy: v.strategy };
        } catch (e) { return { ok: false, err: (e.errors || [{ message: e.message }]).map(x => x.message).join(' | ').substring(0, 250) }; }
      }).catch(e => ({ ok: false, err: 'eval: ' + e.message.substring(0, 100) }));
      log('PREPARE: ' + JSON.stringify(prep));
      await page.screenshot({ path: `${OUT}/p9-direct-prep.png` });

      if (prep.ok) {
        // ── lecture du code mail.tm
        log('⏳ code mail.tm…');
        const res = await pollForCode(mail, Date.now() - 120000, 7 * 60 * 1000);
        if (!res) throw new Error('code non reçu');
        log('📩 code: ' + res.code + ' (' + (res.subject || '').substring(0, 40) + ')');
        // saisir via l'UI si l'écran code est là, sinon attemptVerification direct
        const codeField = page.locator('input[name="code"]:visible').first();
        let attempt = null;
        if ((await codeField.count()) > 0) {
          await codeField.click({ timeout: 8000 });
          await codeField.pressSequentially(res.code, { delay: 45 });
          await page.waitForTimeout(600);
          await codeField.press('Enter', { timeout: 5000 }).catch(() => { });
          await page.waitForTimeout(8000);
        } else {
          attempt = await page.evaluate(async (code) => {
            try {
              const a = await window.Clerk.client.signUp.attemptVerification({ strategy: 'email_code', code });
              return { ok: true, status: a.status, verification: a.verifications.emailAddress.status };
            } catch (e) { return { ok: false, err: (e.errors || [{ message: e.message }]).map(x => x.message).join(' | ').substring(0, 250) }; }
          }, res.code).catch(e => ({ ok: false, err: 'eval: ' + e.message.substring(0, 80) }));
          log('ATTEMPT: ' + JSON.stringify(attempt));
        }
        await page.waitForTimeout(6000);
        const finalUrl = page.url();
        const authed = !/\/auth|\/login/.test(finalUrl);
        log('URL finale: ' + finalUrl + ' — authed=' + authed);
        await page.screenshot({ path: `${OUT}/p9-direct-final.png` });
        if (authed) {
          fs.writeFileSync('/home/z/my-project/.hf-phase9-test-account.json', JSON.stringify({ email: mail.address, password: 'Phase9-HfTest!2026', mailboxFile: '.hf-phase9-mailbox.json', createdAt: new Date().toISOString(), browser: 'chromium-full-clerk-direct' }, null, 2));
          log('🎉 COMPTE CRÉÉ (chemin direct Clerk)');
          // dump rapide
          await page.goto('https://higgsfield.ai/generate', { waitUntil: 'domcontentloaded', timeout: 60000 });
          await page.waitForTimeout(10000);
          const full = await page.evaluate(() => ({
            credits: (document.body.innerText.match(/(\d[\d,\.]*)\s*(?:\/\s*\d[\d,\.]*)?\s*credits?/i) || [])[0] || null,
            body: document.body.innerText.replace(/\s+/g, ' ').substring(0, 600),
          }));
          fs.writeFileSync(`${OUT}/p9-direct-state.json`, JSON.stringify(full, null, 2));
          log('CRÉDITS: ' + full.credits + ' | BODY: ' + full.body.substring(0, 200));
        }
      }
    }
  } catch (e) {
    log('ERREUR: ' + e.message);
    await page.screenshot({ path: `${OUT}/p9-direct-error.png` }).catch(() => { });
  }
  await browser.close();
  log('probe clerk-direct terminé');
})();
