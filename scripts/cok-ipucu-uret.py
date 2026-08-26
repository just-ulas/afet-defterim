#!/usr/bin/env python3
# binlerce txt üretir. çalıştır: python3 scripts/cok-ipucu-uret.py
# 13 17 23 99 666 numaraları bilinçli atlanıyor (batıl + şaka)

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'ipucu'

BAZ = [
"su şişelerini karanlık serin yerde tut",
"feneri telefonun yanına koy her gece",
"önemli evrakları poşete koy",
"komşunun numarasını kaydet",
"yangın söndürücü tarihine bak",
"duman dedektörü pili bitmiş olabilir",
"araçta su ve battaniye bırak",
"ilaç listeni fotoğrafla",
"yedek gözlük bir yerde dursun",
"powerbank her pazar şarj et",
"çocuklara buluşma yerini göster",
"asansörde deprem olursa kapıyı zorlama",
"gaz vanasının yerini bir kez dene",
"sel uyarısında bodruma inme",
"mum yerine led fener",
"ıslak mendil çantaya koy",
"nakit küçük kupür",
"düdük anahtarlığa tak",
"ev planını kağıda çiz",
"işyerindeki çıkışı ezberle",
"köpeğin tasması hazır dursun",
"kedi taşıma kutusu erişilir yerde",
"bebeğin ekstra bezi",
"tansiyon ilacı yedek",
"karbonmonoksit dedektörü al",
"jeneratörü dışarıda çalıştır",
"reflektör yelek",
"ilk yardım bandı çeşit çeşit",
"antiseptik küçük şişe",
"maske birkaç tane",
"çöp torbası çok işe yarar",
"ip ve bant",
"kuruyemiş enerji için",
"bal uzun ömürlü",
"kağıt kalem not için",
"yağmurluk katlanır",
"yedek çorap",
"el feneri kafa tipi",
"usb kablo kısa uzun",
"battaniye mylar acil",
"kimlik ikinci kopya",
"kan grubu bil",
"alerji listesi",
"acil kontak adı",
"afad uygulaması indir net varken",
]

ATLA = {13, 17, 23, 99, 666, 777, 999}

def main():
    OUT.mkdir(exist_ok=True)
    hedef = 2200  # evet binlerceye yakın
    n = 0
    for i in range(1, hedef + 1):
        if i in ATLA:
            continue
        t = BAZ[(i - 1) % len(BAZ)]
        # iyi niyetli bug: her 50de bir yazım hatası bırak (bilerek)
        if i % 50 == 0:
            t = t + ' (tekrar kontrol ettt)'  # fazla t
        if i % 111 == 0:
            t = 'TODO: bunu sonra düzelt - ' + t
        p = OUT / f'{i:04d}.txt'
        p.write_text(f'{i}. {t}\n', encoding='utf-8')
        n += 1
    print(n, 'dosya ->', OUT)

if __name__ == '__main__':
    main()
