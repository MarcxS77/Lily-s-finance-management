import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lilys — Maturidade Financeira",
  description: "Controle seus gastos, entradas e conquiste sua independência financeira.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" style={{ overflowX:"hidden" }}>
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
        overflowX:"hidden",
        minHeight:"100dvh",
      }}>
        <div style={{
          width:"100%",
          maxWidth:430,
          margin:"0 auto",
          minHeight:"100dvh",
          background:"#0E0812",
          position:"relative",
          overflowX:"hidden",
        }}>
          {children}
        </div>
      </body>
    </html>
  );
}
