"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { C, APP_NAME } from "@/lib/constants";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
  };

  return (
    <div style={{
      minHeight:"100dvh", background:C.bg,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"0 28px", color:C.text,
      fontFamily:"'Space Grotesk', system-ui, sans-serif",
    }}>
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{
          width:80, height:80, borderRadius:24, margin:"0 auto 20px",
          background:`linear-gradient(135deg,${C.pinkDk},${C.pink})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:36, fontWeight:700, color:C.bg,
        }}>L</div>
        <h1 style={{ fontSize:40, fontWeight:700, margin:"0 0 8px", color:C.pink }}>
          {APP_NAME}
        </h1>
        <p style={{ fontSize:15, color:C.sub, margin:0, lineHeight:1.6 }}>
          Sua jornada para a maturidade financeira
        </p>
      </div>

      <div style={{
        width:"100%", maxWidth:340, background:C.card,
        borderRadius:20, border:`1px solid ${C.border}`,
        padding:"4px 20px", marginBottom:32,
      }}>
        {[
          "Dashboard de saude financeira personalizado",
          "Analise de gastos futeis e essenciais",
          "Sistema de conquistas e gamificacao",
          "Controle de entradas e saidas do mes",
        ].map((f, i, arr) => (
          <div key={f} style={{
            display:"flex", alignItems:"center", gap:12, padding:"14px 0",
            borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
          }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.pink, flexShrink:0 }}/>
            <span style={{ fontSize:13, color:C.sub }}>{f}</span>
          </div>
        ))}
      </div>

      <button onClick={handleGoogle} disabled={loading} style={{
        width:"100%", maxWidth:340,
        display:"flex", alignItems:"center", justifyContent:"center", gap:12,
        background:"#ffffff", color:"#1a1a1a", borderRadius:16, padding:"15px 24px",
        fontSize:16, fontWeight:600, border:"none",
        cursor:loading ? "wait" : "pointer", fontFamily:"inherit",
        opacity:loading ? 0.75 : 1, boxShadow:"0 4px 24px rgba(0,0,0,0.4)",
      }}>
        {loading ? "Conectando..." : <><GoogleIcon /> Entrar com Google</>}
      </button>

      <p style={{ fontSize:11, color:C.muted, marginTop:20, textAlign:"center" }}>
        Dados privados e protegidos.
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}