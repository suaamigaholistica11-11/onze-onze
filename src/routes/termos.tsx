import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso e Privacidade · onze-onze" },
      {
        name: "description",
        content: "Termos de uso e política de privacidade do app onze-onze.",
      },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <AppShell>
      <div className="px-5 py-6 space-y-6">
        <header className="flex items-center gap-3">
          <Link
            to="/configuracoes"
            className="flex items-center justify-center size-9 rounded-full bg-card ring-1 ring-border"
          >
            <ChevronLeft className="size-5" />
          </Link>
          <h1 className="font-display text-2xl font-bold">
            Termos de uso e privacidade
          </h1>
        </header>

        <div className="bg-card rounded-[24px] ring-1 ring-border p-5 space-y-5 text-sm leading-relaxed">
          <p className="text-xs text-muted-foreground">
            Última atualização: maio de 2026
          </p>

          <section>
            <h2 className="font-semibold mb-1">1. Quem somos</h2>
            <p>
              O app 11:11 onze-onze é operado pela equipe onze-onze, com
              contato pelo e-mail <strong>suaamigaholistica@gmail.com</strong>.
              Somos a controladora dos seus dados pessoais conforme a Lei Geral
              de Proteção de Dados (Lei nº 13.709/2018, LGPD).
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-1">2. Quais dados coletamos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cadastro: nome, e-mail e senha</li>
              <li>
                Perfil: data, horário e cidade de nascimento (lat/lng) e foto
              </li>
              <li>
                Uso: mapas astrais, check-ins da Pirâmide, rituais e sugestões
              </li>
              <li>Técnicos: tipo de dispositivo e fuso horário</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-1">3. Para que usamos</h2>
            <p>
              Personalizar sua experiência (saudação, mapa astral, energia do
              dia), gerar textos via IA com base nos dados astrológicos, manter
              histórico de rituais e progresso da Pirâmide e enviar sugestões
              que você submeter.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-1">4. Base legal</h2>
            <p>
              Tratamos seus dados com base no seu <strong>consentimento</strong>{" "}
              (LGPD, art. 7º, I), obtido no cadastro. Você pode revogá-lo a
              qualquer momento solicitando a exclusão da conta.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-1">5. Com quem compartilhamos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Lovable Cloud (banco de dados e autenticação criptografados)
              </li>
              <li>
                Provedor de IA: somente dados astrológicos (signo solar, lunar e
                ascendente). Nenhum dado pessoal de identificação é enviado.
              </li>
              <li>Google/Apple: apenas se você usar login social</li>
              <li>
                Não vendemos, alugamos ou compartilhamos seus dados para
                publicidade.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-1">6. Por quanto tempo</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Conta e perfil: enquanto a conta estiver ativa</li>
              <li>Rituais: 30 dias após a realização (limpeza automática)</li>
              <li>Pirâmide: por toda a duração da conta</li>
              <li>Exclusão da conta: dados removidos em até 30 dias</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-1">
              7. Seus direitos (LGPD, art. 18)
            </h2>
            <p>
              Confirmação, acesso, correção, exclusão, revogação de
              consentimento e portabilidade. Solicite por:{" "}
              <strong>suaamigaholistica@gmail.com</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-1">8. Segurança</h2>
            <p>
              Dados criptografados com Row Level Security (RLS): cada usuária
              só acessa os próprios dados.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-1">9. Crianças</h2>
            <p>
              App não destinado a menores de 13 anos. Não coletamos dados de
              crianças intencionalmente.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-1">10. Contato</h2>
            <p>
              Dúvidas e reclamações: <strong>suaamigaholistica@gmail.com</strong>
              <br />
              ANPD: www.gov.br/anpd
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
