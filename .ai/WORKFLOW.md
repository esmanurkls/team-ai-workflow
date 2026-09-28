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

Basit, risksiz bir değişiklikte dalgalar aynı oturumda tamamlanabilir; artefakt sözleşmesi yine korunur.

## Ortak durum

AI yardımcıları sohbet geçmişini paylaşmaz. Ortak durum yalnızca şuralardan okunur:

- Git branch ve diff
- `.ai/runs/TASK-*/` altındaki görev artefaktları
- `.ai/decisions/` altındaki kalıcı kararlar
- İnsan tarafından onaylanmış proje dokümanları

Bir önceki AI'ın ne yaptığını varsayma; ilgili artefaktları ve diff'i incele.

## Görev sahibi ve yetki

- Her görev için bir insan sahibi vardır.
- Aynı dosyada eşzamanlı iki AI çalıştırılmaz.
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

## Skill seçimi

- Yeni bir işi anlamak veya kapsamlandırmak için `plan-task`.
- Planı uygulamak için `implement-task`.
- Bağımsız saldırgan inceleme için `review-task`.
- Test ve kanıt toplamak için `verify-task`.
- Başka bir oturum veya araçta devam etmek için `handoff-task`.
- ChatGPT Pro'ya sınırlı bağlam vermek için `chatgpt-context-pack`.

Yalnızca göreve gerekli skill'i yükle. İlgisiz dosyaları bağlama ekleme.
