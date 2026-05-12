## Plano de implementação — onze-onze v2

Vou implementar as 6 mudanças em uma sequência coerente. Antes de começar, preciso confirmar alguns pontos.

### O que será construído

**1. Autenticação (login obrigatório)**
- Habilitar Lovable Cloud Auth (e-mail/senha + Google + Apple)
- Tabela `profiles` (user_id, display_name, created_at) com trigger auto-create
- Layout route `_authenticated/` protegendo todas as telas do app
- Página `/login` com tabs "Entrar" / "Criar conta" + botões Google e Apple
- Sem confirmação de e-mail automática (usuário verifica e-mail antes de entrar)

**2. Home com saudação dinâmica**
- "Oi, {nome}! Lindo dia pra você!" (manhã/tarde/noite calculado por hora local)
- Mensagem inspiradora do dia (rotaciona por dia do ano em pool de ~30 frases mock)
- Mantém o card "Energia do Dia" e contador de Lua Nova existentes

**3. Menu lateral (sidebar)**
- Substitui a bottom nav atual por shadcn `Sidebar` collapsible
- Itens: Home, Mapa Astral, O Céu Hoje, Pirâmide Evolutiva, Sair
- "Sair" faz signOut e redireciona para /login

**4. Mapa Astral — lista**
- Rota `/mapa-astral`: lista mapas salvos do usuário + botão "Novo mapa"
- Limite: 2 mapas grátis. A partir do 3º, mostra paywall ("Em breve: desbloqueie mapas ilimitados")
- Tabela `natal_charts` (user_id, name, birth_date, birth_time, birth_place, lat, lng, chart_data jsonb)

**5. Mapa Astral — criação e visualização**
- Form: nome, data, hora, local de nascimento (todos obrigatórios)
- Aviso: "Não tem alguma dessas informações? Veja sua certidão de nascimento..."
- Edge function `generate-natal-chart` calcula posições (mock simplificado por enquanto — Sol/Lua/Asc + planetas usando aproximação por data; substituível por Swiss Ephemeris depois)
- Tela do mapa: mandala SVG + lista de planetas com signo/casa + texto curto Sol+Lua+Asc gerado via Lovable AI (gemini-2.5-flash)

**6. O Céu Hoje**
- Rota `/ceu-hoje`: trânsitos do dia (mock por enquanto — posições aproximadas + interpretação curta)

**7. Pirâmide Evolutiva (revisada)**
- Topo: 3 opções selecionáveis dentre temas (Físico, Mental, Espiritual, Emocional, Social, Criativo, Espiritualidade, Carreira)
- Texto reflexivo: "Reflita sobre os 3 pontos mais importantes pra você desenvolver agora..."
- Após 3 dias, libera troca (timestamp salvo)
- Tabela `pyramid_choices` (user_id, themes[], chosen_at) e `pyramid_progress` (user_id, theme, value, date)
- Gráfico "Tríade Evolutiva" — radar SVG dos 3 temas com evolução temporal

### Alterações técnicas

```text
src/
  routes/
    login.tsx                          (novo)
    _authenticated.tsx                 (novo — guarda)
    _authenticated/
      index.tsx                        (movido — Home)
      mapa-astral.tsx                  (novo — lista)
      mapa-astral.$id.tsx              (novo — detalhe)
      mapa-astral.novo.tsx             (novo — form)
      ceu-hoje.tsx                     (novo)
      piramide.tsx                     (movido)
  components/
    AppSidebar.tsx                     (novo)
    AppShell.tsx                       (refeito com SidebarProvider)
    NatalMandala.tsx                   (novo SVG)
    TriadeRadar.tsx                    (novo SVG)
  lib/
    natal.functions.ts                 (createServerFn)
    daily-message.ts                   (pool de mensagens)
    greeting.ts                        (manhã/tarde/noite)
supabase/
  functions/generate-natal-chart/      (edge function + AI)
```

Migrations:
- `profiles` (com trigger handle_new_user)
- `natal_charts` (RLS por user_id, índice em user_id)
- `pyramid_choices` + `pyramid_progress` (RLS por user_id)

### Pontos importantes / suposições
- **Cálculo de mapa natal**: vou usar uma aproximação por data (Sol confiável, Lua/Asc aproximados) + interpretação textual via Lovable AI. Swiss Ephemeris real fica para próximo sprint.
- **Pagamento de mapas extras**: implemento o paywall visual mas SEM integração de pagamento (mostro "Em breve"). Se quiser ativar Stripe agora, me avise.
- **Lua Nova existente** continua mockada.
- **Provider Apple**: depende de o usuário ter conta de developer Apple; configuro a UI e o provider Google funciona out-of-the-box. Apple ficará pronto pra ativar quando quiser.

Posso seguir com tudo isso?
