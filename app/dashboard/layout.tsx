import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DataProvider } from "@/components/providers/DataProvider";
import { BottomNav } from "@/components/BottomNav";
import type { Transaction, IncomeEntry, UserBadge, MonthlySummary } from "@/types/database";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString().split("T")[0];

  const [profileRes, txRes, incomeRes, badgesRes, summariesRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("transactions").select("*").eq("user_id", user.id)
      .gte("date", monthStart).order("created_at", { ascending: false }),
    supabase.from("income_entries").select("*").eq("user_id", user.id)
      .gte("date", monthStart).order("created_at", { ascending: false }),
    supabase.from("user_badges").select("*").eq("user_id", user.id),
    supabase.from("monthly_summaries").select("*").eq("user_id", user.id)
      .order("month", { ascending: false }).limit(6),
  ]);

  return (
    <DataProvider
      user={{ id:user.id, email:user.email ?? "", name:user.user_metadata?.full_name ?? "Usuária" }}
      initialProfile={profileRes.data ?? null}
      initialTransactions={(txRes.data    ?? []) as Transaction[]}
      initialIncomes={     (incomeRes.data ?? []) as IncomeEntry[]}
      initialBadges={      (badgesRes.data ?? []) as UserBadge[]}
      initialSummaries={   (summariesRes.data ?? []) as MonthlySummary[]}
    >
      <div style={{
        minHeight:"100dvh", background:"#0E0812",
        maxWidth:430, margin:"0 auto",
        fontFamily:"'Space Grotesk', system-ui, sans-serif",
        color:"#FDF2F8", paddingBottom:80,
      }}>
        {children}
        <BottomNav />
      </div>
    </DataProvider>
  );
}
