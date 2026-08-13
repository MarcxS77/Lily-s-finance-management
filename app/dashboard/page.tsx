"use client";

import { useState } from "react";
import { useData } from "@/components/providers/DataProvider";
import { SpendingRing } from "@/components/SpendingRing";
import { C, brl, getCat, getIncomeCat, fmtDate, LEVELS, APP_NAME, APP_EMOJI } from "@/lib/constants";

export default function HomePage() {
  const {
    user, profile, transactions, incomes,
    total, futiles, essential, totalIncome, balance,
    catData, levelInfo, deleteTx, deleteIncomeFn,
  } = useData();

  const [showAll,    setShowAll]    = useState(false);
  const [activeList, setActiveList] = useState<"expenses" | "incomes">("expenses");

  const budget    = profile?.monthly_budget ?? 3000;
  const salary    = profile?.salary ?? 0;
  const pct       = (total / budget) * 100;
  const remaining = budget - total;
  const level     = LEVELS[levelInfo.lvlIdx];

  const displayName = profile?.display_name || user.name.split(" ")[0];

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header style={{
        position:"sticky", top:0, zIndex:50,
        background:`${C.bg}ee`, backdropFilter:"blur(14px)",
        borderBottom:`1px solid ${C.border}`,
        padding:"14px 18px 10px",
      }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:10, color:C.pink, fontWeight:600, letterSpacing:"0.16em", marginBottom:2 }}>
              {new Date().toLocaleDateString("pt-BR",{month:"long",year:"numeric"}).toUpperCase()}
            </div>
            <div style={{ fontSize:20, fontWeight:700 }}>{APP_EMOJI} {APP_NAME}</div>
          </div>
          <div style={{
            background:`${C.violetDk}28`, border:`1px solid ${C.violet}50`,
            borderRadius:12, padding:"5px 10px",
            fontSize:11, fontWeight:600, color:C.violet,
          }}>
            {level.icon} Nível {levelInfo.lvlIdx + 1}
          </div>
        </div>
      </header>

      <main style={{ padding:"18px 16px" }}>

        {/* Welcome */}
        {salary > 0 && (
          <div style={{ fontSize:13, color:C.sub, marginBottom:12, textAlign:"center" }}>
            Olá, <strong style={{ color:C.text }}>{displayName}</strong>!
            Salário: <strong style={{ color:C.pink }}>{brl(salary)}</strong>
          </div>
        )}

        {/* Spending ring */}
        <section style={{
          background:`linear-gradient(150deg,#2a0a2a,${C.card})`,
          borderRadius:20, border:`1px solid ${C.border}`,
          padding:"22px 16px", marginBottom:14, textAlign:"center",
        }}>
          <SpendingRing pct={pct} remaining={remaining} balance={balance} />

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, marginTop:16 }}>
            {[
              { label:"Entradas",   value:brl(totalIncome), color:C.pink  },
              { label:"Gastos",     value:brl(total),       color:C.coral },
              { label:"Fúteis",     value:brl(futiles),     color:C.amber },
              { label:"Essenciais", value:brl(essential),   color:C.sub   },
            ].map(s => (
              <div key={s.label} style={{
                background:C.raised, borderRadius:12, padding:"8px 4px",
                border:`1px solid ${C.border}`, textAlign:"center",
              }}>
                <div style={{ fontSize:8, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>
                  {s.label}
                </div>
                <div style={{ fontSize:11, fontWeight:700, color:s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Futile alert */}
        {futiles > total * 0.25 && (
          <div style={{
            background:`${C.coral}0d`, border:`1px solid ${C.coral}35`,
            borderRadius:16, padding:"12px 14px", marginBottom:14,
            display:"flex", gap:10, alignItems:"flex-start",
          }}>
            <span style={{ fontSize:20, flexShrink:0 }}>⚠️</span>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:C.coral }}>Gastos fúteis em alta</div>
              <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>
                {brl(futiles)} ({((futiles/total)*100).toFixed(0)}% do total) são gastos fúteis
              </div>
            </div>
          </div>
        )}

        {/* AI Coach — Em Breve */}
        <section style={{
          background:`linear-gradient(150deg,#1c0a1c,${C.card})`,
          border:`1px solid ${C.pink}25`,
          borderRadius:20, padding:16, marginBottom:14,
          position:"relative", overflow:"hidden",
        }}>
          <div style={{
            position:"absolute", top:12, right:12,
            background:`${C.pink}20`, border:`1px solid ${C.pink}50`,
            borderRadius:20, padding:"3px 10px",
            fontSize:9, fontWeight:700, color:C.pink, letterSpacing:"0.12em",
          }}>EM BREVE</div>

          <div style={{ fontSize:13, fontWeight:700, color:C.pink, marginBottom:4 }}>
            🤖 Coach Financeiro por IA
          </div>
          <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>
            Análise inteligente personalizada dos seus gastos
          </div>
          <div style={{
            background:`${C.pink}08`, border:`1px solid ${C.pink}15`,
            borderRadius:12, padding:"12px 14px",
          }}>
            <div style={{ fontSize:12, color:C.sub, lineHeight:1.6 }}>
              🌸 Dicas personalizadas baseadas no seu histórico<br/>
              💡 Identificação automática de desperdícios<br/>
              📈 Metas inteligentes de economia<br/>
              🎯 Planejamento financeiro com IA
            </div>
          </div>
        </section>

        {/* Transactions / Income tabs */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ display:"flex", gap:2, background:C.raised, borderRadius:12, padding:3 }}>
            {(["expenses","incomes"] as const).map(t => (
              <button key={t} onClick={() => setActiveList(t)} style={{
                borderRadius:9, padding:"6px 12px", fontSize:11, fontWeight:600,
                background: activeList===t ? (t==="expenses"?C.coral:C.pink) : "transparent",
                color:      activeList===t ? (t==="incomes"?C.bg:"#fff") : C.muted,
                border:"none", cursor:"pointer", fontFamily:"inherit", transition:"all .2s",
              }}>
                {t==="expenses" ? `💸 Gastos (${transactions.length})` : `💰 Entradas (${incomes.length})`}
              </button>
            ))}
          </div>
          <button onClick={() => setShowAll(v => !v)} style={{
            background:"none", border:"none", color:C.pink,
            fontSize:11, cursor:"pointer", fontFamily:"inherit", padding:0,
          }}>
            {showAll ? "menos" : "todas"}
          </button>
        </div>

        {activeList === "expenses" ? (
          transactions.length === 0 ? (
            <EmptyState text="Nenhum gasto este mês" />
          ) : (
            (showAll ? transactions : transactions.slice(0,5)).map(tx => {
              const cat = getCat(tx.category);
              return (
                <div key={tx.id} style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"11px 12px", background:C.card, borderRadius:14,
                  marginBottom:8, border:`1px solid ${C.border}`,
                }}>
                  <div style={{
                    width:40, height:40, borderRadius:12, flexShrink:0,
                    background:`${cat.color}22`,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
                  }}>{cat.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {tx.description}
                    </div>
                    <div style={{ fontSize:11, color:C.muted, marginTop:2, display:"flex", alignItems:"center", gap:5 }}>
                      <span>{cat.label}</span><span>·</span><span>{fmtDate(tx.date)}</span>
                      {tx.futile && <span style={{ fontSize:9, color:C.coral, background:`${C.coral}18`, padding:"1px 5px", borderRadius:5 }}>fútil</span>}
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:tx.futile?C.coral:C.text }}>
                      -{brl(tx.amount)}
                    </div>
                    <button onClick={() => deleteTx(tx.id)} style={{
                      background:"none", border:"none", color:C.muted,
                      fontSize:10, cursor:"pointer", padding:"2px 0", fontFamily:"inherit",
                    }}>✕</button>
                  </div>
                </div>
              );
            })
          )
        ) : (
          incomes.length === 0 ? (
            <EmptyState text="Nenhuma entrada este mês" sub='Toque em ✦ e escolha "Entrada"' />
          ) : (
            (showAll ? incomes : incomes.slice(0,5)).map(inc => {
              const cat = getIncomeCat(inc.category);
              return (
                <div key={inc.id} style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"11px 12px", background:C.card, borderRadius:14,
                  marginBottom:8, border:`1px solid ${C.pink}25`,
                }}>
                  <div style={{
                    width:40, height:40, borderRadius:12, flexShrink:0,
                    background:`${C.pink}15`,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
                  }}>{cat.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {inc.description}
                    </div>
                    <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>
                      {cat.label} · {fmtDate(inc.date)}
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.pink }}>+{brl(inc.amount)}</div>
                    <button onClick={() => deleteIncomeFn(inc.id)} style={{
                      background:"none", border:"none", color:C.muted,
                      fontSize:10, cursor:"pointer", padding:"2px 0", fontFamily:"inherit",
                    }}>✕</button>
                  </div>
                </div>
              );
            })
          )
        )}
      </main>
    </>
  );
}

function EmptyState({ text, sub }: { text: string; sub?: string }) {
  return (
    <div style={{
      background:C.card, borderRadius:20, border:`1px solid ${C.border}`,
      padding:"32px 16px", textAlign:"center",
    }}>
      <div style={{ fontSize:32, marginBottom:8 }}>🌸</div>
      <div style={{ fontSize:14, fontWeight:600, color:C.sub }}>{text}</div>
      {sub && <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{sub}</div>}
    </div>
  );
}
