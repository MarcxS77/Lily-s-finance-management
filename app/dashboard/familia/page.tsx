"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useData } from "@/components/providers/DataProvider";
import { createClient } from "@/lib/supabase/client";
import { C, brl } from "@/lib/constants";
import { createFamily, generateFamilyInvite, leaveFamily } from "@/lib/actions";

type MemberStat = {
  id: string; name: string; avatar_url: string | null;
  salary: number; spent: number; futile: number; income_entries: number;
};

const fmt = (s: number) =>
  `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

export default function FamiliaPage() {
  const { profile, user }  = useData();
  const router             = useRouter();
  const supabase           = createClient();

  const [familyName,      setFamilyName]      = useState("Nossa Família");
  const [familyData,      setFamilyData]      = useState<{name:string;created_by:string}|null>(null);
  const [members,         setMembers]         = useState<MemberStat[]>([]);
  const [loadingFam,      setLoadingFam]      = useState(false);
  const [creating,        setCreating]        = useState(false);
  const [invite,          setInvite]          = useState<{token:string;expires_at:string}|null>(null);
  const [timeLeft,        setTimeLeft]        = useState(0);
  const [copied,          setCopied]          = useState(false);
  const [generatingInvite,setGeneratingInvite]= useState(false);

  const hasFamily = !!profile?.family_id;

  const loadFamily = useCallback(async () => {
    if (!profile?.family_id) return;
    setLoadingFam(true);
    try {
      const [{ data: fam }, { data: stats }] = await Promise.all([
        supabase.from("families").select("name, created_by")
          .eq("id", profile.family_id).single(),
        supabase.rpc("get_family_stats", { p_family_id: profile.family_id }),
      ]);
      if (fam)   setFamilyData(fam as {name:string;created_by:string});
      if (stats) setMembers(stats as MemberStat[]);
    } catch(e) { console.error(e); }
    setLoadingFam(false);
  }, [profile?.family_id]);

  useEffect(() => { loadFamily(); }, [loadFamily]);

  useEffect(() => {
    if (!invite) return;
    const tick = () => {
      const left = Math.max(0, Math.floor((new Date(invite.expires_at).getTime() - Date.now()) / 1000));
      setTimeLeft(left);
      if (left === 0) setInvite(null);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [invite]);

  const handleCreate = async () => {
    setCreating(true);
    try { await createFamily(familyName); router.refresh(); }
    catch(e) { console.error(e); }
    setCreating(false);
  };

  const handleGenerateInvite = async () => {
    if (!profile?.family_id) return;
    setGeneratingInvite(true);
    try { setInvite(await generateFamilyInvite(profile.family_id)); }
    catch(e) { console.error(e); }
    setGeneratingInvite(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${invite?.token}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = async () => {
    if (!confirm("Tem certeza que quer sair da família?")) return;
    await leaveFamily(); router.refresh();
  };

  const famTotalIncome  = members.reduce((s, m) => s + m.income_entries + m.salary, 0);
  const famTotalSpent   = members.reduce((s, m) => s + m.spent, 0);
  const famBalance      = famTotalIncome - famTotalSpent;
  const famFutiles      = members.reduce((s, m) => s + m.futile, 0);
  const isAdmin         = familyData?.created_by === user.id;
  const comprometido    = famTotalIncome > 0 ? (famTotalSpent / famTotalIncome) * 100 : 0;

  return (
    <>
      <header style={{
        position:"sticky", top:0, zIndex:50,
        background:`${C.bg}ee`, backdropFilter:"blur(14px)",
        borderBottom:`1px solid ${C.border}`, padding:"14px 18px 10px",
      }}>
        <div style={{ fontSize:10, color:C.pink, fontWeight:600, letterSpacing:"0.16em", marginBottom:2 }}>
          FAMÍLIA
        </div>
        <div style={{ fontSize:20, fontWeight:700 }}>
          🏠 {familyData?.name || "Minha Família"}
        </div>
      </header>

      <main style={{ padding:"18px 16px" }}>
        {!hasFamily ? (
          <>
            <div style={{
              background:`linear-gradient(150deg,#2a0a2a,${C.card})`,
              border:`1px solid ${C.pink}30`,
              borderRadius:20, padding:28, marginBottom:16, textAlign:"center",
            }}>
              <div style={{ fontSize:52, marginBottom:12 }}>🏠</div>
              <div style={{ fontSize:17, fontWeight:700, marginBottom:8 }}>
                Crie ou entre em uma Família
              </div>
              <div style={{ fontSize:13, color:C.sub, lineHeight:1.6 }}>
                Junte-se com parceiro(a), família ou amigos para acompanhar as finanças do grupo.
              </div>
            </div>

            <div style={{
              background:C.card, border:`1px solid ${C.border}`,
              borderRadius:20, padding:16, marginBottom:14,
            }}>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>Criar uma Família</div>
              <input type="text" placeholder="Ex: Família Silva"
                value={familyName} onChange={e => setFamilyName(e.target.value)}
                style={{
                  width:"100%", background:C.raised, border:`1px solid ${C.border}`,
                  borderRadius:12, padding:"12px 14px",
                  color:C.text, fontSize:14, outline:"none",
                  fontFamily:"inherit", marginBottom:12,
                }}
              />
              <button onClick={handleCreate} disabled={creating} style={{
                width:"100%",
                background:`linear-gradient(135deg,${C.pinkDk},${C.pink})`,
                color:C.bg, borderRadius:14, padding:14,
                fontSize:15, fontWeight:700, border:"none",
                cursor:"pointer", fontFamily:"inherit",
              }}>
                {creating ? "Criando…" : "🏠 Criar Família"}
              </button>
            </div>

            <div style={{ textAlign:"center", fontSize:12, color:C.muted }}>
              ou peça um link de convite para alguém e acesse o link recebido
            </div>
          </>
        ) : (
          <>
            <section style={{
              background:`linear-gradient(150deg,#2a0a2a,${C.card})`,
              border:`1px solid ${C.pink}30`,
              borderRadius:20, padding:16, marginBottom:14,
            }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.pink, marginBottom:12 }}>
                🌸 Resultado Familiar — {new Date().toLocaleDateString("pt-BR",{month:"long",year:"numeric"})}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                {[
                  { label:"Entradas", value:brl(famTotalIncome), color:C.pink  },
                  { label:"Gastos",   value:brl(famTotalSpent),  color:C.coral },
                  { label:"Saldo",    value:(famBalance>=0?"+":"")+brl(famBalance), color:famBalance>=0?C.pink:C.coral },
                  { label:"Fúteis",   value:brl(famFutiles),     color:C.amber },
                ].map(s => (
                  <div key={s.label} style={{
                    background:C.raised, borderRadius:14,
                    padding:"12px 14px", border:`1px solid ${C.border}`,
                  }}>
                    <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize:15, fontWeight:700, color:s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              {famTotalIncome > 0 && (
                <div style={{ background:C.raised, borderRadius:12, padding:"10px 12px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.sub, marginBottom:6 }}>
                    <span>Saúde financeira familiar</span>
                    <span style={{ fontWeight:700, color:comprometido<70?C.pink:C.coral }}>
                      {comprometido.toFixed(0)}% comprometido
                    </span>
                  </div>
                  <div style={{ height:6, background:C.border, borderRadius:6 }}>
                    <div style={{
                      height:6, borderRadius:6,
                      background: comprometido < 70 ? C.pink : C.coral,
                      width:`${Math.min(comprometido, 100)}%`,
                      transition:"width 1s ease",
                    }} />
                  </div>
                </div>
              )}
            </section>

            <div style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>
              👥 Membros ({members.length})
            </div>

            {loadingFam ? (
              <div style={{ textAlign:"center", padding:24, color:C.muted, fontSize:13 }}>
                Carregando membros…
              </div>
            ) : members.map(m => {
              const income  = m.income_entries + m.salary;
              const balance = income - m.spent;
              const contrib = famTotalSpent > 0 ? (m.spent / famTotalSpent) * 100 : 0;
              return (
                <div key={m.id} style={{
                  background:C.card, border:`1px solid ${C.border}`,
                  borderRadius:16, padding:"14px 16px", marginBottom:10,
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                    {m.avatar_url ? (
                      <Image src={m.avatar_url} alt={m.name} width={40} height={40}
                        style={{ borderRadius:99, border:`2px solid ${C.pink}50` }} />
                    ) : (
                      <div style={{
                        width:40, height:40, borderRadius:99, flexShrink:0,
                        background:`linear-gradient(135deg,${C.violetDk},${C.pinkDk})`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:16, fontWeight:700, color:"#fff",
                      }}>{m.name.charAt(0)}</div>
                    )}
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700 }}>
                        {m.name}
                        {m.id === user.id && <span style={{ fontSize:10, color:C.pink, marginLeft:6 }}>(você)</span>}
                        {m.id === familyData?.created_by && <span style={{ fontSize:10, color:C.violet, marginLeft:6 }}>admin</span>}
                      </div>
                      <div style={{ fontSize:11, color:C.muted }}>{contrib.toFixed(0)}% dos gastos familiares</div>
                    </div>
                    <div style={{ fontSize:13, fontWeight:700, color: balance >= 0 ? C.pink : C.coral }}>
                      {balance >= 0 ? "+" : ""}{brl(balance)}
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:8 }}>
                    {[
                      { label:"Entradas", value:brl(income),   color:C.pink  },
                      { label:"Gastos",   value:brl(m.spent),  color:C.coral },
                      { label:"Fúteis",   value:brl(m.futile), color:C.amber },
                    ].map(s => (
                      <div key={s.label} style={{ background:C.raised, borderRadius:10, padding:"8px 6px", textAlign:"center" }}>
                        <div style={{ fontSize:9, color:C.muted, marginBottom:2 }}>{s.label}</div>
                        <div style={{ fontSize:11, fontWeight:700, color:s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ height:3, background:C.border, borderRadius:3 }}>
                    <div style={{ height:3, borderRadius:3, background:C.pink, opacity:0.5, width:`${contrib}%`, transition:"width 1s ease" }} />
                  </div>
                </div>
              );
            })}

            {isAdmin && (
              <section style={{
                background:`${C.pink}08`, border:`1px solid ${C.pink}25`,
                borderRadius:20, padding:16, marginTop:8, marginBottom:14,
              }}>
                <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>🔗 Convidar Membros</div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:14 }}>
                  Gere um link com validade de 15 minutos
                </div>
                {!invite ? (
                  <button onClick={handleGenerateInvite} disabled={generatingInvite} style={{
                    width:"100%",
                    background:`linear-gradient(135deg,${C.pinkDk},${C.pink})`,
                    color:C.bg, borderRadius:14, padding:13,
                    fontSize:14, fontWeight:700, border:"none",
                    cursor:"pointer", fontFamily:"inherit",
                  }}>
                    {generatingInvite ? "Gerando…" : "🔗 Gerar Link de Convite"}
                  </button>
                ) : (
                  <>
                    <div style={{
                      background:C.raised, border:`1px solid ${C.border}`,
                      borderRadius:12, padding:"10px 14px",
                      display:"flex", alignItems:"center", gap:10, marginBottom:12,
                    }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:9, color:C.muted, marginBottom:3 }}>Link de convite</div>
                        <div style={{ fontSize:11, color:C.pink, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {typeof window !== "undefined" ? window.location.origin : ""}/join/{invite.token}
                        </div>
                      </div>
                      <button onClick={handleCopy} style={{
                        background: copied ? `${C.pink}30` : `${C.pink}15`,
                        border:`1px solid ${C.pink}40`,
                        borderRadius:10, padding:"8px 12px",
                        fontSize:11, color:C.pink, fontWeight:700,
                        cursor:"pointer", fontFamily:"inherit", flexShrink:0,
                        transition:"all .2s",
                      }}>
                        {copied ? "✓ Copiado!" : "Copiar"}
                      </button>
                    </div>
                    <div style={{ textAlign:"center", marginBottom:8 }}>
                      <div style={{
                        fontSize:32, fontWeight:700,
                        color: timeLeft > 120 ? C.pink : timeLeft > 30 ? C.amber : C.coral,
                        fontFamily:"monospace", letterSpacing:"0.05em",
                      }}>
                        {fmt(timeLeft)}
                      </div>
                      <div style={{ fontSize:11, color:C.muted }}>para expirar</div>
                    </div>
                    <div style={{ height:4, background:C.border, borderRadius:4, marginBottom:10 }}>
                      <div style={{
                        height:4, borderRadius:4,
                        background: timeLeft > 120 ? C.pink : timeLeft > 30 ? C.amber : C.coral,
                        width:`${(timeLeft / 900) * 100}%`,
                        transition:"width 1s linear, background .5s",
                      }} />
                    </div>
                    <button onClick={handleGenerateInvite} style={{
                      width:"100%", background:"none",
                      border:`1px solid ${C.border}`,
                      color:C.muted, borderRadius:12, padding:10,
                      fontSize:12, cursor:"pointer", fontFamily:"inherit",
                    }}>
                      Gerar novo link
                    </button>
                  </>
                )}
              </section>
            )}

            <button onClick={handleLeave} style={{
              width:"100%", background:"none",
              border:`1px solid ${C.border}`,
              color:C.muted, borderRadius:14, padding:13,
              fontSize:13, cursor:"pointer", fontFamily:"inherit",
            }}>
              Sair da família
            </button>
          </>
        )}
      </main>
    </>
  );
}
