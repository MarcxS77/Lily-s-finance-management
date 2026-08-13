import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { C, APP_EMOJI, APP_NAME } from "@/lib/constants";
import { JoinFamilyButton } from "./JoinFamilyButton";

export default async function JoinPage({ params }: { params: { token: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=/join/${params.token}`);

  // Busca o convite + nome da família
  const { data: invite } = await supabase
    .from("family_invites")
    .select("family_id, expires_at, families(name)")
    .eq("token", params.token)
    .single();

  const isValid    = invite && new Date(invite.expires_at) > new Date();
  const familyName = isValid ? ((invite.families as {name:string})?.name || "Família") : null;

  // Se já é membro desta família, redireciona
  const { data: profile } = await supabase
    .from("profiles").select("family_id").eq("id", user.id).single();

  if (isValid && profile?.family_id === invite?.family_id) {
    redirect("/dashboard/familia");
  }

  return (
    <div style={{
      minHeight:"100dvh", background:C.bg,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"0 28px", color:C.text,
      fontFamily:"'Space Grotesk', system-ui, sans-serif",
    }}>
      {/* Branding */}
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{ fontSize:56, lineHeight:1, marginBottom:10 }}>{APP_EMOJI}</div>
        <div style={{ fontSize:22, fontWeight:700, color:C.pink }}>{APP_NAME}</div>
      </div>

      {isValid ? (
        <div style={{
          background:C.card, border:`1px solid ${C.pink}30`,
          borderRadius:24, padding:28,
          width:"100%", maxWidth:340, textAlign:"center",
        }}>
          <div style={{ fontSize:44, marginBottom:12 }}>🏠</div>
          <div style={{ fontSize:13, color:C.muted, marginBottom:6 }}>
            Você foi convidada para
          </div>
          <div style={{ fontSize:22, fontWeight:700, color:C.pink, marginBottom:6 }}>
            {familyName}
          </div>
          <div style={{ fontSize:12, color:C.muted, lineHeight:1.6, marginBottom:24 }}>
            Ao entrar, você poderá ver as finanças combinadas do grupo e compartilhar sua evolução.
          </div>
          <JoinFamilyButton token={params.token} />
        </div>
      ) : (
        <div style={{
          background:C.card, border:`1px solid ${C.coral}30`,
          borderRadius:24, padding:28,
          width:"100%", maxWidth:340, textAlign:"center",
        }}>
          <div style={{ fontSize:44, marginBottom:12 }}>⏱️</div>
          <div style={{ fontSize:18, fontWeight:700, color:C.coral, marginBottom:8 }}>
            Convite expirado
          </div>
          <div style={{ fontSize:13, color:C.sub, lineHeight:1.6 }}>
            Este link não é mais válido.<br/>
            Peça um novo link ao administrador da família.
          </div>
        </div>
      )}
    </div>
  );
}
