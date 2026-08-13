"use client";

import { useData } from "@/components/providers/DataProvider";
import { C, BADGES, LEVELS } from "@/lib/constants";

export default function AchievementsPage() {
  const { profile, badges, xp, levelInfo, unlockedSet } = useData();

  const streak       = profile?.streak_days ?? 0;
  const streakRecord = profile?.streak_record ?? streak;
  const currentLevel = LEVELS[levelInfo.lvlIdx];
  const nextLevel    = LEVELS[levelInfo.lvlIdx + 1];

  const unlockedBadges = BADGES.filter(b => unlockedSet.has(b.id));
  const lockedBadges   = BADGES.filter(b => !unlockedSet.has(b.id));

  return (
    <>
      <header style={{
        position:"sticky", top:0, zIndex:50,
        background:`${C.bg}ee`, backdropFilter:"blur(14px)",
        borderBottom:`1px solid ${C.border}`,
        padding:"14px 18px 10px",
      }}>
        <div style={{ fontSize:10, color:C.violet, fontWeight:600, letterSpacing:"0.16em", marginBottom:2 }}>
          CONQUISTAS
        </div>
        <div style={{ fontSize:20, fontWeight:700 }}>ðŸ† Sua EvoluÃ§Ã£o</div>
      </header>

      <main style={{ padding:"18px 16px" }}>

        {/* Level card */}
        <section style={{
          background:"linear-gradient(150deg,#1a0f40,#0C1929 70%)",
          border:`1px solid ${C.violet}45`,
          borderRadius:22, padding:20, marginBottom:14,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
            <div style={{
              width:58, height:58, borderRadius:17, flexShrink:0,
              background:`linear-gradient(135deg,${C.violetDk},${C.violet})`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:26,
            }}>{currentLevel.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{
                fontSize:10, color:C.violet, fontWeight:600,
                letterSpacing:"0.13em", textTransform:"uppercase",
              }}>NÃ­vel {levelInfo.lvlIdx + 1}</div>
              <div style={{ fontSize:20, fontWeight:700, lineHeight:1.2 }}>
                {currentLevel.name}
              </div>
              <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>
                {xp} XP total Â· {unlockedBadges.length}/{BADGES.length} conquistas
              </div>
            </div>
          </div>

          <div style={{ fontSize:11, color:C.sub, display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span>
              {nextLevel ? `Progresso para ${nextLevel.name}` : "NÃ­vel mÃ¡ximo atingido! ðŸŒŸ"}
            </span>
            {nextLevel && (
              <span style={{ color:C.violet, fontWeight:600 }}>
                {levelInfo.progressXP}/{levelInfo.neededXP} XP
              </span>
            )}
          </div>

          <div style={{ height:8, background:C.raised, borderRadius:8 }}>
            <div style={{
              height:8, borderRadius:8,
              background:`linear-gradient(90deg,${C.violetDk},${C.violet})`,
              width:`${levelInfo.pct}%`,
              transition:"width 1.2s ease",
              boxShadow:`0 0 10px ${C.violet}55`,
            }} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:14 }}>
            {[
              { label:"Total XP",    value:xp                  },
              { label:"Badges",      value:`${unlockedBadges.length}/${BADGES.length}` },
              { label:"PrÃ³x. nÃ­vel", value: nextLevel ? `${levelInfo.neededXP - levelInfo.progressXP} XP` : "MAX" },
            ].map(s => (
              <div key={s.label} style={{
                background:`${C.violet}10`, borderRadius:12,
                padding:"8px 0", textAlign:"center",
              }}>
                <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                  {s.label}
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:C.violet, marginTop:2 }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Streak calendar */}
        <section style={{
          background:C.card, borderRadius:20,
          border:`1px solid ${C.border}`,
          padding:16, marginBottom:14,
        }}>
          <h2 style={{ fontSize:15, fontWeight:700, margin:"0 0 4px" }}>ðŸ”¥ SequÃªncia de Registros</h2>
          <p style={{ fontSize:11, color:C.sub, margin:"0 0 12px" }}>
            {streak} dias ativos Â· Recorde: {streakRecord} dias
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
            {Array.from({ length:Math.min(streak + 10, 31) }, (_, i) => (
              <div key={i} style={{
                width:28, height:28, borderRadius:7,
                background: i < streak
                  ? `linear-gradient(135deg,${C.amber},${C.coral})`
                  : C.raised,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:9, fontWeight:700,
                color: i < streak ? "#fff" : C.muted,
                border: i === streak - 1 ? `2px solid ${C.amber}` : "none",
              }}>{i + 1}</div>
            ))}
          </div>
          {streak === 0 && (
            <p style={{ fontSize:12, color:C.muted, margin:"8px 0 0", textAlign:"center" }}>
              Adicione seu primeiro gasto para iniciar a sequÃªncia! ðŸš€
            </p>
          )}
        </section>

        {/* Unlocked badges */}
        {unlockedBadges.length > 0 && (
          <>
            <div style={{
              fontSize:11, color:C.pink, fontWeight:600,
              letterSpacing:"0.07em", marginBottom:8,
            }}>
              DESBLOQUEADAS ({unlockedBadges.length})
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
              {unlockedBadges.map(b => (
                <div key={b.id} style={{
                  background:"linear-gradient(145deg,#0b1a0f,#0C1929)",
                  border:`1px solid ${C.pink}35`,
                  borderRadius:16, padding:14,
                  transition:"transform .2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.transform="scale(1.04)")}
                  onMouseLeave={e => (e.currentTarget.style.transform="scale(1)")}
                >
                  <div style={{ fontSize:28, marginBottom:6 }}>{b.emoji}</div>
                  <div style={{ fontSize:13, fontWeight:700 }}>{b.title}</div>
                  <div style={{ fontSize:11, color:C.sub, marginTop:2, lineHeight:1.3 }}>{b.desc}</div>
                  <div style={{ marginTop:8, fontSize:11, fontWeight:600, color:C.pink }}>
                    +{b.xp} XP
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Locked badges */}
        {lockedBadges.length > 0 && (
          <>
            <div style={{
              fontSize:11, color:C.muted, fontWeight:600,
              letterSpacing:"0.07em", marginBottom:8,
            }}>
              BLOQUEADAS ({lockedBadges.length})
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {lockedBadges.map(b => (
                <div key={b.id} style={{
                  background:C.card, border:`1px solid ${C.border}`,
                  borderRadius:16, padding:14, opacity:0.42,
                }}>
                  <div style={{ fontSize:28, marginBottom:6, filter:"grayscale(1)" }}>{b.emoji}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.sub }}>{b.title}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:2, lineHeight:1.3 }}>{b.desc}</div>
                  <div style={{ marginTop:8, fontSize:11, fontWeight:600, color:C.muted }}>
                    +{b.xp} XP ðŸ”’
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}

