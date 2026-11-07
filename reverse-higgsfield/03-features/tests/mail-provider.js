/**
 * MAIL-PROVIDER — Boîtes jetables mail.tm : création + lecture autonome des codes
 * (permet de recevoir les codes Clerk sans intervention de l'utilisateur)
 */
const fs = require('fs');
const API = 'https://api.mail.tm';
const MAILBOX_FILE = '/home/z/my-project/.hf-phase9-mailbox.json';
const log = (m) => console.log(`[${new Date().toISOString().substring(11, 19)}][mail] ${m}`);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function api(path, opts = {}) {
  const res = await fetch(API + path, opts);
  let data = {};
  try { data = await res.json(); } catch (e) { }
  return { status: res.status, data };
}

const list = (data) => data['hydra:member'] || data.member || data.data || [];

async function getToken(address, password) {
  const r = await api('/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address, password }) });
  if (r.status !== 200) throw new Error('token mail.tm impossible: HTTP ' + r.status);
  return r.data.token;
}

async function createMailbox() {
  const dom = await api('/domains?page=1');
  const domains = list(dom.data).filter(d => d.isActive !== false);
  if (domains.length === 0) throw new Error('aucun domaine mail.tm disponible');
  const domain = domains[0].domain;
  log('domaine mail.tm: ' + domain);
  let lastErr = '';
  for (let i = 0; i < 4; i++) {
    const tag = Math.random().toString(36).substring(2, 9);
    // ⚠️ PAS de points : mail.tm les supprime (normalisation type Gmail)
    const address = `higgsp9${tag}@${domain}`;
    const password = 'Mb-' + Math.random().toString(36).substring(2, 12) + '!7';
    const r = await api('/accounts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address, password }) });
    if (r.status === 201) {
      const finalAddress = r.data.address || address; // adresse normalisée par mail.tm
      const token = await getToken(finalAddress, password);
      const mailbox = { provider: 'mail.tm', address: finalAddress, password, token, domain, createdAt: Date.now() };
      fs.writeFileSync(MAILBOX_FILE, JSON.stringify(mailbox, null, 2));
      log('mailbox créée: ' + finalAddress);
      return mailbox;
    }
    lastErr = `${r.status} ${JSON.stringify(r.data).substring(0, 120)}`;
    log('retry création (' + lastErr + ')');
  }
  throw new Error('création mailbox impossible: ' + lastErr);
}

function loadMailbox() { return JSON.parse(fs.readFileSync(MAILBOX_FILE, 'utf8')); }

/** Poll l'inbox et retourne le code 6 chiffres du message le plus récent (après sinceTs) */
async function pollForCode(mailbox, sinceTs, timeoutMs = 8 * 60 * 1000) {
  const deadline = Date.now() + timeoutMs;
  let token = mailbox.token;
  while (Date.now() < deadline) {
    await sleep(7000);
    try {
      let r = await api('/messages?page=1', { headers: { Authorization: `Bearer ${token}` } });
      if (r.status === 401) {
        token = await getToken(mailbox.address, mailbox.password);
        mailbox.token = token;
        fs.writeFileSync(MAILBOX_FILE, JSON.stringify(mailbox, null, 2));
        r = await api('/messages?page=1', { headers: { Authorization: `Bearer ${token}` } });
      }
      const msgs = list(r.data).slice().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      for (const m of msgs) {
        const ts = new Date(m.createdAt || 0).getTime();
        if (sinceTs && ts && ts < sinceTs) continue;
        const full = await api(`/messages/${m.id}`, { headers: { Authorization: `Bearer ${token}` } });
        const text = `${m.subject || ''}\n${m.intro || ''}\n${full.data.text || ''}\n${(full.data.html || []).join(' ')}`.replace(/&#\d+;/g, ' ');
        const codes = [...text.matchAll(/(?<!\d)(\d{6})(?!\d)/g)].map(x => x[1]);
        if (codes.length > 0) return { code: codes[0], subject: m.subject, from: m.from && m.from.address };
      }
    } catch (e) { log('poll err: ' + e.message.substring(0, 60)); }
  }
  return null;
}

module.exports = { createMailbox, loadMailbox, pollForCode, MAILBOX_FILE };
