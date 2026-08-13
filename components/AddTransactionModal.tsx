"use client";

import { useState } from "react";
import { C, CATEGORIES, INCOME_CATS } from "@/lib/constants";
import { useData } from "@/components/providers/DataProvider";

type Mode = "expense" | "income";

interface Props { onClose: () => void; }

export function AddTransactionModal({ onClose }: Props) {
  const { addTx, addIncomeFn, isPending } = useData();
  const [mode,        setMode]   = useState<Mode>("expense");
  const [category,    setCat]    = useState("alimentacao");
  const [incomeCat,   setIncomeCat] = useState("outro");
  const [amount,      setAmt]    = useState("");
  const [description, setDesc]   = useState("");
  const [date,        setDate]   = useState(new Date().toISOString().split("T")[0]);

  const selectedCat = CATEGORIES.find(c => c.id === category)!;
  const canSubmit   = !!amount && parseFloat(amount) > 0 && !!description.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const n = parseFloat(amount);
    if (mode === "expense") {
      await addTx({ category, amount:n, description:description.trim(), date, futile:selectedCat.futile });
    } else {
      await addIncomeFn({ amount:n, description:description.trim(), category:incomeCat, date });
    }
    onClose();
  };

  return (
    <div role="dialog" aria-modal="true"
      style={{
        position:"fixed", inset:0, zIndex:200,
        background:"rgba(0,0,0,0.78)", backdropFilter:"blur(10px)",
        display:"flex", alignItems:"flex-end",
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background:C.card, borderRadius:"24px 24px 0 0",
        border:`1px solid ${C.border}`,
        width:"100%", maxWidth:430, margin:"0 auto",
        padding:"20px 20px 48px",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontSize:18, fontWeight:700 }}>Novo Registro</span>
          <button onClick={onClose} style={{
            background:C.raised, color:C.sub, borderRadius:10,
            width:32, height:32, display:"flex", alignItems:"center",
            justifyContent:"center", border:"none", cursor:"pointer", fontFamily:"inherit",
          }}>✕</button>
        </div>

        <div style={{
          display:"grid", gridTemplateColumns:"1fr 1fr",
          background:C.raised, borderRadius:14, padding:4, marginBottom:16,
        }}>
          {([
            { id:"expense" as Mode, label:"💸 Gasto",   color:C.coral },
            { id:"income"  as Mode, label:"💰 Entrada",  color:C.pink  },
          ]).map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{
              borderRadius:11, padding:"10px 0",
              background: mode === m.id ? m.color : "transparent",
              color:       mode === m.id ? (m.id==="expense"?"#fff":C.bg) : C.muted,
              fontWeight:  mode === m.id ? 700 : 500,
              fontSize:13, border:"none", cursor:"pointer", fontFamily:"inherit",
              transition:"all .2s",
            }}>{m.label}</button>
          ))}
        </div>

        <label style={{ display:"block", marginBottom:14 }}>
          <span style={{ display:"block", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Valor</span>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16, color:C.sub, pointerEvents:"none" }}>R$</span>
            <input type="number" inputMode="decimal" placeholder="0,00" value={amount}
              onChange={e => setAmt(e.target.value)}
              style={{
                width:"100%", background:C.raised, border:`1px solid ${C.border}`,
                borderRadius:14, padding:"14px 14px 14px 48px",
                color:C.text, fontSize:22, fontWeight:700, outline:"none", fontFamily:"inherit",
              }}
            />
          </div>
        </label>

        <label style={{ display:"block", marginBottom:14 }}>
          <span style={{ display:"block", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Descrição</span>
          <input type="text"
            placeholder={mode==="expense" ? "Ex: Almoço no restaurante" : "Ex: Salário de agosto"}
            value={description} onChange={e => setDesc(e.target.value)}
            style={{
              width:"100%", background:C.raised, border:`1px solid ${C.border}`,
              borderRadius:14, padding:"12px 14px",
              color:C.text, fontSize:14, outline:"none", fontFamily:"inherit",
            }}
          />
        </label>

        <label style={{ display:"block", marginBottom:14 }}>
          <span style={{ display:"block", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Data</span>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{
              width:"100%", background:C.raised, border:`1px solid ${C.border}`,
              borderRadius:14, padding:"12px 14px",
              color:C.text, fontSize:14, outline:"none", fontFamily:"inherit", colorScheme:"dark",
            }}
          />
        </label>

        <div style={{ marginBottom:22 }}>
          <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>
            Categoria {mode==="expense" && selectedCat.futile && <span style={{ color:C.coral, marginLeft:6 }}>⚠️ fútil</span>}
          </div>
          {mode === "expense" ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
              {CATEGORIES.map(c => {
                const sel = category === c.id;
                return (
                  <button key={c.id} onClick={() => setCat(c.id)} style={{
                    background: sel ? `${c.color}28` : C.raised,
                    border:`2px solid ${sel ? c.color : "transparent"}`,
                    borderRadius:12, padding:"8px 4px",
                    display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                    cursor:"pointer", fontFamily:"inherit", transition:"all .15s",
                  }}>
                    <span style={{ fontSize:20 }}>{c.emoji}</span>
                    <span style={{ fontSize:8, color:sel?c.color:C.muted, fontWeight:600, textAlign:"center" }}>
                      {c.label.split("/")[0].split(" ")[0]}
                    </span>
                    {c.futile && <span style={{ fontSize:7, color:C.coral }}>fútil</span>}
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
              {INCOME_CATS.map(c => {
                const sel = incomeCat === c.id;
                return (
                  <button key={c.id} onClick={() => setIncomeCat(c.id)} style={{
                    background: sel ? `${C.pink}22` : C.raised,
                    border:`2px solid ${sel ? C.pink : "transparent"}`,
                    borderRadius:12, padding:"10px 6px",
                    display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                    cursor:"pointer", fontFamily:"inherit", transition:"all .15s",
                  }}>
                    <span style={{ fontSize:22 }}>{c.emoji}</span>
                    <span style={{ fontSize:9, color:sel?C.pink:C.muted, fontWeight:600, textAlign:"center", lineHeight:1.2 }}>
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button onClick={handleSubmit} disabled={isPending || !canSubmit} style={{
          width:"100%",
          background: !canSubmit ? C.raised
            : mode==="expense"
              ? `linear-gradient(135deg,#be185d,${C.pinkDk})`
              : `linear-gradient(135deg,${C.pinkDk},${C.pink})`,
          color: !canSubmit ? C.muted : mode==="income" ? C.bg : "#fff",
          borderRadius:16, padding:16, fontSize:16, fontWeight:700,
          border:"none", cursor:!canSubmit?"not-allowed":"pointer",
          fontFamily:"inherit", transition:"all .2s",
        }}>
          {isPending ? "Salvando…" : mode==="expense" ? "✓ Registrar Gasto" : "✓ Registrar Entrada"}
        </button>
      </div>
    </div>
  );
}
