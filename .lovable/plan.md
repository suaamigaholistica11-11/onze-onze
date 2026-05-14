# Plano de implementação — PRD 11:11 onze-onze v4.0

O PRD é grande e tem sobreposição com o que já está construído. Em vez de implementar tudo de uma vez (correria, alto risco de quebra), proponho fatiar em 4 fases. Cada fase entrega algo testável.

## O que já existe hoje

- Auth por e-mail + Google (Lovable broker) e tela `/login`
- Home com saudação, mensagem do dia, contador de Lua Nova em Touro (16/mai)
- Mapa Astral: formulário, geração via IA, mandala completa, tabelas, elemento dominante, limite de 2 mapas + bloqueio de 5 exclusões/24h
- O Céu Hoje (trânsitos + Lua)
- Pirâmide Evolutiva (versão simplificada)
- Tabelas: `profiles`, `natal_charts`, `natal_chart_deletions`, `pyramid_choices`, `pyramid_progress`
- Lovable AI (Gemini) já cobre os textos — não precisa de Claude/Anthropic API key

## O que está faltando vs PRD

- Apple Sign-In, recuperação de senha
- Tela `/completar-perfil` com cidade (Nominatim), lat/lng, foto, consentimento LGPD
- Drawer com avatar, e-mail, badge "em breve"
- `/ritualzinho` completa (banhos por fase + atividades por signo + histórico 30 dias)
- `/blog`, `/lojinha`, `/redes`, `/configuracoes`
- Pirâmide v2: ciclo de 21 dias, seleção 3 tópicos, check-in 0–5, gráfico Recharts, encerramento
- Tabelas novas: `pyramid_cycles`, `pyramid_checkins`, `rituals_done`, `suggestions` + colunas LGPD em `profiles`
- Política de Privacidade (modal)
- Limpeza automática de rituais (>30d)
- E-mail de sugestões (Resend via connector)

## Fase 1 — Fundamentos (perfil + LGPD + drawer)

1. **Migration**: adicionar colunas em `profiles` (`birth_date`, `birth_time`, `birth_city`, `birth_lat`, `birth_lng`, `avatar_url`, `lgpd_consent`, `lgpd_consent_at`, `deletion_count`, `deletion_blocked_until`).
2. **Tela `/completar-perfil`**: form com data/hora/cidade (autocomplete Nominatim), checkbox "não sei o horário", upload de avatar (Supabase Storage bucket `avatars`), checkbox LGPD obrigatório.
3. **Drawer atualizado**: avatar + nome + e-mail no topo; itens com badges "Em breve" para Blog/Lojinha; ícone do menu visível em todas as telas autenticadas.
4. **Modal de Política de Privacidade** reutilizável (texto da seção 7.1 do PRD).
5. **Recuperar senha**: rota `/reset-password` + link em `/login`.

## Fase 2 — Ritualzinho completo

1. **Migration**: `rituals_done` com `expires_at` gerada (`done_at + 30 days`) + RLS.
2. **Conteúdo hardcoded** em `src/lib/rituals.ts`: 4 fases × 2-3 banhos + 12 atividades por signo (textos do PRD).
3. **Tela `/ritualzinho`**: fase atual + signo da Lua, aviso ético dobrável, bloco banhos (carrossel), bloco atividade do signo, modal de manifestação ao marcar feito, histórico colapsável dos últimos 30 dias.
4. **Cron job** (`pg_cron`) diário: `DELETE FROM rituals_done WHERE expires_at < now()`.

## Fase 3 — Pirâmide Evolutiva v2

1. **Migrations**: `pyramid_cycles` (3 tópicos + cores + datas + reflexão + status) e `pyramid_checkins` (scores 0–5, unique por dia).
2. **Migrar `pyramid_choices`/`pyramid_progress`** para o novo modelo (decidir: deprecar ou converter dados existentes).
3. **Tela `/piramide`** com 3 estados: sem ciclo / ciclo ativo (check-in + gráfico Recharts) / dia 21 (resumo + reflexão + escolher próximo ciclo).
4. **Banco de 25 frases de encorajamento** + toast aleatório após check-in.

## Fase 4 — Telas finais + integrações

1. **Migration**: `suggestions` (origin blog/shop, message, sent_email).
2. **Telas**: `/blog`, `/lojinha` (em construção + form de sugestão), `/redes` (4 cards — preciso dos links), `/configuracoes` (editar perfil, política, excluir conta).
3. **Conector Resend**: server function `sendSuggestion` que insere na tabela e dispara e-mail para `suaamigaholistica@gmail.com`. (Vou usar o connector Resend, não edge function direto.)
4. **Apple Sign-In**: depende de configuração no Lovable Cloud — vou orientar.

## Decisões técnicas que mudam do PRD

- **Sem Anthropic/Claude API**: já uso Lovable AI Gateway (Gemini). Mesmo tom, sem nova chave.
- **Sem Supabase Edge Functions**: nesta stack TanStack Start, lógica de servidor mora em `createServerFn`. Já é o padrão atual do projeto.
- **Sem `astronomia` + `sweph` WASM**: já uso `astronomy-engine` no projeto. Mantenho. Mapa astral atual usa IA — manter assim ou trocar por cálculo local depois é uma decisão à parte (caro e complexo de fazer bem).
- **Geocoding**: Nominatim direto do client (ok, gratuito, sem chave).

## Perguntas antes de começar a Fase 1

1. **Pode começar pela Fase 1** ou prefere outra ordem (ex: Ritualzinho primeiro porque já temos a estrutura lunar)?
2. **Apple Sign-In** é obrigatório no MVP ou pode ficar para depois? (Requer config extra no Lovable Cloud.)
3. **Pirâmide atual** tem dados de usuários? Se tiver, prefere manter as tabelas antigas funcionando em paralelo ou migrar tudo?
4. **Links das redes sociais** (Instagram/TikTok/Pinterest/Spotify) e **nome/razão social para a Política de Privacidade** — você tem agora ou deixa placeholder?

Me responde 1–4 e eu começo pela fase escolhida.
