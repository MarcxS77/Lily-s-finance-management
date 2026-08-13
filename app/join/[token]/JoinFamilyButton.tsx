"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinFamilyByToken } from "@/lib/actions";
import { C } from "@/lib/constants";

export function JoinFamilyButton({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const router = useRouter();

  const handleJoin = async () => {
    setLoading(true);
    setError("");
    try {
      await joinFamilyByToken(token);
      router.push("/dashboard/familia");
    } catch(e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao entrar na família");
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleJoin} disabled={loading} style={{
        width:"100%",
        background:`linear-gradient(135deg,${C.pinkDk},${C.pink})`,
        color:C.bg, borderRadius:16, padding:16,
        fontSize:16, fontWeight:700, border:"none",
        cursor:loading?"wait":"pointer", fontFamily:"inherit",
      }}>
        {loading ? "Entrando…" : "🌸 Entrar na Família"}
      </button>
      {error && (
        <div style={{ fontSize:12, color:C.coral, marginTop:10, textAlign:"center" }}>
          {error}
        </div>
      )}
    </div>
  );
}
