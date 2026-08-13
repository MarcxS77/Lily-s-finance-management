"use client";

import { useCallback } from "react";
import { useData } from "@/components/providers/DataProvider";
import { C, brl } from "@/lib/constants";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, ReferenceLine,
} from "recharts";

const TT = { background:"#280F28", border:"1px solid #3D1A3D", borderRadius:10, color:"#FDF2F8", fontSize:12 };
const DAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sab"];

export default function AnalyticsPage() {
  const { total, futiles, catData, summaries, profile, totalIncome, balance, transactions } = useData();
  const budget      = profile?.monthly_budget ?? 3000;
  const salary      = profile?.salary ?? 0;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

  const savingsLine = [...summaries].reverse().map(s => {
    const inc  = s.total_income + salary;
    const rate = inc > 0 ? ((inc - s.total_spent) / inc) * 100 : 0;
    return {
      month: new Date(s.month + "T12:00:00").toLocaleDateString("pt-BR", { month:"short", year:"2-digit" }),
      rate:  parseFloat(rate.toFixed(1)),
    };
  });

  const dayTotals = Array(7).fill(0);
  const dayCounts = Array(7).fill(0);
  transactions.forEach(tx => {
    const d = new Date(tx.date + "T12:00:00").getDay();
    dayTotals[d] += tx.amount;
    dayCounts[d]++;
  });
  const dayData = DAYS.map((name, i) => ({ name, value: parseFloat(dayTotals[i].toFixed(2)), count: dayCounts[i] }));
  const maxDay  = dayData.reduce((a, b) => b.value > a.value ? b : a, dayData[0]);

  const chartMonths = [...summaries].reverse().map(s => ({
    month:    new Date(s.month + "T12:00:00").toLocaleDateString("pt-BR", { month:"short" }),
    entradas: Math.round(s.total_income + salary),
    gastos:   Math.round(s.total_spent),
    futeis:   Math.round(s.futile_spent),
  }));

  const trend = summaries.length >= 2 ? summaries[0].total_spent - summaries[1].total_spent : null;

  const handlePDF = useCallback(() => {
    const monthName  = new Date().toLocaleDateString("pt-BR", { month:"long", year:"numeric" });
    const memberName = profile?.display_name || "Usuaria";
    const catRows = catData.map(c =>
      `<tr><td>${c.emoji} ${c.label}</td><td align="right">${brl(c.value)}</td><td align="right">${total > 0 ? ((c.value/total)*100).toFixed(0) : 0}%</td><td align="center" style="color:${c.futile ? "#FF6B6B" : "#34D399"}">${c.futile ? "Futis" : "Essencial"}</td></tr>`
    ).join("");
    const sumRows = [...summaries].reverse().map(s => {
      const inc = s.total_income + salary;
      const bal = inc - s.total_spent;
      const rt  = inc > 0 ? ((bal / inc) * 100).toFixed(1) : "0";
      const m   = new Date(s.month + "T12:00:00").toLocaleDateString("pt-BR", { month:"long", year:"numeric" });
      return `<tr><td>${m}</td><td align="right" style="color:#34D399">${brl(inc)}</td><td align="right" style="color:#FF6B6B">${brl(s.total_spent)}</td><td align="right" style="color:${bal>=0?"#EC4899":"#FF6B6B"}">${bal>=0?"+":""}${brl(bal)}</td><td align="right">${rt}%</td></tr>`;
    }).join("");

    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/><title>Relatorio Lilys</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',Arial,sans-serif;color:#1a1a2e;padding:32px;font-size:13px}
.hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;padding-bottom:16px;border-bottom:2px solid #EC4899}
.logo{font-size:24px;font-weight:700;color:#EC4899}
.grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin-bottom:24px}
.card{border:1px solid #f0e0f0;border-radius:10px;padding:12px 14px}
.cl{font-size:10px;color:#999;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
.cv{font-size:18px;font-weight:700}
.st{font-size:14px;font-weight:700;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid #f0e0f0}
table{width:100%;border-collapse:collapse;margin-bottom:24px}
th{background:#fdf0f7;padding:8px 10px;text-align:left;font-size:11px;color:#666;font-weight:600}
td{padding:8px 10px;border-bottom:1px solid #f9f0f9;font-size:12px}
.ft{margin-top:32px;padding-top:16px;border-top:1px solid #f0e0f0;text-align:center;font-size:11px;color:#999}
@media print{body{padding:16px}}</style></head><body>
<div class="hdr"><div><div class="logo">Lilys</div><div style="font-size:13px;color:#666">Relatorio - ${memberName}</div></div>
<div style="text-align:right;font-size:12px;color:#999"><div style="font-weight:700;text-transform:capitalize">${monthName}</div><div>${new Date().toLocaleDateString("pt-BR")}</div></div></div>
<div class="grid">
<div class="card"><div class="cl">Entradas</div><div class="cv" style="color:#34D399">${brl(totalIncome)}</div></div>
<div class="card"><div class="cl">Gastos</div><div class="cv" style="color:#FF6B6B">${brl(total)}</div></div>
<div class="card"><div class="cl">Saldo</div><div class="cv" style="color:${balance>=0?"#EC4899":"#FF6B6B"}">${balance>=0?"+":""}${brl(balance)}</div></div>
<div class="card"><div class="cl">Poupanca</div><div class="cv" style="color:#EC4899">${savingsRate.toFixed(1)}%</div></div>
</div>
<div class="st">Gastos por Categoria</div>
<table><tr><th>Categoria</th><th align="right">Valor</th><th align="right">%</th><th align="center">Tipo</th></tr>
${catRows}
<tr style="background:#fdf0f7;font-weight:700"><td>Total</td><td align="right">${brl(total)}</td><td></td><td></td></tr></table>
${summaries.length > 0 ? `<div class="st">Historico Mensal</div><table><tr><th>Mes</th><th align="right">Entradas</th><th align="right">Gastos</th><th align="right">Saldo</th><th align="right">Poupanca</th></tr>${sumRows}</table>` : ""}
<div class="ft">Gerado pelo Lilys - ${new Date().toLocaleDateString("pt-BR")}</div>
</body></html>`;

    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); setTimeout(() => win.print(), 600); }
  }, [profile, catData, total, totalIncome, balance, savingsRate, summaries, salary]);

  return (
    <>
      <header style={{position:"sticky",top:0,zIndex:50,background:`${C.bg}ee`,backdropFilter:"blur(14px)",borderBottom:`1px solid ${C.border}`,padding:"14px 18px 10px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:10,color:C.pink,fontWeight:600,letterSpacing:"0.16em",marginBottom:2}}>ANALISE</div>
            <div style={{fontSize:20,fontWeight:700}}>Seus Numeros</div>
          </div>
          <button onClick={handlePDF} style={{background:`${C.pink}15`,border:`1px solid ${C.pink}40`,borderRadius:12,padding:"8px 14px",fontSize:12,fontWeight:600,color:C.pink,cursor:"pointer",fontFamily:"inherit"}}>
            Exportar PDF
          </button>
        </div>
      </header>

      <main style={{padding:"18px 16px"}} suppressHydrationWarning>

        <section style={{background:`linear-gradient(150deg,#2a0a2a,${C.card})`,border:`1px solid ${C.pink}30`,borderRadius:20,padding:16,marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:700,color:C.pink,marginBottom:12}}>Resumo do Mes</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            {[
              {label:"Entradas",  value:brl(totalIncome),                         color:C.pink },
              {label:"Gastos",    value:brl(total),                               color:C.coral},
              {label:"Saldo",     value:(balance>=0?"+":"")+brl(balance),         color:balance>=0?C.pink:C.coral},
              {label:"Orcamento", value:brl(budget),                              color:C.sub  },
            ].map(s => (
              <div key={s.label} style={{background:C.raised,borderRadius:14,padding:"12px 14px",border:`1px solid ${C.border}`}}>
                <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>{s.label}</div>
                <div style={{fontSize:15,fontWeight:700,color:s.color}}>{s.value}</div>
              </div>
            ))}
          </div>
          {totalIncome > 0 && (
            <div style={{background:C.raised,borderRadius:12,padding:"10px 12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.sub,marginBottom:6}}>
                <span>Taxa de poupanca</span>
                <span style={{fontWeight:700,color:savingsRate>=20?C.pink:savingsRate>=0?C.amber:C.coral}}>{savingsRate.toFixed(1)}%</span>
              </div>
              <div style={{height:6,background:C.border,borderRadius:6}}>
                <div style={{height:6,borderRadius:6,background:savingsRate>=20?C.pink:savingsRate>=0?C.amber:C.coral,width:`${Math.min(Math.max(savingsRate,0),100)}%`,transition:"width 1s ease"}}/>
              </div>
            </div>
          )}
        </section>

        {trend !== null && (
          <div style={{background:trend<0?`${C.pink}0d`:`${C.coral}0d`,border:`1px solid ${trend<0?C.pink:C.coral}30`,borderRadius:14,padding:"12px 14px",marginBottom:14,display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:22}}>{trend < 0 ? "queda" : "alta"}</span>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:trend<0?C.pink:C.coral}}>Tendencia</div>
              <div style={{fontSize:11,color:C.sub,marginTop:2}}>
                {trend < 0 ? `Gastos cairam ${brl(Math.abs(trend))}` : `Gastos subiram ${brl(Math.abs(trend))}`} vs. mes anterior
              </div>
            </div>
          </div>
        )}

        {savingsLine.length > 1 && (
          <section style={{background:C.card,borderRadius:20,border:`1px solid ${C.border}`,padding:16,marginBottom:14}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Evolucao da Taxa de Poupanca</div>
            <div style={{fontSize:11,color:C.sub,marginBottom:16}}>% das entradas economizado por mes</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={savingsLine}>
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="month" tick={{fill:C.sub,fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:C.muted,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`}/>
                <Tooltip formatter={(v: number) => [`${v}%`, "Poupanca"]} contentStyle={TT}/>
                <ReferenceLine y={20} stroke={C.pink} strokeDasharray="4 2" strokeOpacity={0.5}/>
                <Line type="monotone" dataKey="rate" stroke={C.pink} strokeWidth={2.5} dot={{fill:C.pink,r:4,strokeWidth:0}} activeDot={{r:6,fill:C.pink}}/>
              </LineChart>
            </ResponsiveContainer>
            <div style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center",marginTop:6}}>
              <div style={{width:24,height:2,background:C.pink,opacity:0.5,borderRadius:2}}/>
              <span style={{fontSize:10,color:C.muted}}>Meta: 20%</span>
            </div>
          </section>
        )}

        {transactions.length > 0 && (
          <section style={{background:C.card,borderRadius:20,border:`1px solid ${C.border}`,padding:16,marginBottom:14}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Gastos por Dia da Semana</div>
            <div style={{fontSize:11,color:C.sub,marginBottom:12}}>Transacoes deste mes</div>
            {maxDay.value > 0 && (
              <div style={{background:`${C.pink}10`,border:`1px solid ${C.pink}25`,borderRadius:12,padding:"10px 12px",marginBottom:14,display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:13,fontWeight:700,color:C.pink}}>{maxDay.name}</span>
                <span style={{fontSize:12,color:C.sub}}>e o dia com mais gastos - {brl(maxDay.value)}</span>
              </div>
            )}
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={dayData} barCategoryGap="30%">
                <XAxis dataKey="name" tick={{fill:C.sub,fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:C.muted,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v => `R$${v}`}/>
                <Tooltip formatter={(v: number) => [brl(v), "Gastos"]} contentStyle={TT}/>
                <Bar dataKey="value" fill={C.pink} radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginTop:10}}>
              {dayData.map(d => (
                <div key={d.name} style={{background:d.value===maxDay.value?`${C.pink}20`:C.raised,border:`1px solid ${d.value===maxDay.value?C.pink+"50":C.border}`,borderRadius:10,padding:"6px 0",textAlign:"center"}}>
                  <div style={{fontSize:9,color:C.muted,marginBottom:2}}>{d.name}</div>
                  <div style={{fontSize:10,fontWeight:700,color:d.value===maxDay.value?C.pink:d.value>0?C.text:C.muted}}>{d.value > 0 ? `R$${d.value.toFixed(0)}` : "-"}</div>
                  {d.count > 0 && <div style={{fontSize:8,color:C.muted}}>{d.count}x</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {chartMonths.length > 0 && (
          <section style={{background:C.card,borderRadius:20,border:`1px solid ${C.border}`,padding:16,marginBottom:14}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:14}}>Evolucao Mensal</div>
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={chartMonths} barGap={2} barCategoryGap="25%">
                <XAxis dataKey="month" tick={{fill:C.sub,fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:C.muted,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(1)}k`}/>
                <Tooltip formatter={(v: number) => brl(v)} contentStyle={TT}/>
                <Bar dataKey="entradas" name="Entradas" fill={C.pink}  radius={[5,5,0,0]}/>
                <Bar dataKey="gastos"   name="Gastos"   fill={C.coral} radius={[5,5,0,0]}/>
                <Bar dataKey="futeis"   name="Futeis"   fill={C.amber} radius={[5,5,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </section>
        )}

        {summaries.length > 0 && (
          <section style={{marginBottom:14}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:12}}>Historico Mensal</div>
            {[...summaries].map(s => {
              const inc  = s.total_income + salary;
              const bal  = inc - s.total_spent;
              const rate = inc > 0 ? (bal / inc) * 100 : 0;
              const month = new Date(s.month + "T12:00:00").toLocaleDateString("pt-BR", { month:"long", year:"numeric" });
              return (
                <div key={s.month} style={{background:C.card,borderRadius:16,border:`1px solid ${bal>=0?C.pink+"25":C.coral+"25"}`,padding:"14px 16px",marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <span style={{fontSize:13,fontWeight:700,textTransform:"capitalize"}}>{month}</span>
                    <span style={{fontSize:12,fontWeight:700,color:bal>=0?C.pink:C.coral}}>{bal>=0?"+":""}{brl(bal)}</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                    {[{label:"Entradas",value:brl(inc),color:C.pink},{label:"Gastos",value:brl(s.total_spent),color:C.coral},{label:"Futeis",value:brl(s.futile_spent),color:C.amber}].map(item => (
                      <div key={item.label} style={{background:C.raised,borderRadius:10,padding:"8px 6px",textAlign:"center"}}>
                        <div style={{fontSize:9,color:C.muted,marginBottom:3}}>{item.label}</div>
                        <div style={{fontSize:11,fontWeight:700,color:item.color}}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.muted,marginBottom:4}}>
                      <span>Poupanca</span>
                      <span style={{color:rate>=20?C.pink:rate>=0?C.amber:C.coral}}>{rate.toFixed(1)}%</span>
                    </div>
                    <div style={{height:4,background:C.border,borderRadius:4}}>
                      <div style={{height:4,borderRadius:4,background:rate>=20?C.pink:rate>=0?C.amber:C.coral,width:`${Math.min(Math.max(rate,0),100)}%`}}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {catData.length > 0 && (
          <section style={{background:C.card,borderRadius:20,border:`1px solid ${C.border}`,padding:16,marginBottom:14}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:14}}>Por Categoria</div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
              <PieChart width={200} height={180}>
                <Pie data={catData} cx={100} cy={90} innerRadius={45} outerRadius={85} dataKey="value" paddingAngle={2} stroke="none">
                  {catData.map(e => <Cell key={e.id} fill={e.color}/>)}
                </Pie>
                <Tooltip formatter={(v: number) => brl(v)} contentStyle={TT}/>
              </PieChart>
            </div>
            {catData.map(c => (
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:C.raised,borderRadius:12,marginBottom:6}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:c.color,flexShrink:0}}/>
                <span style={{fontSize:16}}>{c.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:600}}>{c.label}</div>
                  <div style={{height:3,background:C.border,borderRadius:3,marginTop:3}}>
                    <div style={{height:3,background:c.color,borderRadius:3,width:`${total>0?(c.value/total)*100:0}%`}}/>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:12,fontWeight:700,color:c.futile?C.amber:C.text}}>{brl(c.value)}</div>
                  <div style={{fontSize:9,color:C.muted}}>{total>0?((c.value/total)*100).toFixed(0):0}%</div>
                </div>
                {c.futile && <span style={{fontSize:11}}>av</span>}
              </div>
            ))}
          </section>
        )}

        {futiles > 0 && (
          <section style={{background:`${C.amber}07`,border:`1px solid ${C.amber}28`,borderRadius:20,padding:16}}>
            <div style={{fontSize:15,fontWeight:700,color:C.amber,marginBottom:12}}>Potencial de Economia</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {([30, 50] as const).map(p => (
                <div key={p} style={{background:`${C.pink}0a`,border:`1px solid ${C.pink}20`,borderRadius:14,padding:"12px 8px",textAlign:"center"}}>
                  <div style={{fontSize:10,color:C.muted,marginBottom:4}}>Cortando {p}% dos futeis</div>
                  <div style={{fontSize:16,fontWeight:700,color:C.pink}}>+{brl(futiles*(p/100))}/mes</div>
                  <div style={{fontSize:10,color:C.muted,marginTop:2}}>= {brl(futiles*(p/100)*12)}/ano</div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </>
  );
}

