"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { House, ChartBar, Users, Trophy, User } from "@phosphor-icons/react";
import { C } from "@/lib/constants";
import { AddTransactionModal } from "./AddTransactionModal";
import { ProfileModal } from "./ProfileModal";

type Tab = {
  href:   string;
  label:  string;
  Icon:   React.ComponentType<{ size: number; weight: "fill" | "regular" }>;
};

const TABS: Tab[] = [
  { href:"/dashboard",              label:"InÃ­cio",    Icon:House    },
  { href:"/dashboard/analytics",    label:"AnÃ¡lise",   Icon:ChartBar },
  { href:"/dashboard/familia",      label:"FamÃ­lia",   Icon:Users    },
  { href:"/dashboard/achievements", label:"Conquistas",Icon:Trophy   },
];

export function BottomNav() {
  const path = usePathname();
  const [showAdd,     setShowAdd]     = useState(false);
  const [showProfile, setShowProfile] = useState(false);

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

        {TABS.slice(0,2).map(tab => {
          const active = path === tab.href;
          return (
            <Link key={tab.href} href={tab.href} style={{
              flex:1, height:54, textDecoration:"none",
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:3,
              color: active ? C.pink : C.muted, transition:"color .2s",
            }}>
              <tab.Icon size={22} weight={active ? "fill" : "regular"} />
              <span style={{ fontSize:9, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif" }}>
                {tab.label}
              </span>
            </Link>
          );
        })}

        {/* BotÃ£o central â€” Adicionar */}
        <button onClick={() => setShowAdd(true)} aria-label="Adicionar"
          style={{
            flex:1, height:48,
            background:`linear-gradient(135deg,${C.pinkDk},${C.pink})`,
            borderRadius:14, display:"flex",
            alignItems:"center", justifyContent:"center",
            border:"none", cursor:"pointer",
            margin:"0 4px", boxShadow:`0 4px 16px ${C.pink}45`,
            fontFamily:"inherit", fontSize:20, color:C.bg, fontWeight:700,
          }}>
          âœ¦
        </button>

        {TABS.slice(2,4).map(tab => {
          const active = path === tab.href;
          return (
            <Link key={tab.href} href={tab.href} style={{
              flex:1, height:54, textDecoration:"none",
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:3,
              color: active ? C.pink : C.muted, transition:"color .2s",
            }}>
              <tab.Icon size={22} weight={active ? "fill" : "regular"} />
              <span style={{ fontSize:9, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif" }}>
                {tab.label}
              </span>
            </Link>
          );
        })}

        {/* Perfil */}
        <button onClick={() => setShowProfile(true)} aria-label="Perfil"
          style={{
            flex:1, height:54, background:"none",
            display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", gap:3,
            border:"none", cursor:"pointer",
            color: showProfile ? C.pink : C.muted,
            transition:"color .2s", fontFamily:"inherit",
          }}>
          <User size={22} weight="regular" />
          <span style={{ fontSize:9, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif" }}>
            Perfil
          </span>
        </button>

      </nav>

      {showAdd     && <AddTransactionModal onClose={() => setShowAdd(false)}     />}
      {showProfile && <ProfileModal        onClose={() => setShowProfile(false)} />}
    </>
  );
}

