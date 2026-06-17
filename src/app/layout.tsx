import './styles/globals.css'

export const metadata = {
  title: 'Portfólio Lucas Dias',
  description: 'Portfólio jogável de Lucas Dias - game 2D plataforma com projetos e stacks.'
}

export default function RootLayout({ children }:{ children: React.ReactNode }){
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
