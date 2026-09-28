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
2. Bir görev kimliği oluşturun: `TASK-001`.
3. `.ai/runs/TASK-001/brief.md` dosyasını doldurun.
4. `plan-task` skill'iyle planı oluşturun.
5. Implementasyon, red-team ve doğrulama dalgalarını sırayla tamamlayın.
6. Tamamlamadan önce çalıştırın:

```bash
npm run validate
npm run context-pack -- TASK-001
```

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

Bu dosyalar, görevi daha sonra Claude, Codex veya ChatGPT Pro ile sürdürebilmek için kısa ve doğrulanabilir bir kayıt oluşturur.

## ChatGPT Pro kullanımı

`npm run context-pack -- TASK-001` komutu görev özeti, plan, değişiklik, review ve doğrulama bilgilerini küçük bir Markdown paketi olarak üretir. Bu paket araştırma, planlama veya bağımsız değerlendirme için ChatGPT Pro sohbetine verilebilir.

Gerçek secret, credential, müşteri verisi veya şirket içi hassas dokümanları context-pack içine koymayın. Üretilen paket `.gitignore` ile yerel tutulur.

## Kapsam dışı

Bu başlangıç şablonu özel MCP sunucusu, harici memory servisi, browser otomasyonu veya model yönlendirme sistemi kurmaz. Bunlar ancak gerçek proje ihtiyaçları belirlendikten sonra ayrı bir karar olarak eklenebilir.
