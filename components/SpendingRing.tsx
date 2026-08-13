"use client";

import { C, brl } from "@/lib/constants";

interface Props { pct: number; remaining: number; balance: number; }

export function SpendingRing({ pct, remaining, balance }: Props) {
  const R    = 72;
  const CIRC = 2 * Math.PI * R;
  const dash = (Math.min(pct, 100) / 100) * CIRC;
  const color  = pct < 60 ? C.pink : pct < 85 ? C.amber : C.coral;
  const status = pct < 60 ? "ðŸŒ¸ SaudÃ¡vel" : pct < 85 ? "âš ï¸ AtenÃ§Ã£o" : "ðŸ”´ Cuidado";

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
      <div style={{ position:"relative", width:184, height:184 }}>
        <svg width="184" height="184" viewBox="0 0 184 184"
          role="img" aria-label={`Gasto ${Math.round(pct)}% do orÃ§amento`}>
          <circle cx="92" cy="92" r={R} fill="none"
            stroke={C.raised} strokeWidth="16" transform="rotate(-90 92 92)" />
          <circle cx="92" cy="92" r={R} fill="none"
            stroke={color} strokeWidth="16" strokeLinecap="round"
            strokeDasharray={`${dash} ${CIRC}`}
            transform="rotate(-90 92 92)"
            style={{ transition:"stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1), stroke .5s" }}
          />
        </svg>
        <div style={{
          position:"absolute", inset:0,
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", gap:2, pointerEvents:"none",
        }}>
          <span style={{ fontSize:10, color:C.sub, letterSpacing:"0.14em", textTransform:"uppercase" }}>GASTO</span>
          <span style={{ fontSize:30, fontWeight:700, color, lineHeight:1 }}>{Math.round(pct)}%</span>
          <span style={{ fontSize:11, color:C.sub }}>do orÃ§amento</span>
        </div>
      </div>
      <div style={{
        display:"flex", gap:12, alignItems:"center",
        background:C.raised, borderRadius:20, padding:"6px 16px",
      }}>
        <span style={{ fontSize:12, fontWeight:500 }}>{status}</span>
        <span style={{ color:C.border }}>Â·</span>
        <span style={{ fontSize:12, color: balance >= 0 ? C.pink : C.coral, fontWeight:600 }}>
          {balance >= 0 ? "+" : ""}{brl(balance)} saldo
        </span>
      </div>
    </div>
  );
}

