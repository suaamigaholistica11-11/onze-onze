## Ajustes solicitados

### 1. Mapa Astral — formulário de criação funcional
Em `src/routes/_authenticated/mapa-astral.novo.tsx`:
- Manter os 4 campos obrigatórios: **Nome**, **Data**, **Hora**, **Local** (todos `required`, validados antes do submit).
- Garantir botão "Gerar mapa" sempre clicável quando campos estão preenchidos (remover qualquer estado que o trave; hoje só desabilita durante `busy`, o que é correto — vou auditar e habilitar visualmente quando válido).
- Mostrar feedback de loading claro ("Consultando o céu…") e tratar erros do gateway com toast amigável.
- Após criar, navegar para `/mapa-astral/$id` (já faz).

### 2. Mandala + texto profundo no tom de voz
Na tela de detalhe (`mapa-astral.$id.tsx`):
- Mandala já existe — vou refinar para mostrar **glifo do signo** ao lado de cada planeta e destacar **Sol/Lua/Asc** com cores dos tokens.
- Ajustar o prompt em `src/lib/natal.functions.ts` para gerar um **texto único, profundo (5–7 frases)** sobre as energias combinadas do mapa, no tom **Capricho holístico**: leve, íntimo, inspirador, em pt-BR, falando direto com a pessoa ("você"), sem clichês de horóscopo de revista barata. Esse texto vira o card "Sua essência" em destaque acima dos Big 3.

### 3. Remover disclaimer da Home
Em `src/routes/_authenticated/index.tsx`, remover a linha:
> Conteúdo para entretenimento e autoconhecimento ✨

### 4. Trânsitos reais em "O Céu Hoje"
Hoje `ceu-hoje.tsx` usa dados mockados estáticos. Vou trocar por cálculo astronômico real do dia:

- Adicionar dependência **`astronomy-engine`** (puro JS, sem binários nativos, compatível com Worker SSR).
- Criar server function `getTransitsForToday` em `src/lib/transits.functions.ts` que:
  - Calcula longitude eclíptica geocêntrica de Sol, Lua, Mercúrio, Vênus, Marte, Júpiter, Saturno, Urano, Netuno, Plutão para `new Date()` (UTC).
  - Converte longitude → signo zodiacal (12 fatias de 30°) e grau dentro do signo.
  - Detecta retrogradação comparando longitude com 24h atrás.
  - Retorna `[{ planeta, glyph, signo, grau, retrograde }]`.
- Usar Lovable AI (`google/gemini-3-flash-preview`) **uma vez por dia** (cache via `useQuery` + `staleTime` 12h) para gerar uma **frase curta no tom do app** para cada planeta com base no signo real. Alternativa mais barata: tabela estática `signo×planeta → frase` (12×10 = 120 frases curtas) em `src/lib/transit-copy.ts` para zero custo de IA. **Vou pela tabela estática** (mais previsível e instantâneo).
- A página renderiza a data de hoje + lista real, mantendo o visual atual.

### 5. Erro de runtime (limpeza silenciosa)
React error #418 (hydration) — provavelmente saudação dependente de horário no SSR. Já há guard `mounted` na Home; vou checar AppShell/sidebar.

## Arquivos afetados
- `src/routes/_authenticated/mapa-astral.novo.tsx` (auditoria + UX do botão)
- `src/lib/natal.functions.ts` (prompt mais profundo, tom Capricho holístico)
- `src/routes/_authenticated/mapa-astral.$id.tsx` (card "Sua essência" + glifos signos)
- `src/routes/_authenticated/index.tsx` (remover disclaimer)
- `src/routes/_authenticated/ceu-hoje.tsx` (consumir transits reais)
- `src/lib/transits.functions.ts` *(novo)* — server fn com `astronomy-engine`
- `src/lib/transit-copy.ts` *(novo)* — tabela 120 frases pt-BR
- `package.json` — `astronomy-engine`

Sem mudanças de schema / migrações.

## Confirmação rápida
Posso seguir com **tabela estática de frases** (instantâneo, zero custo) para os trânsitos? Se preferir IA gerando ao vivo (mais variado, mas com custo + latência), me diz.
