## Mudanças

### 1. Mandala completa (casas + signos + planetas + aspectos)

Substituir a `<Mandala />` simples em `src/routes/_authenticated/mapa-astral.$id.tsx` por uma mandala SVG completa em `src/components/NatalMandala.tsx`:

- **Roda dos signos** (anel externo): 12 setores de 30° com glifo do signo (♈♉…♓), cores sutis por elemento (fogo/terra/ar/água).
- **Casas astrológicas** (anel interno): 12 setores numerados 1–12, começando pelo Ascendente à esquerda.
- **Planetas**: posicionados no anel correspondente ao seu signo + casa, com o glifo (☉☾☿♀♂♃♄♅♆♇).
- **Aspectos**: linhas no centro conectando planetas, coloridas por tipo:
  - Conjunção (0°) — neutro
  - Sextil (60°) / Trígono (120°) — verde/azul (harmônico)
  - Quadratura (90°) / Oposição (180°) — vermelho/laranja (tensão)
  - Orbe de tolerância: 6° (8° para Sol/Lua).

### 2. Tabela de planetas + aspectos

Abaixo da mandala, dois blocos novos:

- **Planetas → signos / casas**: tabela com colunas Planeta · Signo · Casa (incluindo Sol, Lua, Ascendente).
- **Aspectos**: tabela com Planeta A · Tipo (com glifo ☌ ⚹ △ □ ☍) · Planeta B · Orbe.

### 3. Elemento dominante

Calcular no client a partir de `chart_data.planets` + Sol/Lua/Asc:
- Conta quantos pontos caem em fogo (Áries/Leão/Sagitário), terra (Touro/Virgem/Capricórnio), ar (Gêmeos/Libra/Aquário), água (Câncer/Escorpião/Peixes).
- Mostra um card destacado: *"Seu elemento dominante é Água 💧 — você sente antes de pensar."* (frase curta no tom do app por elemento).

### 4. Geração dos aspectos

A IA hoje devolve só signo/casa por planeta, sem grau. Para calcular aspectos precisos precisaríamos do grau exato. Plano:

- Atualizar o prompt em `src/lib/natal.functions.ts` para também devolver `degree` (0–29.99) por planeta + Sol/Lua/Asc.
- Ampliar `NatalChartData` com `degree`.
- Gerar aspectos no client a partir dos graus absolutos (signo*30 + grau), com a tabela de orbes acima.

### 5. Limite de exclusões + bloqueio de 24h

Hoje `natal_charts` tem só os mapas ativos. Vou adicionar tracking de exclusões por usuário:

- **Migration nova:** tabela `natal_chart_deletions` (`id`, `user_id`, `deleted_at`). RLS: usuário lê/insere os próprios.
- Ao excluir um mapa: além do `delete` em `natal_charts`, registrar uma linha em `natal_chart_deletions`.
- **Regra de bloqueio:** se o usuário já tem 5 exclusões nos últimos 24h, bloquear criação de novo mapa por 24h a partir da 5ª exclusão.
- **UI:**
  - Botão "Excluir" em cada card da lista de mapas em `mapa-astral.tsx` (com confirm).
  - Antes de mostrar o formulário, query `natal_chart_deletions` das últimas 24h. Se `count >= 5`, esconde o formulário e mostra: *"ops! Acho que você já criou e excluiu muito mapas por aqui. Amanhã tem mais."*
  - Mantém também o limite atual de até 2 mapas salvos simultaneamente.

> Observação: o limite "5 exclusões por mapa" descrito não é diretamente representável (ao excluir, o mapa some). Vou implementar como **5 exclusões por usuário em janela de 24h**, que é a interpretação consistente com a mensagem de bloqueio. Se a intenção era outra (ex.: 5 recriações do "mesmo" nome), me avisa antes de implementar.

## Arquivos afetados

- **novo:** `src/components/NatalMandala.tsx`, `src/lib/elements.ts` (cálculo elemento dominante + frases), migration `natal_chart_deletions`.
- **editar:** `src/lib/natal.functions.ts` (incluir `degree`), `src/routes/_authenticated/mapa-astral.$id.tsx` (mandala nova + tabelas + elemento), `src/routes/_authenticated/mapa-astral.tsx` (botão excluir + checagem das 24h), `src/integrations/supabase/types.ts` (auto após migration).

## Pergunta antes de implementar

A regra "5 vezes cada um dos mapas" — você quer:
**(a)** 5 exclusões totais por usuário em 24h (o que vou implementar), ou
**(b)** outra contagem (ex.: por nome/slot)?
