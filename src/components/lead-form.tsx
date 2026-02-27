'use client'

import { CSSProperties, FormEvent, useState } from 'react'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome com pelo menos 2 caracteres.'),
  email: z.string().trim().email('Digite um e-mail válido.')
})

type AlertState = {
  type: 'success' | 'error'
  message: string
}

export function LeadForm() {
  const [alert, setAlert] = useState<AlertState | null>(null)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    const parsed = leadSchema.safeParse({
      name: form.get('name'),
      email: form.get('email')
    })

    if (!parsed.success) {
      setAlert({
        type: 'error',
        message: parsed.error.issues[0]?.message ?? 'Dados inválidos. Revise os campos.'
      })
      return
    }

    setAlert({
      type: 'success',
      message: 'Perfeito! Você entrou na lista de prioridade.'
    })
    event.currentTarget.reset()
  }

  return (
    <form onSubmit={onSubmit} aria-describedby="lead-form-alert" style={{ display: 'grid', gap: 12 }}>
      <label>
        Nome
        <input
          name="name"
          type="text"
          required
          aria-required="true"
          style={inputStyle}
          placeholder="Seu nome"
        />
      </label>

      <label>
        E-mail
        <input
          name="email"
          type="email"
          required
          aria-required="true"
          style={inputStyle}
          placeholder="voce@empresa.com"
        />
      </label>

      <button type="submit" style={buttonStyle}>
        Quero começar
      </button>

      <div id="lead-form-alert" role="status" aria-live="polite" style={{ minHeight: 24 }}>
        {alert ? (
          <p style={{ color: alert.type === 'error' ? '#dc2626' : '#166534', margin: 0 }}>{alert.message}</p>
        ) : null}
      </div>
    </form>
  )
}

const inputStyle: CSSProperties = {
  width: '100%',
  marginTop: 4,
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid #cbd5e1'
}

const buttonStyle: CSSProperties = {
  padding: '12px 16px',
  borderRadius: 10,
  border: 0,
  fontWeight: 700,
  background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
  color: '#fff',
  cursor: 'pointer'
}
