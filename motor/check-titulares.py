#!/usr/bin/env python3
"""Valida los titulares del slide 02 (la segunda portada).

Tres reglas, las tres se rompieron al menos una vez:
  1. Ancla de dominio: el titular dice de qué habla para quien no vio el slide 01.
  2. Cero repeticiones de 3+ palabras seguidas contra CUALQUIER otro texto del
     mismo carrusel (eyebrow y hook del 01 incluidos, que es por donde se coló la peor).
  3. Los diez arrancan distinto.
Uso: python3 check-titulares.py
"""
import json, glob, os, re, unicodedata
from difflib import SequenceMatcher

ANCLA = re.compile(r'\b(prompt|chat|respuesta|respuestas|ia|modelo|asistente|paper|feed|pasos|numero|condiciones|conversacion)\b')

def norm(s):
    s = re.sub(r'<[^>]+>', ' ', s or '')
    s = unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9 ]', ' ', s).split()

def textos(d, salvo_titular_02=True):
    out = []
    for i, sl in enumerate(d['slides']):
        def walk(x, k=None):
            if isinstance(x, str):
                if not (i == 1 and k == 'title' and salvo_titular_02): out.append(x)
            elif isinstance(x, list):
                for y in x: walk(y)
            elif isinstance(x, dict):
                for kk, y in x.items(): walk(y, kk)
        for k, v in sl.items():
            if k in ('n', 'kind', 'ts', 'art'): continue
            walk(v, k)
    return out

problemas, arranques = 0, {}
for f in sorted(glob.glob('data/c*.json')):
    cid = os.path.basename(f)[:3]
    d = json.load(open(f, encoding='utf-8'))
    t = norm(d['slides'][1]['title'])
    arranques.setdefault(' '.join(t[:2]), []).append(cid)
    if not ANCLA.search(' '.join(t)):
        print(f"  {cid}  sin ancla de dominio: no se sostiene solo"); problemas += 1
    for line in textos(d):
        l = norm(line)
        if len(l) < 2: continue
        m = SequenceMatcher(None, t, l).find_longest_match(0, len(t), 0, len(l))
        if m.size >= 3:
            print(f"  {cid}  repite {m.size} palabras: '{' '.join(t[m.a:m.a+m.size])}'  <- {line[:70]}")
            problemas += 1
for p, c in arranques.items():
    if len(c) > 1:
        print(f"  arranque repetido '{p}': {', '.join(c)}"); problemas += 1
print('sin hallazgos' if not problemas else f'{problemas} problema(s)')
