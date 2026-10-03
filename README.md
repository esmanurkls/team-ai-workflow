# Team AI Workflow

Claude, Codex ve ChatGPT Pro'yu aynı ekip çalışma sözleşmesiyle kullanmak için teknoloji ve proje bağımsız başlangıç şablonu.

Bu depo herhangi bir ürünün mimarisini, framework'ünü veya modelini belirlemez. Proje başladığında proje-özel kurallar ayrı bir katman olarak eklenir.

## Tasarım ilkeleri

- Claude ve Codex aynı görevleri yapabilir; araçlara göre iş bölümü yoktur.
- Ortak çalışma kuralları `.ai/WORKFLOW.md` dosyasındadır.
- `AGENTS.md` ve `CLAUDE.md` yalnızca ortak kurallara giriş noktasıdır.
- Her görev plan → implement → red-team → düzeltme → doğrulama → handoff dalgalarından geçer.
- Sohbet geçmişi değil, Git diff'i ve `.ai/runs/TASK-*/` altındaki artefaktlar ortak hafızadır.
- AI çıktısı test ve insan kontrolü olmadan tamamlanmış sayılmaz.

## Hızlı başlangıç

1. Bu şablonu gerçek proje reposuna kopyalayın.
2. `.ai/PROJECT.md` dosyasını projenize göre doldurun (amaç, stack, komutlar, sınırlar).
3. Görevi açın: `npm run new-task -- TASK-001` (küçük işler için `--light`).
4. `.ai/runs/TASK-001/brief.md` dosyasını doldurun.
5. `plan-task` skill'iyle planı oluşturun.
6. Implementasyon, red-team ve doğrulama dalgalarını sırayla tamamlayın.
7. Tamamlamadan önce çalıştırın:

```bash
npm run validate -- TASK-001
```

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run new-task -- TASK-001 [--light]` | Şablonlardan görev klasörünü oluşturur. |
| `npm run validate [-- TASK-001]` | Yapıyı, skill kopyalarını, credential sızıntısını ve görevlerin "definition of done" koşullarını denetler. |
| `npm run sync-skills` | `.ai/skills/` içeriğini `.claude/skills/` ve `.agents/skills/` altına kopyalar. |
| `npm run context-pack -- TASK-001 [--decisions ADR-001]` | Harici sohbet için redakte edilmiş bağlam paketi üretir. |

Skill'leri yalnızca `.ai/skills/` altında düzenleyin ve ardından `npm run sync-skills` çalıştırın. `.github/` altındaki CI iş akışı her PR'da `npm run validate` çalıştırır.

## Görev artefaktları

```text
.ai/runs/TASK-001/
├── brief.md
├── plan.md
├── changes.md
├── redteam-review.md
├── verification.md
└── handoff.md
```

`light` kademede yalnızca `brief.md`, `changes.md` ve `handoff.md` bulunur.

Bu dosyalar, görevi daha sonra Claude, Codex veya ChatGPT Pro ile sürdürebilmek için kısa ve doğrulanabilir bir kayıt oluşturur.

## ChatGPT Pro kullanımı

`npm run context-pack -- TASK-001` komutu ortak iş akışını, proje bağlamını ve görev özeti, plan, değişiklik, review ve doğrulama bilgilerini küçük bir Markdown paketi olarak üretir. Bu paket araştırma, planlama veya bağımsız değerlendirme için ChatGPT Pro sohbetine verilebilir.

Gerçek secret, credential, müşteri verisi veya şirket içi hassas dokümanları context-pack içine koymayın. Üretilen paket `.gitignore` ile yerel tutulur.

## Kapsam dışı

Bu başlangıç şablonu özel MCP sunucusu, harici memory servisi, browser otomasyonu veya model yönlendirme sistemi kurmaz. Bunlar ancak gerçek proje ihtiyaçları belirlendikten sonra ayrı bir karar olarak eklenebilir.
