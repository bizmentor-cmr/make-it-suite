/**
 * POLL-STATUS — Surveille .hf-phase9-status.json en continu (pendant que l'utilisateur
 * saisit le code 2FA dans l'interface web du panneau Preview).
 * Usage : node poll-status.js <sinceEpochMs> [maxSec]
 * Affiche chaque transition de statut ; sort dès DONE_ALL / FAILED.
 */
const fs = require('fs');

const since = Number(process.argv[2] || 0);
const maxSec = Number(process.argv[3] || 570);
const FILE = '/home/z/my-project/.hf-phase9-status.json';

let lastLine = '';
const t0 = Date.now();

(async () => {
  while ((Date.now() - t0) / 1000 < maxSec) {
    let s = null;
    try { s = JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch (e) { /* pas encore */ }
    if (s && s.t && Date.parse(s.t) >= since - 5000) {
      const parts = [s.status];
      if (s.note) parts.push(String(s.note));
      if (s.error) parts.push('ERR: ' + String(s.error).substring(0, 120));
      if (s.credits) parts.push('credits=' + s.credits);
      if (s.progress) parts.push(s.progress + '%');
      if (s.elapsedSec !== undefined) parts.push(s.elapsedSec + 's');
      if (s.done) parts.push('faits: ' + s.done);
      const line = parts.join(' | ');
      if (line !== lastLine) {
        console.log(`[${new Date().toISOString().substring(11, 19)}] ${line}`);
        lastLine = line;
      }
      if (/^(DONE_ALL|FAILED)$/.test(s.status)) {
        console.log('FINAL: ' + s.status);
        process.exit(0);
      }
    }
    await new Promise(r => setTimeout(r, 2500));
  }
  console.log('POLL_TIMEOUT — le daemon continue de tourner en arrière-plan');
})();
