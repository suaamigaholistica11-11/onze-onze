## Mudanças

### 1. Home — "Energia do Dia" dinâmica
Hoje o card "Energia do Dia" mostra um texto estático de `onze-data.ts`. Vou trocar por um texto curto e alegre gerado a partir dos trânsitos reais do dia (Sol + Lua, via `getTransitsForToday`).

- Adicionar `useQuery` chamando `getTransitsForToday` na home.
- Compor uma frase curta (1–2 linhas) no tom do app, ex.: *"Sol em ♌ Leão te chama pra brilhar e a Lua em ♋ Câncer pede colinho. Equilibra os dois ✨"*.
- Helper novo em `src/lib/daily-energy.ts` que recebe os trânsitos e devolve `{ texto, highlights }` curtinho.
- Highlights = signo do Sol + signo da Lua + 1 palavra-chave da energia.

### 2. Mapa Astral — formulário direto na aba
Hoje `/mapa-astral` lista mapas e tem botão "+ Novo mapa" que leva pra `/mapa-astral/novo`. Vou consolidar:

- `/mapa-astral` passa a mostrar **direto** o formulário (data, hora, local — e nome, que é necessário pra salvar).
- Remove o botão "+ Novo mapa".
- Acima do formulário: lista enxuta dos mapas já salvos do usuário (até 2). Cada item clicável abre `/mapa-astral/$id`.
- Se já tiver 2 mapas salvos: formulário desabilitado com aviso *"Você já tem seus 2 mapas salvos ✨"*.
- Salvar continua usando `natal_charts` (limite de 2 já é validado no submit).
- Rota `/mapa-astral/novo` deixa de ser usada — vou removê-la (e a navegação correspondente).

### 3. Fundo do app — constelações do zodíaco
Hoje o `AppShell` usa um glifo gigante centralizado como fundo. Vou trocar por uma arte de constelações do zodíaco:

- Gerar uma imagem (PNG transparente, fundo claro) com as 12 constelações do zodíaco em linhas finas + estrelas, estilo minimal/dreamy combinando com a paleta peach/lilac/mint.
- Salvar em `src/assets/zodiac-constellations.png`.
- `AppShell`: trocar o `<span>` do glifo por um `<div>` com `background-image` fixo, opacidade baixa (~0.08), `bg-center bg-no-repeat bg-contain`, animação suave de rotação/breathing já existente preservada.
- Manter a prop `glyph` por compatibilidade, mas ela deixa de ser renderizada.

## Arquivos afetados

- **novo:** `src/lib/daily-energy.ts`, `src/assets/zodiac-constellations.png`
- **editar:** `src/routes/_authenticated/index.tsx` (energia dinâmica), `src/routes/_authenticated/mapa-astral.tsx` (form inline + lista), `src/components/AppShell.tsx` (fundo de constelações)
- **remover:** `src/routes/_authenticated/mapa-astral.novo.tsx`
