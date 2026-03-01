import type { ReactNode } from 'react'
import './globals.css'

export const metadata = {
  title: 'ZapCron | Automação Inteligente para WhatsApp',
  description: 'Pare de perder vendas por não postar seus achadinhos diariamente. Agende disparos, gerencie múltiplas instâncias e venda mais no WhatsApp com o ZapCron.',
}

export default async function RootLayout({ children }: { children: ReactNode }) {

  const themeInitScript = `
    (function() {
      try {
        var localTheme = localStorage.getItem('theme');
        var theme = localTheme || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {}
    })();
  `

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --bg-body: #f8fafc;
            --bg-header: rgba(255, 255, 255, 0.88);
            --bg-card: rgba(255, 255, 255, 0.92);
            --bg-footer: #f1f5f9;

            --text-main: #0f172a;
            --text-muted: #475569;
            --text-card-p: #64748b;

            --border-color: rgba(226, 232, 240, 0.9);
            --card-border: rgba(203, 213, 225, 0.6);

            --btn-ghost-color: #475569;
            --btn-ghost-hover: #0f172a;

            --shadow-card: 0 20px 50px -15px rgba(15, 23, 42, 0.08);
          }

          :root[data-theme='dark'] {
            --bg-body: #020617;
            --bg-header: rgba(2, 6, 23, 0.88);
            --bg-card: rgba(15, 23, 42, 0.65);
            --bg-footer: #020617;

            --text-main: #f1f5f9;
            --text-muted: #94a3b8;
            --text-card-p: #cbd5e1;

            --border-color: rgba(30, 41, 59, 0.9);
            --card-border: rgba(51, 65, 85, 0.55);

            --btn-ghost-color: #cbd5e1;
            --btn-ghost-hover: #ffffff;

            --shadow-card: 0 25px 50px -15px rgba(0, 0, 0, 0.55);
          }

          *, *::before, *::after { box-sizing: border-box; }

          html { scroll-behavior: smooth; }

          body {
            font-family: 'Inter', 'system-ui', -apple-system, BlinkMacSystemFont,
              'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--bg-body);
            color: var(--text-main);
            transition: background-color 0.3s ease, color 0.3s ease;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          /* ── Hover micro-animations ── */
          a[href="/register"]:hover,
          a[href^="/register"]:hover {
            opacity: 0.9;
            transform: translateY(-1px);
          }

          /* Card hover lift */
          article:hover {
            transform: translateY(-4px);
            box-shadow: 0 32px 60px -15px rgba(37,99,235,0.12);
          }

          /* Nav link hover */
          nav a:hover {
            color: var(--text-main) !important;
          }

          /* Scrollbar minimal */
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb {
            background: var(--card-border);
            border-radius: 3px;
          }

          /* Responsive: hide desktop nav on mobile */
          @media (max-width: 768px) {
            nav[style*="flex"] { display: none !important; }
            button[aria-label="Menu"] { display: flex !important; }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
