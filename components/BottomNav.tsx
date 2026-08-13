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
        left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:430, zIndex:100,
        background:`${C.bg}f5`, backdropFilter:"blur(16px)",
        borderTop:`1px solid ${C.border}`,
        height:64, display:"flex", alignItems:"center", padding:"0 4px",
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

        <button onClick={() => setShowProfile(true)} style={{
          flex:1, height:54, background:"none",
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          gap:3, border:"none", cursor:"pointer",
          color: showProfile ? C.pink : C.muted,
          transition:"color .2s", fontFamily:"inherit",
        }}>
          <User size={22} weight="regular" />
          <span style={labelStyle}>Perfil</span>
        </button>

      </nav>

      {showAdd     && <AddTransactionModal onClose={() => setShowAdd(false)}     />}
      {showProfile && <ProfileModal        onClose={() => setShowProfile(false)} />}
    </>
  );
}
