"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// â”€â”€ Transactions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function addTransaction(formData: {
  category:    string;
  amount:      number;
  description: string;
  date:        string;
  futile:      boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("NÃ£o autenticado");

  const { error } = await supabase.from("transactions").insert({
    user_id:     user.id,
    category:    formData.category,
    amount:      formData.amount,
    description: formData.description,
    date:        formData.date,
    futile:      formData.futile,
  });
  if (error) throw error;

  await checkAndAwardBadges(user.id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
  revalidatePath("/dashboard/achievements");
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("NÃ£o autenticado");

  const { error } = await supabase.from("transactions").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
}

// â”€â”€ Income â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function addIncome(formData: {
  amount:      number;
  description: string;
  category:    string;
  date:        string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("NÃ£o autenticado");

  const { error } = await supabase.from("income_entries").insert({
    user_id:     user.id,
    amount:      formData.amount,
    description: formData.description,
    category:    formData.category,
    date:        formData.date,
  });
  if (error) throw error;

  await checkAndAwardBadges(user.id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
}

export async function deleteIncome(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("NÃ£o autenticado");

  const { error } = await supabase.from("income_entries").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
}

// â”€â”€ Profile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function updateProfile(data: {
  display_name?:   string;
  salary?:         number;
  monthly_budget?: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("NÃ£o autenticado");

  const { error } = await supabase.from("profiles").update(data).eq("id", user.id);
  if (error) throw error;

  revalidatePath("/dashboard");
}

// â”€â”€ Badge Engine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function checkAndAwardBadges(userId: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase.from("user_badges").select("badge_id").eq("user_id", userId);
  const ownedIds = new Set((existing ?? []).map(b => b.badge_id));
  const toUnlock: string[] = [];

  const [txResult, incomeResult, profileResult, summariesResult] = await Promise.all([
    supabase.from("transactions").select("*").eq("user_id", userId),
    supabase.from("income_entries").select("*").eq("user_id", userId),
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("monthly_summaries").select("*").eq("user_id", userId).order("month", { ascending: false }),
  ]);

  const txs      = txResult.data ?? [];
  const incomes  = incomeResult.data ?? [];
  const profile  = profileResult.data;
  const summaries= summariesResult.data ?? [];

  if (!profile) return;

  if (!ownedIds.has("first_entry")  && txs.length >= 1)     toUnlock.push("first_entry");
  if (!ownedIds.has("first_income") && incomes.length >= 1) toUnlock.push("first_income");
  if (!ownedIds.has("streak_7")     && profile.streak_days >= 7)  toUnlock.push("streak_7");
  if (!ownedIds.has("streak_14")    && profile.streak_days >= 14) toUnlock.push("streak_14");
  if (!ownedIds.has("streak_30")    && profile.streak_days >= 30) toUnlock.push("streak_30");
  if (!ownedIds.has("tx_50")        && txs.length >= 50)    toUnlock.push("tx_50");
  if (!ownedIds.has("investor")     && incomes.some(i => i.category === "investimento")) toUnlock.push("investor");

  if (!ownedIds.has("goal_hit") && summaries.length > 0) {
    if (summaries[0].total_spent <= profile.monthly_budget) toUnlock.push("goal_hit");
  }
  if (!ownedIds.has("positive_bal") && summaries.length > 0) {
    const s = summaries[0];
    if ((s.total_income + profile.salary) > s.total_spent) toUnlock.push("positive_bal");
  }
  if (!ownedIds.has("diamond_3") && summaries.length >= 3) {
    if (summaries.slice(0,3).every(s => s.total_spent <= profile.monthly_budget))
      toUnlock.push("diamond_3");
  }
  if (!ownedIds.has("cut_futile_20") && summaries.length >= 2) {
    const [curr, prev] = summaries;
    if (prev.futile_spent > 0 && curr.futile_spent <= prev.futile_spent * 0.8)
      toUnlock.push("cut_futile_20");
  }

  if (toUnlock.length > 0) {
    await supabase.from("user_badges").insert(
      toUnlock.map(badge_id => ({ user_id: userId, badge_id }))
    );
    revalidatePath("/dashboard/achievements");
  }
}

// â”€â”€ Family â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function createFamily(name: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("NÃ£o autenticado");

  const { data: family, error: fErr } = await supabase
    .from("families")
    .insert({ name: name.trim() || "Nossa FamÃ­lia", created_by: user.id })
    .select().single();

  if (fErr || !family) throw fErr;

  const { error: pErr } = await supabase
    .from("profiles").update({ family_id: family.id }).eq("id", user.id);

  if (pErr) throw pErr;
  revalidatePath("/dashboard/familia");
  return family;
}

export async function generateFamilyInvite(familyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("NÃ£o autenticado");

  // Remove convites anteriores deste usuÃ¡rio para esta famÃ­lia
  await supabase.from("family_invites")
    .delete().eq("family_id", familyId).eq("created_by", user.id);

  const token      = crypto.randomUUID().replace(/-/g, "");
  const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("family_invites")
    .insert({ family_id: familyId, created_by: user.id, token, expires_at })
    .select().single();

  if (error) throw error;
  return data as { token: string; expires_at: string };
}

export async function joinFamilyByToken(token: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("NÃ£o autenticado");

  const { data: invite, error } = await supabase
    .from("family_invites")
    .select("family_id, expires_at")
    .eq("token", token).single();

  if (error || !invite)                          throw new Error("Convite nÃ£o encontrado");
  if (new Date(invite.expires_at) < new Date())  throw new Error("Convite expirado");

  const { error: pErr } = await supabase
    .from("profiles").update({ family_id: invite.family_id }).eq("id", user.id);

  if (pErr) throw pErr;
  revalidatePath("/dashboard/familia");
  return invite.family_id as string;
}

export async function leaveFamily() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("NÃ£o autenticado");

  await supabase.from("profiles").update({ family_id: null }).eq("id", user.id);
  revalidatePath("/dashboard/familia");
}

