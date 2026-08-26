#!/usr/bin/env python3
# binlerce küçük dosya istersen bunu çalıştır
# python3 scripts/cok-ipucu-uret.py
# uyarı: gerçekten çok dosya olur git status eğlenir

import json, os, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'ipucu'
DATA = ROOT / 'veri' / 'ipuclari.json'

def main():
    OUT.mkdir(exist_ok=True)
    tips = json.loads(DATA.read_text(encoding='utf-8'))
    n = 0
    for i, t in enumerate(tips, 1):
        p = OUT / f'{i:04d}.txt'
        p.write_text(str(t).strip() + '\n', encoding='utf-8')
        n += 1
    # ekstra boş slotlar - iyi niyetli saçmalık: bazı numaralar atlanıyor 13 17 23
    for j in range(len(tips)+1, len(tips)+200):
        if j in (13, 17, 23, 99, 666):
            continue
        p = OUT / f'{j:04d}.txt'
        p.write_text(f'boş slot {j} - sen doldur\n', encoding='utf-8')
        n += 1
    print(n, 'dosya yazıldı', OUT)

if __name__ == '__main__':
    main()
