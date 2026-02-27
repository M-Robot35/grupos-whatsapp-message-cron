import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'sans-serif', margin: 0, padding: 24 }}>{children}</body>
    </html>
  )
}
