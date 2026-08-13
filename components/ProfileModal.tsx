"use client";

import { useState } from "react";
import { C, APP_NAME, brl } from "@/lib/constants";
import { useData } from "@/components/providers/DataProvider";
import { updateProfile } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Props { onClose: () => void; }

export function ProfileModal({ onClose }: Props) {
  const { user, profile } = useData();
  const router = useRouter();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState(profile?.display_name || profile?.full_name || "");
  const [salary,      setSalary]      = useState(String(profile?.salary ?? 0));
  const [budget,      setBudget]      = useState(String(profile?.monthly_budget ?? 3000));
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({
      display_name:   displayName.trim() || undefined,
      salary:         parseFloat(salary) || 0,
      monthly_budget: parseFloat(budget) || 3000,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const salaryNum = parseFloat(salary) || 0;
  const budgetNum = parseFloat(budget) || 0;
  const savings   = salaryNum - budgetNum;

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
        maxHeight:"90dvh", overflowY:"auto",
      }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <span style={{ fontSize:18, fontWeight:700 }}>Meu Perfil</span>
          <button onClick={onClose} style={{
            background:C.raised, color:C.sub, borderRadius:10,
            width:32, height:32, display:"flex", alignItems:"center",
            justifyContent:"center", border:"none", cursor:"pointer", fontFamily:"inherit",
          }}>✕</button>
        </div>

        {/* Avatar + name */}
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
          {profile?.avatar_url ? (
            <Image src={profile.avatar_url} alt={user.name}
              width={56} height={56}
              style={{ borderRadius:99, border:`2px solid ${C.pink}` }}
            />
          ) : (
            <div style={{
              width:56, height:56, borderRadius:99,
              background:`linear-gradient(135deg,${C.violetDk},${C.pink})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:22, color:"#fff", fontWeight:700,
            }}>{user.name.charAt(0).toUpperCase()}</div>
          )}
          <div>
            <div style={{ fontSize:15, fontWeight:700 }}>{profile?.display_name || user.name}</div>
            <div style={{ fontSize:11, color:C.muted }}>{user.email}</div>
          </div>
        </div>

        {/* Display name */}
        <label style={{ display:"block", marginBottom:14 }}>
          <span style={{ display:"block", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Nome de exibição</span>
          <input type="text" placeholder="Como quer ser chamada?" value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            style={{
              width:"100%", background:C.raised, border:`1px solid ${C.border}`,
              borderRadius:14, padding:"12px 14px", color:C.text, fontSize:14,
              outline:"none", fontFamily:"inherit",
            }}
          />
        </label>

        {/* Salary */}
        <label style={{ display:"block", marginBottom:14 }}>
          <span style={{ display:"block", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Salário mensal (R$)</span>
          <input type="number" inputMode="decimal" placeholder="0,00" value={salary}
            onChange={e => setSalary(e.target.value)}
            style={{
              width:"100%", background:C.raised, border:`1px solid ${C.border}`,
              borderRadius:14, padding:"12px 14px", color:C.text, fontSize:16,
              fontWeight:700, outline:"none", fontFamily:"inherit",
            }}
          />
        </label>

        {/* Budget */}
        <label style={{ display:"block", marginBottom:16 }}>
          <span style={{ display:"block", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Orçamento mensal de gastos (R$)</span>
          <input type="number" inputMode="decimal" placeholder="0,00" value={budget}
            onChange={e => setBudget(e.target.value)}
            style={{
              width:"100%", background:C.raised, border:`1px solid ${C.border}`,
              borderRadius:14, padding:"12px 14px", color:C.text, fontSize:16,
              fontWeight:700, outline:"none", fontFamily:"inherit",
            }}
          />
        </label>

        {/* Savings preview */}
        {salaryNum > 0 && budgetNum > 0 && (
          <div style={{
            background: savings >= 0 ? `${C.pink}10` : `${C.coral}10`,
            border:`1px solid ${savings >= 0 ? C.pink : C.coral}30`,
            borderRadius:14, padding:"12px 14px", marginBottom:20,
          }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Previsão de economia mensal</div>
            <div style={{ fontSize:18, fontWeight:700, color: savings >= 0 ? C.pink : C.coral }}>
              {savings >= 0 ? "+" : ""}{brl(savings)}
            </div>
            <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>
              {savings >= 0
                ? `${((savings/salaryNum)*100).toFixed(0)}% do salário guardado por mês`
                : "Orçamento acima do salário — ajuste os valores"}
            </div>
          </div>
        )}

        {/* Save */}
        <button onClick={handleSave} disabled={saving} style={{
          width:"100%",
          background: saved
            ? `${C.pink}30`
            : `linear-gradient(135deg,${C.pinkDk},${C.pink})`,
          color: saved ? C.pink : C.bg,
          borderRadius:16, padding:15, fontSize:15, fontWeight:700,
          border:"none", cursor:saving?"wait":"pointer",
          fontFamily:"inherit", marginBottom:12, transition:"all .2s",
        }}>
          {saving ? "Salvando…" : saved ? "✓ Salvo!" : "Salvar Perfil"}
        </button>

        {/* Sign out */}
        <button onClick={handleSignOut} style={{
          width:"100%", background:"none",
          border:`1px solid ${C.border}`,
          color:C.muted, borderRadius:16, padding:13, fontSize:14,
          cursor:"pointer", fontFamily:"inherit",
        }}>
          Sair da conta
        </button>
      </div>
    </div>
  );
}
