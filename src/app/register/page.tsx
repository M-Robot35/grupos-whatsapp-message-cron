'use client'

import { CSSProperties, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

export default function RegisterPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const form = new FormData(e.currentTarget)
        const name = form.get('name') as string
        const email = form.get('email') as string
        const password = form.get('password') as string

        const { error: authError } = await authClient.signUp.email({ name, email, password })

        if (authError) {
            setError(authError.message ?? 'Erro ao criar conta. Tente novamente.')
            setLoading(false)
            return
        }

        // Redireciona para login após registro bem-sucedido
        router.replace('/login?registered=true')
    }

    return (
        <div style={pageWrapperStyle}>
            <div style={cardStyle}>
                <div style={logoWrapperStyle}>
                    <Link href="/" style={logoStyle}>
                        <span style={logoIconStyle}>⚡</span>
                        <span style={logoTextStyle}>ZapCron</span>
                    </Link>
                </div>

                <h1 style={titleStyle}>Crie sua conta</h1>
                <p style={subtitleStyle}>Comece a automatizar suas vendas hoje mesmo</p>

                {error && <div style={errorStyle}>{error}</div>}

                <form style={formStyle} onSubmit={handleSubmit}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle} htmlFor="name">Nome completo</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            style={inputStyle}
                            placeholder="Maria Silva"
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle} htmlFor="email">E-mail</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            style={inputStyle}
                            placeholder="voce@empresa.com"
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle} htmlFor="password">Senha</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={8}
                            autoComplete="new-password"
                            style={inputStyle}
                            placeholder="Mínimo 8 caracteres"
                        />
                    </div>

                    <button type="submit" style={buttonStyle} disabled={loading}>
                        {loading ? 'Criando conta...' : 'Cadastrar-se'}
                    </button>
                </form>

                <p style={footerTextStyle}>
                    Já tem uma conta? <Link href="/login" style={linkStyle}>Faça Login</Link>
                </p>
            </div>
        </div>
    )
}

// --- Styles ---
const pageWrapperStyle: CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
}

const cardStyle: CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--card-border)',
    borderRadius: '24px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: 'var(--shadow-card)',
    backdropFilter: 'blur(20px)',
}

const logoWrapperStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '32px',
}

const logoStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
}

const logoIconStyle: CSSProperties = { fontSize: '28px' }

const logoTextStyle: CSSProperties = {
    fontSize: '26px',
    fontWeight: 800,
    background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    letterSpacing: '-0.5px',
}

const titleStyle: CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-main)',
    textAlign: 'center',
    margin: '0 0 8px 0',
}

const subtitleStyle: CSSProperties = {
    fontSize: '15px',
    color: 'var(--text-muted)',
    textAlign: 'center',
    margin: '0 0 32px 0',
}

const errorStyle: CSSProperties = {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#f87171',
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center',
}

const formStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
}

const inputGroupStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
}

const labelStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-main)',
}

const inputStyle: CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    background: 'transparent',
    color: 'var(--text-main)',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
}

const linkStyle: CSSProperties = {
    fontSize: '14px',
    color: '#38bdf8',
    textDecoration: 'none',
    fontWeight: 600,
}

const buttonStyle: CSSProperties = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'opacity 0.2s',
    boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.3)',
}

const footerTextStyle: CSSProperties = {
    textAlign: 'center',
    fontSize: '15px',
    color: 'var(--text-muted)',
    margin: '24px 0 0',
}
