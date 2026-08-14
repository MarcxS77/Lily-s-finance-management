import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lilys — Maturidade Financeira",
  description: "Controle seus gastos, entradas e conquiste sua independÃªncia financeira.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{
        margin:0, padding:0,
        background:"#0E0812",
        fontFamily:"'Space Grotesk', system-ui, sans-serif",
        WebkitFontSmoothing:"antialiased",
      }}>
        {children}
      </body>
    </html>
  );
}

