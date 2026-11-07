#!/usr/bin/env python3
# ============================================================
# PHASE 6 — Analyse des captures réseau → inventaire endpoints
# Regroupe les requêtes, isole les vrais APIs, extrait samples
# ============================================================
import json, re, sys
from collections import defaultdict
from urllib.parse import urlparse, parse_qs

CAP = '/home/z/my-project/reverse-higgsfield/07-api-requests/captures'

def norm_path(p):
    p = re.sub(r'/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', '/{uuid}', p)
    p = re.sub(r'/(img|image|id|request|template|effect|lesson|course|app|project|canvas|video|gen|rid)_[A-Za-z0-9_-]{6,}', r'/\1_{id}', p)
    p = re.sub(r'/\d{3,}(?=/|$)', '/{id}', p)
    p = re.sub(r'/(01bd19df|187ac5b1)-[A-Za-z0-9_-]+\.(js|css)$', r'/{bundle}.\2', p)
    return p

def load(name):
    try:
        return json.load(open(f'{CAP}/{name}'))
    except Exception:
        return []

events = load('net-public-events.json')
# fusion de toutes les captures phase 6
for f in ('net-auth-events.json', 'net-upload-events.json', 'net-generate-events.json'):
    d = load(f)
    if isinstance(d, list):
        events += d
    elif isinstance(d, dict) and 'events' in d:
        events += d['events']

# statique à exclure de l'inventaire "API"
STATIC_HOSTS = ('assets.higgsfield.ai', 'images.higgs.ai', 'cdn.higgsfield.ai',
                'static.higgsfield.ai', 'cdn.growthbook.io', 'cdn-prod.securiti.ai')
STATIC_PATH = re.compile(r'\.(js|css|png|jpe?g|webp|gif|svg|ico|woff2?|mp4|webm|mp3|json\.map)(\?|$)|/l10n/|/tanstack/assets/', re.I)

groups = {}  # key -> {count, statuses, samples[]}
for e in events:
    u = urlparse(e['url'])
    if u.netloc in STATIC_HOSTS: continue
    if STATIC_PATH.search(u.path): continue
    if e['resourceType'] in ('script', 'stylesheet', 'image', 'font', 'media'): continue
    if e['method'] == 'GET' and e['resourceType'] == 'document' and u.netloc == 'higgsfield.ai':
        pass  # on garde les navigations de doc (renseignent les routes)
    key = f"{e['method']} {u.netloc}{norm_path(u.path)}"
    g = groups.setdefault(key, {'count': 0, 'statuses': set(), 'samples': [], 'phases': set(), 'resourceTypes': set()})
    g['count'] += 1
    if e.get('status'): g['statuses'].add(e['status'])
    g['phases'].add(e.get('phase', '?'))
    g['resourceTypes'].add(e['resourceType'])
    if len(g['samples']) < 3:
        g['samples'].append({
            'url': e['url'][:300],
            'phase': e.get('phase'),
            'status': e.get('status'),
            'reqHeaders': e.get('reqHeaders'),
            'cookieNames': e.get('cookieNames'),
            'postData': (e.get('postData') or '')[:1600] or None,
            'contentType': e.get('contentType'),
            'respHeaders': {k: v for k, v in (e.get('respHeaders') or {}).items()
                            if k in ('content-type', 'x-hf-worker', 'cf-cache-status', 'server-timing',
                                     'x-ratelimit-limit', 'x-ratelimit-remaining', 'retry-after', 'access-control-allow-origin')},
            'body': (e.get('body') or '')[:2400] or None,
            'jwt': e.get('jwt') or None,
        })

# tri : d'abord les POST, puis GET, par host
def sort_key(k):
    m, rest = k.split(' ', 1)
    pri = {'POST': 0, 'PUT': 1, 'DELETE': 2, 'PATCH': 3, 'GET': 4}.get(m, 5)
    return (pri, rest)

out = {
    'total_events': len(events),
    'unique_endpoints': len(groups),
    'endpoints': {}
}
for key in sorted(groups, key=sort_key):
    g = groups[key]
    out['endpoints'][key] = {
        'count': g['count'],
        'statuses': sorted(s for s in g['statuses'] if s),
        'phases': sorted(g['phases']),
        'resourceTypes': sorted(g['resourceTypes']),
        'samples': g['samples'],
    }

with open(f'{CAP}/endpoints-inventory.json', 'w') as f:
    json.dump(out, f, indent=1, ensure_ascii=False)

# affichage lisible
print(f"Événements: {len(events)} — endpoints uniques: {len(groups)}\n")
for key in sorted(groups, key=sort_key):
    g = groups[key]
    st = ','.join(str(s) for s in sorted(g['statuses'])) or '?'
    print(f"{g['count']:4d}×  {key}   [{st}]  phases={','.join(g['phases'])[:60]}")
