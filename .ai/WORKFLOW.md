# Ortak AI çalışma sözleşmesi

Bu dosya Claude, Codex ve diğer AI yardımcıları için ortak otoritedir. Araç adı, model markası veya kişisel tercih görev akışını değiştirmez.

## Görev yaşam döngüsü

Her anlamlı kod veya dokümantasyon işi aşağıdaki dalgalardan geçer:

```text
Wave 0: Plan
Wave 1: Implement
Wave 2: Red-team review
Wave 3: Fix
Wave 4: Verify + Handoff
```

## Kademeler

Görev `npm run new-task -- TASK-001` ile açılır; kademe `brief.md` içinde yazar.

- `full` (varsayılan): altı artefaktın tamamı. Yeni özellik, mimari veya veri etkisi olan, güvenlik sınırına dokunan ya da birden fazla modülü etkileyen işler.
- `light` (`--light`): yalnızca `brief.md`, `changes.md`, `handoff.md`. Tek modülde kalan, kolay geri alınabilen küçük düzeltmeler. Doğrulama komutları `changes.md` içine yazılır; ayrı red-team dalgası yoktur, insan incelemesi yine zorunludur.

Emin değilsen `full` seç. İş büyürse eksik artefaktları `.ai/templates/` altından ekleyip kademeyi `full` yap.

## Proje bağlamı ve kurallar

Her görevden önce şunları oku:

- `.ai/PROJECT.md`: projenin amacı, komutları, mimari sınırları ve dokunulmaması gereken alanlar.
- `.ai/rules/security.md`: secret ve veri sınırları. Her görevde geçerlidir.
- `.ai/rules/collaboration.md`: görev sahibi, branch ve merge kuralları.
- `.ai/rules/evidence-policy.md`: kanıt biçimi ve `P0`–`P3` önem seviyeleri.
- `.ai/rules/cost-optimization.md`: bağlam ve model seçimi.

## Ortak durum

AI yardımcıları sohbet geçmişini paylaşmaz. Ortak durum yalnızca şuralardan okunur:

- Git branch ve diff
- `.ai/runs/TASK-*/` altındaki görev artefaktları
- `.ai/decisions/` altındaki kalıcı kararlar
- İnsan tarafından onaylanmış proje dokümanları

Bir önceki AI'ın ne yaptığını varsayma; ilgili artefaktları ve diff'i incele.

## Görev sahibi ve yetki

- Her görev için bir insan sahibi vardır.
- Her görev kendi branch'inde yürür: `task/TASK-001-kisa-ad`.
- Aynı dosyada eşzamanlı iki AI çalıştırılmaz. Paralel çalışan AI'lar ayrı görev, ayrı branch ve ayrı `git worktree` kullanır.
- AI, kapsamı genişleten dependency, entegrasyon veya mimari değişikliği kendiliğinden eklemez.
- Kritik veya geri dönüşü zor kararlar insan onayı olmadan uygulanmaz.
- Red-team incelemesi kodu doğrudan değiştirmez; bulguları raporlar.

## Definition of done

Bir görev ancak şu koşullarda tamamlanır:

- Kabul kriterleri karşılanmıştır.
- İlgili doğrulama komutları çalıştırılmıştır veya neden çalıştırılamadığı yazılmıştır.
- Red-team bulguları kapatılmış, kabul edilmiş veya ertelenmiştir.
- Değişen dosyalar ve kalan riskler `handoff.md` içinde açıklanmıştır.
- İnsan sahibi sonucu gözden geçirmiştir.
- `npm run validate -- TASK-001` başarılıdır. `handoff.md` durumu `verified` veya `done` olduğunda bu komut yukarıdaki koşulları denetler; CI aynı kontrolü her PR'da çalıştırır.

## Skill seçimi

- Yeni bir işi anlamak veya kapsamlandırmak için `plan-task`.
- Planı uygulamak için `implement-task`.
- Bağımsız saldırgan inceleme için `review-task`.
- Test ve kanıt toplamak için `verify-task`.
- Başka bir oturum veya araçta devam etmek için `handoff-task`.
- ChatGPT Pro'ya sınırlı bağlam vermek için `chatgpt-context-pack`.

Skill'lerin tek kaynağı `.ai/skills/` klasörüdür. `.claude/skills/` ve `.agents/skills/` araçların otomatik bulması için üretilmiş kopyalardır; elle düzenleme, `npm run sync-skills` çalıştır.

Yalnızca göreve gerekli skill'i yükle. İlgisiz dosyaları bağlama ekleme.
