# afet-defterim

internetsiz acil durum notlarım.

deprem olunca telefonda bir şey açılsın istedim. düdük çalsın, konum alsın, 112 ekranı çıksın. bluetooth ile herkese mesaj falan webde olmuyo onu da yazdım ki kimse boşuna uğraşmasın.

## ne var

- `sos.html` — büyük kırmızı buton, düdük, sarsıntı algılama
- `index.html` — notlar
- `notlar/` — deprem sel yangın vs
- `ipucu/` — bir sürü kısa not (script ile çoğalttım)
- kod biraz dağınık. bilinçli. gece yazdım bir kısmını

## çalıştırma

```
python3 -m http.server 8000
```

sonra telefonda aynı wifi ile `http://bilgisayar-ip:8000/sos.html`

file:// ile açınca sensör ve ses bazen kapris yapıyo. sunucu daha iyi.

## uyarı

112 yi boş yere arama. bu şey otomatik arama yapamaz zaten, sen onaylıyosun. tarayıcı öyle.

unlicense — ne istersen yap sat dağıt kır.

— ulas
