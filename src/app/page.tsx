'use client'

import { CSSProperties, useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ── Animação de entrada ao scroll ──────────────────────────────────────────────
function useFadeInOnScroll() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

// ── Contador animado ───────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, visible } = useFadeInOnScroll()

  useEffect(() => {
    if (!visible) return
    let start = 0
    const duration = 1800
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [visible, target])

  return (
    <span ref={ref as any}>
      {count.toLocaleString('pt-BR')}{suffix}
    </span>
  )
}

export default function HomePage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    const t = saved || 'dark'
    setTheme(t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  return (
    <div style={wrapper}>
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header style={headerStyle}>
        <div style={headerInner}>
          <div style={logoStyle}>
            <span style={logoIcon}>⚡</span>
            <span style={logoText}>ZapCron</span>
          </div>

          {/* Nav desktop */}
          <nav style={navDesktop}>
            <a href="#solucao" style={navLinkStyle}>Solução</a>
            <a href="#como-funciona" style={navLinkStyle}>Como Funciona</a>
            <a href="#depoimentos" style={navLinkStyle}>Depoimentos</a>
            {mounted && (
              <button onClick={toggleTheme} style={themeBtn} aria-label="Alternar tema">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            )}
            <Link href={'/login' as any} style={loginBtn}>Entrar</Link>
            <Link href={'/register' as any} style={signupBtn}>Comece Grátis →</Link>
          </nav>

          {/* Hamburguer mobile */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={hamburgerBtn} aria-label="Menu">
            <span style={{ ...hamburgerLine, transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ ...hamburgerLine, opacity: menuOpen ? 0 : 1 }} />
            <span style={{ ...hamburgerLine, transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={mobileMenu}>
            <a href="#solucao" style={mobileNavLink} onClick={() => setMenuOpen(false)}>Solução</a>
            <a href="#como-funciona" style={mobileNavLink} onClick={() => setMenuOpen(false)}>Como Funciona</a>
            <a href="#depoimentos" style={mobileNavLink} onClick={() => setMenuOpen(false)}>Depoimentos</a>
            <Link href={'/login' as any} style={mobileNavLink} onClick={() => setMenuOpen(false)}>Entrar</Link>
            <Link href={'/register' as any} style={{ ...signupBtn, width: '100%', textAlign: 'center', marginTop: 8 }} onClick={() => setMenuOpen(false)}>Comece Grátis →</Link>
          </div>
        )}
      </header>

      <main style={mainStyle}>

        {/* ── A — ATENÇÃO: HERO ──────────────────────────────────────────── */}
        <section style={heroSection}>
          {/* Glow de fundo */}
          <div style={heroBlobLeft} />
          <div style={heroBlobRight} />

          <div style={heroContent}>
            <span style={heroBadge}>🚀 Automação para Empreendedores de WhatsApp</span>

            <h1 style={heroTitle}>
              Pare de Copiar e Colar.
              <br />
              <span style={heroGradText}>Automatize. Escale. Lucre.</span>
            </h1>

            <p style={heroSubtitle}>
              Agende milhares de mensagens para seus grupos de WhatsApp com apenas
              alguns cliques. Foque no que realmente importa: <strong>vender mais.</strong>
            </p>

            <div style={heroCtas}>
              <Link href={'/register' as any} style={primaryCta}>
                Criar Conta Grátis
              </Link>
              <a href="#como-funciona" style={ghostCta}>
                ▶ Ver como funciona
              </a>
            </div>

            <p style={heroDisclaimer}>✅ Sem cartão de crédito &nbsp;·&nbsp; ✅ Configuração em 5 minutos</p>
          </div>

          {/* Dashboard mockup */}
          <div style={mockupWrapper}>
            <div style={mockupCard}>
              <div style={mockupTopBar}>
                <span style={mockupDot('#ef4444')} />
                <span style={mockupDot('#fbbf24')} />
                <span style={mockupDot('#34d399')} />
                <span style={mockupTitle}>ZapCron — Dashboard</span>
              </div>
              {[
                { label: 'Campanha Black Friday', time: '09:00', status: '✅ Enviada', color: '#34d399' },
                { label: 'Promo Shopee Semana', time: '12:30', status: '⏳ Agendada', color: '#fbbf24' },
                { label: 'Oferta Relâmpago ML', time: '18:00', status: '⏳ Agendada', color: '#fbbf24' },
                { label: 'Newsletter Semanal', time: '20:00', status: '🔵 Em fila', color: '#818cf8' },
              ].map((item, i) => (
                <div key={i} style={mockupRow}>
                  <div style={mockupRowContent}>
                    <span style={mockupRowLabel}>{item.label}</span>
                    <span style={mockupRowTime}>🕐 {item.time}</span>
                  </div>
                  <span style={{ ...mockupBadge, color: item.color, borderColor: item.color + '44', background: item.color + '18' }}>
                    {item.status}
                  </span>
                </div>
              ))}
              <div style={mockupFooter}>
                <span style={mockupStat}>📤 1.240 msgs enviadas hoje</span>
                <span style={mockupStat}>📊 32 grupos ativos</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── I — INTERESSE: MÉTRICAS ─────────────────────────────────────── */}
        <section style={metricsSection}>
          {[
            { num: 4800, suf: '+', label: 'Mensagens automatizadas por dia' },
            { num: 98, suf: '%', label: 'Uptime garantido' },
            { num: 340, suf: '+', label: 'Empreendedores ativos' },
            { num: 3, suf: 'x', label: 'Mais vendas em média' },
          ].map((m, i) => (
            <div key={i} style={metricCard}>
              <span style={metricNumber}><AnimatedCounter target={m.num} suffix={m.suf} /></span>
              <span style={metricLabel}>{m.label}</span>
            </div>
          ))}
        </section>

        {/* ── I — INTERESSE: PROBLEMA vs SOLUÇÃO ──────────────────────────── */}
        <section id="solucao" style={splitSection}>
          <div style={splitLabel}>
            <span style={sectionEyebrow}>Pare de sofrer</span>
            <h2 style={sectionTitle}>
              A dor que todo afiliado conhece
            </h2>
            <p style={sectionSub}>
              Acordar cedo, copiar links, colar no grupo, repetir 10 vezes por dia, todos os dias.
              Isso não é estratégia — é trabalho braçal que deveria ser feito por uma máquina.
            </p>
          </div>

          <div style={problemSolutionGrid}>
            <div style={problemCard}>
              <h3 style={psTitle('danger')}>😩 Antes do ZapCron</h3>
              {[
                'Copiar e colar links manualmente todo dia',
                'Esquecer de postar e perder vendas',
                'Celular travando com duzentas abas abertas',
                'Domingo inteiro desperdiçado preparando conteúdo',
                'Risco de banimento por excesso de posts manuais',
              ].map((t, i) => (
                <div key={i} style={psItem('danger')}>
                  <span style={psDot('danger')}>✗</span> {t}
                </div>
              ))}
            </div>

            <div style={problemCard}>
              <h3 style={psTitle('success')}>🚀 Com o ZapCron</h3>
              {[
                'Campanha configurada uma vez, dispara para sempre',
                'Nunca mais perde um horário de pico de vendas',
                'Painel único, múltiplos números e grupos',
                'Fim de semana livre — o robô trabalha por você',
                'Envio distribuído e inteligente para evitar bans',
              ].map((t, i) => (
                <div key={i} style={psItem('success')}>
                  <span style={psDot('success')}>✓</span> {t}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── D — DESEJO: COMO FUNCIONA ───────────────────────────────────── */}
        <section id="como-funciona" style={stepsSection}>
          <span style={sectionEyebrow}>Simples assim</span>
          <h2 style={{ ...sectionTitle, textAlign: 'center' }}>3 passos para automatizar tudo</h2>

          <div style={stepsGrid}>
            {[
              {
                step: '01',
                icon: '🔌',
                title: 'Conecte seu WhatsApp',
                desc: 'Escaneie o QR Code e conecte quantos números quiser. Instâncias ilimitadas no plano Pro.',
              },
              {
                step: '02',
                icon: '✍️',
                title: 'Crie sua Campanha',
                desc: 'Escreva a mensagem, adicione links, escolha os grupos e defina o horário exato de disparo.',
              },
              {
                step: '03',
                icon: '📈',
                title: 'Veja as Vendas Crescerem',
                desc: 'O ZapCron dispara automático nos horários de maior engajamento. Você só colhe os frutos.',
              },
            ].map((s, i) => (
              <div key={i} style={stepCard}>
                <div style={stepNumber}>{s.step}</div>
                <div style={stepIcon}>{s.icon}</div>
                <h3 style={stepTitle}>{s.title}</h3>
                <p style={stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── D — DESEJO: FEATURES ────────────────────────────────────────── */}
        <section style={featuresSection}>
          <span style={sectionEyebrow}>Recursos</span>
          <h2 style={{ ...sectionTitle, textAlign: 'center' }}>Tudo que você precisa para vender no automático</h2>

          <div style={featuresGrid}>
            {[
              { icon: '⏰', title: 'Agendamento Inteligente', desc: 'Configure horários específicos ou intervalos automáticos. O sistema escolhe os melhores momentos.' },
              { icon: '📱', title: 'Múltiplos Números', desc: 'Distribua o volume entre diversas instâncias de WhatsApp para evitar banimentos.' },
              { icon: '🎯', title: 'Segmentação de Grupos', desc: 'Envie mensagens diferentes para grupos diferentes com base em categorias e interesses.' },
              { icon: '📊', title: 'Relatórios em Tempo Real', desc: 'Acompanhe entregas, taxa de sucesso e monitore a saúde de cada instância.' },
              { icon: '🔄', title: 'Recorrência Automática', desc: 'Configure campanhas que se repetem diária, semanal ou mensalmente sem intervenção.' },
              { icon: '🛡️', title: 'Anti-ban Integrado', desc: 'Delays inteligentes e rotação entre instâncias para proteger seus números.' },
            ].map((f, i) => (
              <article key={i} style={featureCard}>
                <div style={featureIcon}>{f.icon}</div>
                <h3 style={featureTitle}>{f.title}</h3>
                <p style={featureDesc}>{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── A — AÇÃO: DEPOIMENTOS ───────────────────────────────────────── */}
        <section id="depoimentos" style={testimonialsSection}>
          <span style={sectionEyebrow}>Prova Social</span>
          <h2 style={{ ...sectionTitle, textAlign: 'center' }}>Quem usa, não consegue parar</h2>

          <div style={testimonialsGrid}>
            {[
              {
                stars: 5,
                text: '"Antes eu perdia 3 horas por dia colando links da Shopee nos meus grupos. Agora configuro tudo no domingo e o ZapCron cuida do resto. Meu faturamento duplicou em 60 dias."',
                name: 'Amanda S.',
                role: 'Afiliada Profissional',
                avatar: '👩‍💼',
              },
              {
                stars: 5,
                text: '"Conectei 8 instâncias e distribuo as mensagens automaticamente. Zero risco de banimento e minha taxa de cliques aumentou 40%. Melhor investimento que fiz para o meu negócio."',
                name: 'Ricardo M.',
                role: 'Dono de E-commerce',
                avatar: '👨‍💻',
              },
              {
                stars: 5,
                text: '"As campanhas agendadas para Black Friday já estão configuradas desde outubro. Enquanto todo mundo corre de última hora, eu já estou preparado. Isso é vantagem competitiva."',
                name: 'Fernanda R.',
                role: 'Dropshipper',
                avatar: '👩‍🚀',
              },
            ].map((t, i) => (
              <article key={i} style={testimonialCard}>
                <div style={starsRow}>{'★'.repeat(t.stars)}</div>
                <p style={testimonialText}>{t.text}</p>
                <div style={testimonialAuthor}>
                  <span style={avatarStyle}>{t.avatar}</span>
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>{t.name}</strong>
                    <br />
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{t.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── A — AÇÃO: FAQ ───────────────────────────────────────────────── */}
        <section style={faqSection}>
          <span style={sectionEyebrow}>Dúvidas Frequentes</span>
          <h2 style={{ ...sectionTitle, textAlign: 'center' }}>Respostas rápidas</h2>

          <div style={faqGrid}>
            {[
              {
                q: 'Preciso deixar o celular ligado?',
                a: 'Não. Após conectar o QR Code, o servidor mantém a sessão ativa 24/7. Pode fechar o celular tranquilo.',
              },
              {
                q: 'Corro risco de ter meu número banido?',
                a: 'O ZapCron possui delays inteligentes e rotação entre instâncias para simular comportamento humano e minimizar riscos.',
              },
              {
                q: 'Funciona com grupos e listas de transmissão?',
                a: 'Sim! Você pode enviar para grupos, contatos individuais e listas de transmissão na mesma campanha.',
              },
              {
                q: 'Posso cancelar quando quiser?',
                a: 'Claro. Sem fidelidade. Cancele a qualquer momento direto pelo painel, sem burocracia.',
              },
            ].map((item, i) => (
              <div key={i} style={faqCard}>
                <h3 style={faqQ}>{item.q}</h3>
                <p style={faqA}>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── A — AÇÃO: CTA FINAL ─────────────────────────────────────────── */}
        <section style={finalCtaSection}>
          <div style={finalCtaBg} />
          <div style={finalCtaContent}>
            <span style={{ ...heroBadge, marginBottom: 16 }}>🔥 Vagas Limitadas</span>
            <h2 style={finalCtaTitle}>
              Pronto para transformar o WhatsApp
              <br />
              <span style={heroGradText}>numa máquina de vendas?</span>
            </h2>
            <p style={finalCtaDesc}>
              Junte-se a centenas de empreendedores que já automatizaram suas vendas.
              Crie sua conta agora e automatize em menos de 5 minutos.
            </p>
            <Link href={'/register' as any} style={{ ...primaryCta, fontSize: 20, padding: '18px 48px' }}>
              Criar Minha Conta Grátis 🚀
            </Link>
            <p style={{ ...heroDisclaimer, marginTop: 20 }}>
              ✅ Grátis para começar &nbsp;·&nbsp; ✅ Sem cartão de crédito &nbsp;·&nbsp; ✅ Cancele quando quiser
            </p>
          </div>
        </section>
      </main>

      <footer style={footerStyle}>
        <div style={footerInner}>
          <div style={logoStyle}>
            <span style={logoIcon}>⚡</span>
            <span style={logoText}>ZapCron</span>
          </div>
          <p style={footerTagline}>Automação inteligente para quem vende no WhatsApp.</p>
          <div style={footerLinks}>
            <a href="#solucao" style={footerLink}>Solução</a>
            <a href="#como-funciona" style={footerLink}>Como Funciona</a>
            <a href="#depoimentos" style={footerLink}>Depoimentos</a>
            <Link href={'/login' as any} style={footerLink}>Login</Link>
            <Link href={'/register' as any} style={footerLink}>Cadastro</Link>
          </div>
          <p style={footerCopy}>© 2026 ZapCron. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const wrapper: CSSProperties = { display: 'flex', flexDirection: 'column', minHeight: '100vh' }

// ── Header ────────────────────────────────────────────────────────────────────
const headerStyle: CSSProperties = {
  background: 'var(--bg-header)',
  backdropFilter: 'blur(16px)',
  borderBottom: '1px solid var(--border-color)',
  position: 'sticky', top: 0, zIndex: 100,
}
const headerInner: CSSProperties = {
  maxWidth: 1200, margin: '0 auto', padding: '14px 24px',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
}
const logoStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 8 }
const logoIcon: CSSProperties = { fontSize: 26 }
const logoText: CSSProperties = {
  fontSize: 22, fontWeight: 800,
  background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
  WebkitBackgroundClip: 'text', color: 'transparent', letterSpacing: '-0.5px',
}
const navDesktop: CSSProperties = {
  display: 'flex', gap: 28, alignItems: 'center',
}
const navLinkStyle: CSSProperties = {
  color: 'var(--text-muted)', fontWeight: 500, fontSize: 15,
  textDecoration: 'none', transition: 'color 0.2s',
}
const themeBtn: CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', fontSize: 20,
  padding: 4, display: 'flex', alignItems: 'center', borderRadius: '50%',
}
const loginBtn: CSSProperties = {
  textDecoration: 'none', color: 'var(--btn-ghost-color)', fontWeight: 600, fontSize: 15,
}
const signupBtn: CSSProperties = {
  textDecoration: 'none',
  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
  color: '#fff', padding: '9px 22px', borderRadius: 999,
  fontWeight: 700, fontSize: 15,
  boxShadow: '0 4px 14px 0 rgba(37,99,235,0.35)',
  transition: 'opacity 0.2s',
}
const hamburgerBtn: CSSProperties = {
  display: 'none', flexDirection: 'column', gap: 5,
  background: 'none', border: 'none', cursor: 'pointer', padding: 4,
}
const hamburgerLine: CSSProperties = {
  display: 'block', width: 24, height: 2,
  background: 'var(--text-main)', borderRadius: 2,
  transition: 'transform 0.3s, opacity 0.3s',
}
const mobileMenu: CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 12,
  padding: '16px 24px 24px',
  borderTop: '1px solid var(--border-color)',
}
const mobileNavLink: CSSProperties = {
  textDecoration: 'none', color: 'var(--text-main)',
  fontWeight: 600, fontSize: 16, padding: '8px 0',
}

// ── Main ──────────────────────────────────────────────────────────────────────
const mainStyle: CSSProperties = { flex: 1, overflow: 'hidden' }

// ── Hero ──────────────────────────────────────────────────────────────────────
const heroSection: CSSProperties = {
  position: 'relative', overflow: 'hidden',
  display: 'flex', flexWrap: 'wrap', gap: 60,
  alignItems: 'center', justifyContent: 'center',
  maxWidth: 1200, margin: '0 auto',
  padding: '100px 24px 80px',
}
const heroBlobLeft: CSSProperties = {
  position: 'absolute', top: -100, left: -200,
  width: 600, height: 600, borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
  pointerEvents: 'none',
}
const heroBlobRight: CSSProperties = {
  position: 'absolute', bottom: -80, right: -150,
  width: 500, height: 500, borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
  pointerEvents: 'none',
}
const heroContent: CSSProperties = {
  position: 'relative', zIndex: 1,
  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
  maxWidth: 560,
}
const heroBadge: CSSProperties = {
  display: 'inline-flex', alignItems: 'center',
  padding: '6px 18px', borderRadius: 999,
  background: 'rgba(56,189,248,0.12)', color: '#38bdf8',
  fontWeight: 700, fontSize: 13, marginBottom: 24,
  border: '1px solid rgba(56,189,248,0.3)',
  letterSpacing: '0.4px',
}
const heroTitle: CSSProperties = {
  fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900,
  lineHeight: 1.08, color: 'var(--text-main)',
  margin: '0 0 22px', letterSpacing: '-1.5px',
}
const heroGradText: CSSProperties = {
  background: 'linear-gradient(90deg, #38bdf8, #818cf8, #c084fc)',
  WebkitBackgroundClip: 'text', color: 'transparent',
}
const heroSubtitle: CSSProperties = {
  fontSize: 'clamp(17px, 2vw, 20px)', color: 'var(--text-muted)',
  lineHeight: 1.65, margin: '0 0 36px', maxWidth: 520,
}
const heroCtas: CSSProperties = { display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }
const primaryCta: CSSProperties = {
  textDecoration: 'none',
  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
  color: '#fff', padding: '15px 36px', borderRadius: 999,
  fontWeight: 700, fontSize: 17,
  boxShadow: '0 10px 28px -5px rgba(37,99,235,0.45)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  display: 'inline-block',
}
const ghostCta: CSSProperties = {
  textDecoration: 'none', color: 'var(--text-muted)',
  fontWeight: 600, fontSize: 16,
  padding: '13px 24px',
  borderRadius: 999,
  border: '1.5px solid var(--border-color)',
  transition: 'border-color 0.2s',
  display: 'inline-block',
}
const heroDisclaimer: CSSProperties = {
  fontSize: 13, color: 'var(--text-muted)', marginTop: 20,
}

// ── Mockup ────────────────────────────────────────────────────────────────────
const mockupWrapper: CSSProperties = {
  position: 'relative', zIndex: 1, flex: '0 0 auto',
}
const mockupCard: CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--card-border)',
  borderRadius: 20, padding: '0 0 20px',
  boxShadow: '0 30px 60px -15px rgba(0,0,0,0.35)',
  maxWidth: 420, width: '100%',
  backdropFilter: 'blur(20px)',
}
const mockupTopBar: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '14px 20px',
  borderBottom: '1px solid var(--border-color)',
}
const mockupDot = (color: string): CSSProperties => ({
  width: 12, height: 12, borderRadius: '50%', background: color,
})
const mockupTitle: CSSProperties = {
  marginLeft: 8, fontSize: 13, color: 'var(--text-muted)', fontWeight: 600,
}
const mockupRow: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '14px 20px', borderBottom: '1px solid var(--border-color)',
}
const mockupRowContent: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 }
const mockupRowLabel: CSSProperties = { fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }
const mockupRowTime: CSSProperties = { fontSize: 12, color: 'var(--text-muted)' }
const mockupBadge: CSSProperties = {
  fontSize: 12, fontWeight: 700,
  padding: '4px 10px', borderRadius: 999,
  border: '1px solid', whiteSpace: 'nowrap',
}
const mockupFooter: CSSProperties = {
  display: 'flex', flexWrap: 'wrap', gap: 16,
  padding: '16px 20px 0',
}
const mockupStat: CSSProperties = { fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }

// ── Metrics ───────────────────────────────────────────────────────────────────
const metricsSection: CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: 2,
  background: 'var(--bg-card)',
  borderTop: '1px solid var(--border-color)',
  borderBottom: '1px solid var(--border-color)',
}
const metricCard: CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  padding: '40px 24px',
  borderRight: '1px solid var(--border-color)',
}
const metricNumber: CSSProperties = {
  fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 900,
  background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
  WebkitBackgroundClip: 'text', color: 'transparent',
  letterSpacing: '-1px',
}
const metricLabel: CSSProperties = {
  fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8,
}

// ── Split Section (Problema vs Solução) ───────────────────────────────────────
const splitSection: CSSProperties = {
  maxWidth: 1200, margin: '100px auto', padding: '0 24px',
}
const splitLabel: CSSProperties = {
  marginBottom: 48,
}
const sectionEyebrow: CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 700, letterSpacing: '1.5px',
  textTransform: 'uppercase', color: '#818cf8', marginBottom: 12,
}
const sectionTitle: CSSProperties = {
  fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 900,
  color: 'var(--text-main)', margin: '0 0 16px', letterSpacing: '-0.8px',
}
const sectionSub: CSSProperties = {
  fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.65,
  maxWidth: 580, margin: '0 0 48px',
}
const problemSolutionGrid: CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24,
}
const problemCard: CSSProperties = {
  background: 'var(--bg-card)', border: '1px solid var(--card-border)',
  borderRadius: 20, padding: '32px 36px',
  backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow-card)',
}
const psTitle = (t: 'danger' | 'success'): CSSProperties => ({
  fontSize: 18, fontWeight: 800, marginBottom: 24,
  color: t === 'danger' ? '#f87171' : '#34d399',
})
const psItem = (t: 'danger' | 'success'): CSSProperties => ({
  display: 'flex', gap: 12, alignItems: 'flex-start',
  fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.5,
  padding: '10px 0', borderBottom: '1px solid var(--border-color)',
})
const psDot = (t: 'danger' | 'success'): CSSProperties => ({
  fontWeight: 800, fontSize: 16, flexShrink: 0, marginTop: 1,
  color: t === 'danger' ? '#f87171' : '#34d399',
})

// ── Steps ─────────────────────────────────────────────────────────────────────
const stepsSection: CSSProperties = {
  maxWidth: 1200, margin: '0 auto 100px', padding: '0 24px',
  display: 'flex', flexDirection: 'column', alignItems: 'center',
}
const stepsGrid: CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 28, width: '100%', marginTop: 56,
}
const stepCard: CSSProperties = {
  background: 'var(--bg-card)', border: '1px solid var(--card-border)',
  borderRadius: 24, padding: '40px 32px',
  backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow-card)',
  position: 'relative',
}
const stepNumber: CSSProperties = {
  position: 'absolute', top: 28, right: 28,
  fontSize: 48, fontWeight: 900, letterSpacing: '-2px',
  background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))',
  WebkitBackgroundClip: 'text', color: 'transparent',
}
const stepIcon: CSSProperties = { fontSize: 40, marginBottom: 20 }
const stepTitle: CSSProperties = { fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 12px' }
const stepDesc: CSSProperties = { fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }

// ── Features ──────────────────────────────────────────────────────────────────
const featuresSection: CSSProperties = {
  background: 'var(--bg-card)',
  borderTop: '1px solid var(--border-color)',
  borderBottom: '1px solid var(--border-color)',
  padding: '100px 24px',
  display: 'flex', flexDirection: 'column', alignItems: 'center',
}
const featuresGrid: CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 28, maxWidth: 1200, width: '100%', marginTop: 56,
}
const featureCard: CSSProperties = {
  background: 'var(--bg-body)',
  border: '1px solid var(--card-border)',
  borderRadius: 20, padding: '32px',
  transition: 'transform 0.25s, box-shadow 0.25s',
}
const featureIcon: CSSProperties = { fontSize: 36, marginBottom: 18 }
const featureTitle: CSSProperties = { fontSize: 18, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 10px' }
const featureDesc: CSSProperties = { fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonialsSection: CSSProperties = {
  maxWidth: 1200, margin: '100px auto', padding: '0 24px',
  display: 'flex', flexDirection: 'column', alignItems: 'center',
}
const testimonialsGrid: CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 28, width: '100%', marginTop: 56,
}
const testimonialCard: CSSProperties = {
  background: 'var(--bg-card)', border: '1px solid var(--card-border)',
  borderRadius: 24, padding: '36px',
  backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow-card)',
  display: 'flex', flexDirection: 'column',
}
const starsRow: CSSProperties = { color: '#fbbf24', fontSize: 20, letterSpacing: 3, marginBottom: 16 }
const testimonialText: CSSProperties = {
  fontSize: 16, fontStyle: 'italic', color: 'var(--text-main)',
  lineHeight: 1.7, flex: 1, margin: '0 0 24px',
}
const testimonialAuthor: CSSProperties = {
  display: 'flex', gap: 14, alignItems: 'center',
  borderTop: '1px solid var(--border-color)', paddingTop: 20,
}
const avatarStyle: CSSProperties = {
  width: 44, height: 44, borderRadius: '50%',
  background: 'linear-gradient(135deg, #2563eb22, #7c3aed22)',
  fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
  border: '1px solid var(--border-color)',
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const faqSection: CSSProperties = {
  background: 'var(--bg-card)',
  borderTop: '1px solid var(--border-color)',
  padding: '100px 24px',
  display: 'flex', flexDirection: 'column', alignItems: 'center',
}
const faqGrid: CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 24, maxWidth: 1000, width: '100%', marginTop: 56,
}
const faqCard: CSSProperties = {
  background: 'var(--bg-body)',
  border: '1px solid var(--card-border)',
  borderRadius: 16, padding: '28px',
}
const faqQ: CSSProperties = { fontSize: 16, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 12px' }
const faqA: CSSProperties = { fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }

// ── Final CTA ─────────────────────────────────────────────────────────────────
const finalCtaSection: CSSProperties = {
  position: 'relative', overflow: 'hidden',
  margin: '100px auto', maxWidth: 860,
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  borderRadius: 40, padding: '80px 40px',
  border: '1px solid var(--card-border)',
  background: 'var(--bg-card)',
  backdropFilter: 'blur(20px)',
  textAlign: 'center',
}
const finalCtaBg: CSSProperties = {
  position: 'absolute', inset: 0,
  background: 'radial-gradient(ellipse 80% 80% at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 60%)',
  pointerEvents: 'none',
}
const finalCtaContent: CSSProperties = {
  position: 'relative', zIndex: 1,
  display: 'flex', flexDirection: 'column', alignItems: 'center',
}
const finalCtaTitle: CSSProperties = {
  fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 900,
  color: 'var(--text-main)', margin: '0 0 20px', letterSpacing: '-0.8px',
}
const finalCtaDesc: CSSProperties = {
  fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.65,
  maxWidth: 560, margin: '0 0 36px',
}

// ── Footer ────────────────────────────────────────────────────────────────────
const footerStyle: CSSProperties = {
  background: 'var(--bg-footer)',
  borderTop: '1px solid var(--border-color)',
  padding: '60px 24px 40px',
}
const footerInner: CSSProperties = {
  maxWidth: 1200, margin: '0 auto',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
}
const footerTagline: CSSProperties = {
  fontSize: 14, color: 'var(--text-muted)', margin: 0,
}
const footerLinks: CSSProperties = { display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }
const footerLink: CSSProperties = {
  textDecoration: 'none', color: 'var(--text-muted)', fontSize: 14,
  fontWeight: 500, transition: 'color 0.2s',
}
const footerCopy: CSSProperties = { fontSize: 13, color: 'var(--text-muted)', margin: 0 }
