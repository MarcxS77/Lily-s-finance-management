"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { House, ChartBar, Users, Trophy, User } from "@phosphor-icons/react";
import { C } from "@/lib/constants";
import { AddTransactionModal } from "./AddTransactionModal";
import { ProfileModal } from "./ProfileModal";

export function BottomNav() {
  const path = usePathname();
  const [showAdd,     setShowAdd]     = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const linkStyle = (href: string) => ({
    flex:1 as const, height:54, textDecoration:"none" as const,
    display:"flex" as const, flexDirection:"column" as const,
    alignItems:"center" as const, justifyContent:"center" as const,
    gap:3, color: path === href ? C.pink : C.muted,
    transition:"color .2s",
  });

  const labelStyle = {
    fontSize:9, fontWeight:600,
    fontFamily:"'Space Grotesk', sans-serif",
  };

  return (
    <>
      <nav style={{
  position:"fixed", bottom:0,
  left:0, right:0,
  maxWidth:430,
  margin:"0 auto",
  zIndex:100,
  background:`${C.bg}f5`,
  backdropFilter:"blur(16px)",
  borderTop:`1px solid ${C.border}`,
  height:64,
  display:"flex",
  alignItems:"center",
  justifyContent:"space-around",
  padding:"0 8px",
}}>

        <Link href="/dashboard" style={linkStyle("/dashboard")}>
          <House size={22} weight={path === "/dashboard" ? "fill" : "regular"} />
          <span style={labelStyle}>Início</span>
        </Link>

        <Link href="/dashboard/analytics" style={linkStyle("/dashboard/analytics")}>
          <ChartBar size={22} weight={path === "/dashboard/analytics" ? "fill" : "regular"} />
          <span style={labelStyle}>Análise</span>
        </Link>

        <button onClick={() => setShowAdd(true)} aria-label="Adicionar"
          style={{
            flex:1, height:48,
            background:`linear-gradient(135deg,${C.pinkDk},${C.pink})`,
            borderRadius:14, display:"flex",
            alignItems:"center", justifyContent:"center",
            border:"none", cursor:"pointer",
            margin:"0 4px", boxShadow:`0 4px 16px ${C.pink}45`,
            fontFamily:"inherit", fontSize:22, color:C.bg, fontWeight:700,
          }}>
          +
        </button>

        <Link href="/dashboard/familia" style={linkStyle("/dashboard/familia")}>
          <Users size={22} weight={path === "/dashboard/familia" ? "fill" : "regular"} />
          <span style={labelStyle}>Família</span>
        </Link>

        <Link href="/dashboard/achievements" style={linkStyle("/dashboard/achievements")}>
          <Trophy size={22} weight={path === "/dashboard/achievements" ? "fill" : "regular"} />
          <span style={labelStyle}>Conquistas</span>
        </Link>

       <button onClick={() => setShowAdd(true)} aria-label="Adicionar"
  style={{
    width:56, height:48, flexShrink:0,
    background:`linear-gradient(135deg,${C.pinkDk},${C.pink})`,
    borderRadius:14, display:"flex",
    alignItems:"center", justifyContent:"center",
    border:"none", cursor:"pointer",
    boxShadow:`0 4px 16px ${C.pink}45`,
    fontFamily:"inherit", fontSize:24, color:C.bg, fontWeight:700,
  }}>
  +
</button>

      </nav>

      {showAdd     && <AddTransactionModal onClose={() => setShowAdd(false)}     />}
      {showProfile && <ProfileModal        onClose={() => setShowProfile(false)} />}
    </>
  );
}
