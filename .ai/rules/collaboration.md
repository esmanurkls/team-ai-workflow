# İşbirliği kuralları

- Görev kimliği ve insan sahibi belirlenmeden anlamlı implementasyona başlama.
- Bir branch/PR tek bir mantıksal görevi temsil etsin; branch adı `task/TASK-001-kisa-ad` biçiminde olsun.
- Paralel AI oturumları aynı çalışma kopyasını paylaşmasın; her biri için ayrı `git worktree` aç.
- Commit mesajları yapılan değişikliği ve görev kimliğini anlaşılır biçimde ifade etsin.
- AI'ın ürettiği kodu sahibi incelemeden merge etme.
- Farklı AI araçları arasında geçişte sohbeti değil, `.ai/runs/TASK-*/` artefaktlarını aktar.
- Çelişen önerilerde kararı `decisions/` altında gerekçesiyle kaydet.
