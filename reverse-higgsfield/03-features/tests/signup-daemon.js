/**
 * SIGNUP DAEMON v5 — Flux COMPLET dans une seule session navigateur
 * Écran 1 /auth/sign-up : email + Terms (SPAN "I agree") + Continue
 *   ↳ navigation client-side (pas de POST Clerk)
 * Écran 2 /auth/email/sign-up : email (persisté) + password + Sign up
 *   ↳ POST Clerk sign_ups → écran code
 * Code : lecture auto mail.tm → saisie → compte créé → onboarding → dump
 */
const { launch, dismissCookies, log, OUT } = require('./hf-common');
const { loadMailbox, pollForCode } = require('./mail-provider');
const fs = require('fs');

const ROOT = '/home/z/my-project';
const STATUS = `${ROOT}/.hf-phase9-signup-status.json`;
const ACCOUNT_FILE = `${ROOT}/.hf-phase9-test-account.json`;
const HF_PASSWORD = 'Phase9-HfTest!2026';
const writeStatus = (s, extra = {}) => fs.writeFileSync(STATUS, JSON.stringify({ status: s, t: new Date().toISOString(), ...extra }, null, 2));

async function detect(page) {
  const [email, password, code, firstName, lastName] = await Promise.all([
    page.locator('input[name="email"]:visible').count(),
    page.locator('input[type="password"]:visible').count(),
    page.locator('input[name="code"]:visible, input[autocomplete="one-time-code"]:visible').count(),
    page.locator('input[name="firstName"]:visible, input[name="first_name"]:visible').count(),
    page.locator('input[name="lastName"]:visible, input[name="last_name"]:visible').count(),
  ]);
  const err = await page.evaluate(() => {
    const t = document.body.innerText;
    const m = t.match(/([^\n]{0,30}(?:not allowed|not valid|already registered|already in use|already exists|blocked|disposable|try another|unusual|must accept|please agree)[^\n]{0,60})/i);
    return m ? m[0].trim() : null;
  }).catch(() => null);
  return { url: page.url(), email, password, code, firstName, lastName, err };
}

const isAuthed = (url) => !/\/auth|\/sign-(?:in|up)|\/login/.test(url);

/** Coche la case Terms custom (clic sur le span profond "I agree…") */
async function acceptTerms(page) {
  return page.evaluate(() => {
    const vis = (el) => el.offsetParent !== null;
    const cands = [...document.querySelectorAll('span, label')].filter(vis)
      .filter(el => /^I agree/i.test((el.textContent || '').trim()) && (el.textContent || '').length < 300);
    if (cands.length === 0) return { clicked: false };
    const label = cands[cands.length - 1];
    label.click();
    return { clicked: true };
  }).catch(() => ({ clicked: false }));
}

/** Cloudflare Turnstile « Verify you are human » — clic aux coordonnées du widget */
async function solveTurnstile(page) {
  try {
    const cf = page.locator('iframe[title*="Cloudflare"], iframe[src*="challenges.cloudflare.com"], iframe[title*="Widget containing"]').first();
    if ((await cf.count()) === 0) return 'aucun widget';
    const box = await cf.boundingBox();
    if (!box) return 'iframe sans boundingBox';
    await page.mouse.click(box.x + 28, box.y + box.height / 2);
    await page.waitForTimeout(7000); // laisser le challenge se résoudre
    return `cliqué (${Math.round(box.x + 28)},${Math.round(box.y + box.height / 2)})`;
  } catch (e) { return 'err: ' + e.message.substring(0, 60); }
}

(async () => {
  let browser = null, page = null;
  try {
    const mail = loadMailbox();
    log('mailbox: ' + mail.address);
    writeStatus('FLOW_START', { mail: mail.address });
    ({ browser, page } = await launch());

    // Journal réseau Clerk + erreurs console
    page.on('console', (msg) => { if (msg.type() === 'error') log('CONSOLE ERR: ' + msg.text().substring(0, 130)); });
    page.on('response', async (res) => {
      const u = res.url();
      if (u.includes('_clerk') && res.request().method() === 'POST') {
        let b = '';
        try { b = (await res.text()).substring(0, 260); } catch (e) { }
        log('← POST ' + res.status() + ' ' + u.replace('https://higgsfield.ai', '').split('?')[0].substring(0, 70) + ' :: ' + b.replace(/\n/g, ' '));
      }
    });

    // ══ ÉCRAN 1 : /auth/sign-up (email + Terms + Continue)
    await page.goto('https://higgsfield.ai/auth/sign-up', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(9000);
    await dismissCookies(page);
    let st = await detect(page);
    if (st.email === 0) throw new Error('écran 1 sans champ email — ' + st.url);
    await page.screenshot({ path: `${OUT}/p9s-01-screen1.png` });

    const em = page.locator('input[name="email"]:visible').last();
    await em.click({ timeout: 8000 }).catch(() => { });
    await em.pressSequentially(mail.address, { delay: 25, timeout: 20000 });
    await page.waitForTimeout(700);

    // Terms + Turnstile éventuel + Continue avec vérification de navigation (3 essais)
    let screen2 = false;
    for (let tryN = 1; tryN <= 3 && !screen2; tryN++) {
      const t = await acceptTerms(page);
      const ts = await solveTurnstile(page);
      log('Terms essai ' + tryN + ': ' + JSON.stringify(t) + ' | Turnstile: ' + ts);
      await page.waitForTimeout(600);
      // clic Continue : submit du form puis texte
      const cont = em.locator('xpath=ancestor::form[1]').locator('button[type="submit"]:visible').first();
      if ((await cont.count()) > 0) { await cont.click({ timeout: 6000 }); log('  clic Continue(form)'); }
      else {
        const c2 = page.locator('button:text-is("Continue"):visible').first();
        await c2.click({ timeout: 6000 }).catch(() => { });
        log('  clic Continue(text)');
      }
      await page.waitForTimeout(8000);
      if (page.url().includes('/auth/email/sign-up')) { screen2 = true; break; }
      await page.screenshot({ path: `${OUT}/p9s-01b-screen1-stuck-${tryN}.png` });
      log('  pas de navigation vers écran 2 (essai ' + tryN + ')');
    }
    if (!screen2) throw new Error('écran 1 ne navigationne pas vers écran 2 — voir captures');
    log('✓ ÉCRAN 2 atteint: ' + page.url());
    await page.screenshot({ path: `${OUT}/p9s-02-screen2.png` });
    writeStatus('SCREEN2_PASSWORD', { mail: mail.address });

    // ══ ÉCRAN 2 : /auth/email/sign-up (password + Sign up)
    st = await detect(page);
    const em2 = page.locator('input[name="email"]:visible').last();
    if (st.email > 0) {
      const val = await em2.inputValue().catch(() => '');
      log('  email écran 2: "' + val + '"');
      if (!val) { await em2.click({ timeout: 5000 }).catch(() => { }); await em2.pressSequentially(mail.address, { delay: 25 }); }
    }
    const pwd = page.locator('input[type="password"]:visible').last();
    await pwd.click({ timeout: 8000 }).catch(() => { });
    await pwd.pressSequentially(HF_PASSWORD, { delay: 15, timeout: 20000 });
    await page.waitForTimeout(800);
    if (st.firstName > 0) {
      const fn = page.locator('input[name="firstName"]:visible, input[name="first_name"]:visible').first();
      await fn.click({ timeout: 5000 }).catch(() => { }); await fn.pressSequentially('Alex', { delay: 20, timeout: 8000 }).catch(() => { });
    }
    if (st.lastName > 0) {
      const ln = page.locator('input[name="lastName"]:visible, input[name="last_name"]:visible').first();
      await ln.click({ timeout: 5000 }).catch(() => { }); await ln.pressSequentially('Test', { delay: 20, timeout: 8000 }).catch(() => { });
    }
    await page.screenshot({ path: `${OUT}/p9s-03-screen2-filled.png` });

    // ── Turnstile écran 2 (le vrai gate du bouton Sign up)
    const ts2 = await solveTurnstile(page);
    log('Turnstile écran 2: ' + ts2);
    await page.screenshot({ path: `${OUT}/p9s-03b-turnstile.png` });

    // Sign up : input[type=submit] en priorité
    const submit = page.locator('input[type="submit"]:visible').first();
    const submitBtn = page.locator('button:text-is("Sign up"):visible, button:text-is("Continue"):visible').first();
    if ((await submit.count()) > 0) { await submit.click({ timeout: 8000 }); log('  clic Sign up (input)'); }
    else if ((await submitBtn.count()) > 0) { await submitBtn.click({ timeout: 8000 }); log('  clic Sign up (button)'); }
    else { await pwd.press('Enter'); log('  Enter'); }

    // ══ Attendre : écran code OU noms OU authed (surveiller 30 s)
    let codeSeen = false, authed = false;
    for (let w = 0; w < 10; w++) {
      await page.waitForTimeout(3000);
      st = await detect(page);
      if (isAuthed(st.url)) { authed = true; break; }
      if (st.code > 0) { codeSeen = true; break; }
      if (st.err) log('  err: ' + st.err);
    }
    await page.screenshot({ path: `${OUT}/p9s-04-after-signup.png` });
    log(`après Sign up: code=${codeSeen} authed=${authed} url=${st.url}`);

    // si ni code ni authed → retenter Sign up une fois
    if (!codeSeen && !authed) {
      log('  retry Sign up…');
      const s2 = page.locator('input[type="submit"]:visible').first();
      if ((await s2.count()) > 0) { await s2.click({ timeout: 6000 }).catch(() => { }); }
      for (let w = 0; w < 8; w++) {
        await page.waitForTimeout(3000);
        st = await detect(page);
        if (isAuthed(st.url)) { authed = true; break; }
        if (st.code > 0) { codeSeen = true; break; }
      }
      await page.screenshot({ path: `${OUT}/p9s-04b-retry.png` });
    }

    // ══ ÉCRAN CODE : lecture mail.tm auto
    if (codeSeen && !authed) {
      writeStatus('WAITING_CODE', { mail: mail.address });
      log('⏳ lecture auto du code mail.tm…');
      const res = await pollForCode(mail, Date.now() - 90000, 8 * 60 * 1000);
      if (!res) throw new Error('code non reçu après 8 min');
      log('📩 code: ' + res.code + ' (sujet: ' + (res.subject || '').substring(0, 60) + ')');
      const codeField = page.locator('input[name="code"]:visible, input[autocomplete="one-time-code"]:visible').first();
      await codeField.click({ timeout: 8000 });
      await codeField.pressSequentially(res.code, { delay: 40, timeout: 15000 });
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}/p9s-05-code-filled.png` });
      await codeField.press('Enter', { timeout: 5000 }).catch(() => { });
      const vBtn = page.locator('input[type="submit"]:visible, button:text-is("Verify"):visible, button:text-is("Continue"):visible').first();
      await page.waitForTimeout(4000);
      if (!isAuthed(page.url()) && (await vBtn.count()) > 0) { await vBtn.click({ timeout: 6000 }).catch(() => { }); log('  clic verify'); }
      // attendre auth
      for (let w = 0; w < 10; w++) {
        await page.waitForTimeout(3000);
        if (isAuthed(page.url())) { authed = true; break; }
      }
      await page.screenshot({ path: `${OUT}/p9s-06-after-code.png` });
    }

    if (!authed) throw new Error('non authentifié après code — url=' + page.url() + ' err=' + (st.err || 'aucune'));

    // ══ COMPTE CRÉÉ
    fs.writeFileSync(ACCOUNT_FILE, JSON.stringify({ email: mail.address, password: HF_PASSWORD, mailboxFile: '.hf-phase9-mailbox.json', createdAt: new Date().toISOString() }, null, 2));
    writeStatus('ONBOARDING');
    log('🎉 COMPTE CRÉÉ: ' + mail.address);

    // ══ ONBOARDING générique
    for (let step = 0; step < 8; step++) {
      await page.waitForTimeout(5000);
      await dismissCookies(page);
      await page.screenshot({ path: `${OUT}/p9s-ob-${step}.png` });
      const ob = await page.evaluate(() => {
        const vis = (el) => el.offsetParent !== null;
        const headings = [...document.querySelectorAll('h1,h2,h3')].filter(vis).map(h => h.textContent.trim().substring(0, 70)).filter(Boolean);
        const texts = [...document.querySelectorAll('input[type="text"], input:not([type])')].filter(vis).map(i => ({ name: i.name || i.id || i.placeholder, ph: (i.placeholder || '').substring(0, 50) }));
        const btns = [...document.querySelectorAll('button')].filter(vis).map(b => (b.textContent || '').trim().substring(0, 40)).filter(Boolean);
        return { url: location.href, headings, texts, btns: btns.slice(0, 25) };
      });
      log(`[ob ${step}] ${ob.url.substring(0, 55)} :: ${JSON.stringify(ob.headings).substring(0, 140)}`);
      if (ob.texts.length > 0 && /name|call you|username/i.test(JSON.stringify(ob.texts))) {
        const nf = page.locator('input[type="text"]:visible, input:not([type]):visible').first();
        await nf.click({ timeout: 5000 }).catch(() => { });
        await nf.pressSequentially('AlexTest', { delay: 20, timeout: 10000 }).catch(() => { });
        await page.waitForTimeout(500);
      }
      await acceptTerms(page);
      const next = page.locator('button:visible', { hasText: /^(continue|next|start|get started|skip|done|let'?s go|create|finish)$/i }).first();
      const hasAction = (await next.count()) > 0;
      if (hasAction) {
        try { const t = ((await next.textContent()) || '').trim(); await next.click({ timeout: 4000 }); log('  clic: ' + t); } catch (e) { }
        await page.waitForTimeout(4000);
      } else {
        await page.keyboard.press('Escape').catch(() => { });
      }
      if (isAuthed(ob.url) && !hasAction) break;
    }

    // ══ DUMP FINAL
    await page.goto('https://higgsfield.ai/generate', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(11000);
    await dismissCookies(page);
    await page.screenshot({ path: `${OUT}/p9s-07-final.png` });
    const full = await page.evaluate(() => {
      const credits = (document.body.innerText.match(/(\d[\d,\.]*)\s*(?:\/\s*\d[\d,\.]*)?\s*credits?/i) || [])[0] || null;
      const nav = [...document.querySelectorAll('nav a, aside a')].map(a => ({ t: (a.textContent || '').trim().substring(0, 30), h: (a.getAttribute('href') || '').substring(0, 60) })).filter(l => l.t && l.h).slice(0, 40);
      return { url: location.href, credits, nav, bodyText: document.body.innerText.replace(/\s+/g, ' ').substring(0, 1500) };
    });
    fs.writeFileSync(`${OUT}/p9s-final-state.json`, JSON.stringify(full, null, 2));
    log('CRÉDITS: ' + full.credits);
    writeStatus('DONE', { credits: full.credits, account: mail.address });
  } catch (e) {
    log('ERREUR: ' + e.message);
    writeStatus('FAILED', { error: e.message });
    if (page) await page.screenshot({ path: `${OUT}/p9s-error.png` }).catch(() => { });
  }
  if (browser) await browser.close();
  log('daemon signup v5 terminé');
})();
