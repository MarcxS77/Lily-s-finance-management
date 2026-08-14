"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { House, ChartBar, Users, Trophy } from "@phosphor-icons/react";
import { C } from "@/lib/constants";
import { AddTransactionModal } from "./AddTransactionModal";
import { ProfileModal } from "./ProfileModal";

export function BottomNav() {
  const path = usePathname();
  const [showAdd,     setShowAdd]     = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const labelStyle: React.CSSProperties = {
    fontSize:9, fontWeight:600,
    fontFamily:"'Space Grotesk', sans-serif",
  };

  const navItem = (href: string): React.CSSProperties => ({
    flex:1, height:54, textDecoration:"none",
    display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center",
    gap:3, color: path === href ? C.pink : C.muted,
    transition:"color .2s",
  });

  return (
    <>
      <nav style={{
        position:"fixed", bottom:0,
        left:0, right:0,
        maxWidth:430, margin:"0 auto",
        zIndex:100,
        background:`${C.bg}f5`,
        backdropFilter:"blur(16px)",
        borderTop:`1px solid ${C.border}`,
        height:64,
        display:"flex",
        alignItems:"center",
        padding:"0 6px",
      }}>

        {/* Esquerda — 2 itens */}
        <Link href="/dashboard" style={navItem("/dashboard")}>
          <House size={22} weight={path==="/dashboard"?"fill":"regular"} />
          <span style={labelStyle}>Início</span>
        </Link>

        <Link href="/dashboard/analytics" style={navItem("/dashboard/analytics")}>
          <ChartBar size={22} weight={path==="/dashboard/analytics"?"fill":"regular"} />
          <span style={labelStyle}>Análise</span>
        </Link>

        {/* Centro — botão + */}
        <button onClick={() => setShowAdd(true)} aria-label="Adicionar"
          style={{
            flexShrink:0,
            width:52, height:52,
            background:`linear-gradient(135deg,${C.pinkDk},${C.pink})`,
            borderRadius:16,
            display:"flex", alignItems:"center", justifyContent:"center",
            border:"none", cursor:"pointer",
            boxShadow:`0 4px 20px ${C.pink}55`,
            fontSize:26, color:C.bg, fontWeight:700,
            margin:"0 8px",
            transform:"translateY(-6px)",
          }}>
          +
        </button>

        {/* Direita — 2 itens */}
        <Link href="/dashboard/familia" style={navItem("/dashboard/familia")}>
          <Users size={22} weight={path==="/dashboard/familia"?"fill":"regular"} />
          <span style={labelStyle}>Família</span>
        </Link>

        <Link href="/dashboard/achievements" style={navItem("/dashboard/achievements")}>
          <Trophy size={22} weight={path==="/dashboard/achievements"?"fill":"regular"} />
          <span style={labelStyle}>Conquistas</span>
        </Link>

      </nav>

      {showAdd     && <AddTransactionModal onClose={() => setShowAdd(false)}     />}
      {showProfile && <ProfileModal        onClose={() => setShowProfile(false)} />}
    </>
  );
}
