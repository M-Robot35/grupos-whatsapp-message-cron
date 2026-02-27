import { CSSProperties } from 'react'
import { LeadForm } from '@/components/lead-form'

export default function HomePage() {
  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <p style={badgeStyle}>Automação inteligente para grupos de WhatsApp</p>
        <h1 style={{ margin: '8px 0', fontSize: 44, lineHeight: 1.1 }}>
          Pare de perder vendas por falta de consistência nas mensagens
        </h1>
        <p style={{ fontSize: 18, color: '#334155', maxWidth: 720 }}>
          Crie anúncios, conecte suas instâncias e agende disparos com controle de limites, segurança e painel
          admin. Menos trabalho manual, mais resultado para seu negócio.
        </p>
      </section>

      <section style={gridSectionStyle}>
        <article style={cardStyle}>
          <h2>Atenção</h2>
          <p>
            Sua equipe perde tempo enviando mensagens manualmente, erra horários e não acompanha o que foi
            enviado.
          </p>
        </article>

        <article style={cardStyle}>
          <h2>Interesse</h2>
          <p>
            Com nosso SaaS, você agenda por dias e horários, escolhe grupos e controla tudo por instância com
            histórico completo.
          </p>
        </article>

        <article style={cardStyle}>
          <h2>Desejo</h2>
          <p>
            Resultado: campanhas previsíveis, equipe produtiva e admin com visão de usuários, limites e crescimento.
          </p>
        </article>

        <article style={cardStyle}>
          <h2>Ação</h2>
          <p>Entre na lista prioritária e receba acesso antecipado para começar já.</p>
          <LeadForm />
        </article>
      </section>
    </main>
  )
}

const pageStyle: CSSProperties = {
  background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 35%)',
  minHeight: '100vh',
  padding: '32px 20px 80px'
}

const heroStyle: CSSProperties = {
  maxWidth: 980,
  margin: '0 auto 28px'
}

const badgeStyle: CSSProperties = {
  display: 'inline-block',
  margin: 0,
  padding: '6px 10px',
  borderRadius: 999,
  background: '#dbeafe',
  color: '#1e40af',
  fontWeight: 700
}

const gridSectionStyle: CSSProperties = {
  maxWidth: 980,
  margin: '0 auto',
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
}

const cardStyle: CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  padding: 18,
  boxShadow: '0 6px 24px rgba(15, 23, 42, 0.06)'
}
