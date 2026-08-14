"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { BADGES, CATEGORIES, getLevelInfo } from "@/lib/constants";
import type { Transaction, IncomeEntry, Profile, UserBadge, MonthlySummary, CategoryData } from "@/types/database";

interface AppUser { id: string; email: string; name: string; }

interface DataContextValue {
  user:          AppUser;
  profile:       Profile | null;
  transactions:  Transaction[];
  incomes:       IncomeEntry[];
  badges:        UserBadge[];
  summaries:     MonthlySummary[];
  total:         number;
  futiles:       number;
  essential:     number;
  totalIncome:   number;
  balance:       number;
  catData:       CategoryData[];
  xp:            number;
  levelInfo:     ReturnType<typeof getLevelInfo>;
  unlockedSet:   Set<string>;
  isPending:     boolean;
  addTx:         (form: AddTxForm)      => Promise<void>;
  deleteTx:      (id: string)           => Promise<void>;
  addIncomeFn:   (form: AddIncomeForm)  => Promise<void>;
  deleteIncomeFn:(id: string)           => Promise<void>;
}

interface AddTxForm {
  category: string; amount: number; description: string; date: string; futile: boolean;
}
interface AddIncomeForm {
  amount: number; description: string; category: string; date: string;
}

const noop = async () => {};

const DEFAULT_VALUE: DataContextValue = {
  user: { id:"", email:"", name:"" }, profile:null,
  transactions:[], incomes:[], badges:[], summaries:[],
  total:0, futiles:0, essential:0, totalIncome:0, balance:0,
  catData:[], xp:0, levelInfo:getLevelInfo(0), unlockedSet:new Set(),
  isPending:false,
  addTx:noop, deleteTx:noop, addIncomeFn:noop, deleteIncomeFn:noop,
};

const DataContext = createContext<DataContextValue>(DEFAULT_VALUE);

export function DataProvider({
  children, user,
  initialProfile, initialTransactions,
  initialIncomes, initialBadges, initialSummaries,
}: {
  children:            ReactNode;
  user:                AppUser;
  initialProfile:      Profile | null;
  initialTransactions: Transaction[];
  initialIncomes:      IncomeEntry[];
  initialBadges:       UserBadge[];
  initialSummaries:    MonthlySummary[];
}) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [incomes,      setIncomes]      = useState(initialIncomes);
  const [isPending,    setIsPending]    = useState(false);

  const total       = transactions.reduce((s, t) => s + t.amount, 0);
  const futiles     = transactions.filter(t => t.futile).reduce((s, t) => s + t.amount, 0);
  const essential   = total - futiles;
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0) + (initialProfile?.salary ?? 0);
  const balance     = totalIncome - total;

  const catData: CategoryData[] = CATEGORIES.map(c => ({
    ...c,
    value: transactions.filter(t => t.category === c.id).reduce((s, t) => s + t.amount, 0),
  })).filter(c => c.value > 0).sort((a, b) => b.value - a.value);

  const unlockedSet = new Set(initialBadges.map(b => b.badge_id));
  const xp          = BADGES.filter(b => unlockedSet.has(b.id)).reduce((s, b) => s + b.xp, 0);
  const levelInfo   = getLevelInfo(xp);

  const supabase = createClient();

  const addTx = async (form: AddTxForm) => {
    // Optimistic update — aparece imediatamente
    const opt: Transaction = {
      id:`opt-${Date.now()}`, user_id:user.id,
      created_at:new Date().toISOString(), ...form,
    };
    setTransactions(prev => [opt, ...prev]);
    setIsPending(true);

    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert({ user_id:user.id, ...form })
        .select()
        .single();

      if (error) throw error;

      // Substitui o optimistic pelo dado real
      setTransactions(prev => prev.map(t => t.id === opt.id ? (data as Transaction) : t));
    } catch {
      // Reverte em caso de erro
      setTransactions(prev => prev.filter(t => t.id !== opt.id));
    } finally {
      setIsPending(false);
    }
  };

  const deleteTx = async (id: string) => {
    const prev = transactions;
    setTransactions(ts => ts.filter(t => t.id !== id));

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) setTransactions(prev);
  };

  const addIncomeFn = async (form: AddIncomeForm) => {
    const opt: IncomeEntry = {
      id:`opt-${Date.now()}`, user_id:user.id,
      created_at:new Date().toISOString(), ...form,
    };
    setIncomes(prev => [opt, ...prev]);
    setIsPending(true);

    try {
      const { data, error } = await supabase
        .from("income_entries")
        .insert({ user_id:user.id, ...form })
        .select()
        .single();

      if (error) throw error;

      setIncomes(prev => prev.map(i => i.id === opt.id ? (data as IncomeEntry) : i));
    } catch {
      setIncomes(prev => prev.filter(i => i.id !== opt.id));
    } finally {
      setIsPending(false);
    }
  };

  const deleteIncomeFn = async (id: string) => {
    const prev = incomes;
    setIncomes(is => is.filter(i => i.id !== id));

    const { error } = await supabase
      .from("income_entries")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) setIncomes(prev);
  };

  return (
    <DataContext.Provider value={{
      user, profile:initialProfile,
      transactions, incomes,
      badges:initialBadges, summaries:initialSummaries,
      total, futiles, essential, totalIncome, balance,
      catData, xp, levelInfo, unlockedSet,
      isPending, addTx, deleteTx, addIncomeFn, deleteIncomeFn,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  return useContext(DataContext);
}
