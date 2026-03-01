'use client'

import { CSSProperties, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const form = new FormData(e.currentTarget)
        const email = form.get('email') as string
        const password = form.get('password') as string

        const { error: authError } = await authClient.signIn.email({ email, password })

        if (authError) {
            setError(authError.message ?? 'Credenciais inválidas. Tente novamente.')
            setLoading(false)
            return
        }

        // Redireciona para onde o usuário estava tentando ir (ou dashboard)
        const from = searchParams.get('from') ?? '/dashboard'
        router.replace(from as any)
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

                <h1 style={titleStyle}>Bem-vindo de volta</h1>
                <p style={subtitleStyle}>Faça login para gerenciar suas automações</p>

                {error && <div style={errorStyle}>{error}</div>}

                <form style={formStyle} onSubmit={handleSubmit}>
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
                            autoComplete="current-password"
                            style={inputStyle}
                            placeholder="••••••••"
                        />
                    </div>

                    <div style={forgotPasswordWrapperStyle}>
                        <a href="#" style={linkStyle}>Esqueceu a senha?</a>
                    </div>

                    <button type="submit" style={buttonStyle} disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar na conta'}
                    </button>
                </form>

                <p style={footerTextStyle}>
                    Ainda não tem conta? <Link href="/register" style={linkStyle}>Cadastre-se</Link>
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

const forgotPasswordWrapperStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
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
    opacity: 1,
}

const footerTextStyle: CSSProperties = {
    textAlign: 'center',
    fontSize: '15px',
    color: 'var(--text-muted)',
    margin: '24px 0 0',
}
