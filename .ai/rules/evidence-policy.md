# Kanıt ve red-team politikası

Bir iddia, mümkünse kanıtla birlikte yazılır:

- Kod değişikliği: dosya ve diff
- Test sonucu: komut ve exit code
- Mimari karar: karar kaydı ve gerekçe
- Red-team bulgusu: önem seviyesi, etki ve öneri
- Tamamlanma: kabul kriteri ve doğrulama kaydı

`P0`: güvenlik, veri kaybı, yanlış kritik davranış veya görevi kullanılamaz yapan hata.

`P1`: ana kabul kriterini veya önemli bir kullanıcı akışını bozan hata.

`P2`: orta önem düzeyinde kalite, bakım veya edge-case sorunu.

`P3`: küçük iyileştirme, okunabilirlik veya takip işi.

Red-team raporu, bulgu yoksa bile hangi yüzeylerin incelendiğini belirtmelidir.
