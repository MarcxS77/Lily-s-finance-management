import type { Category, Badge } from "@/types/database";

export const C = {
  bg:       "#0E0812",
  card:     "#1C0E1C",
  raised:   "#280F28",
  border:   "#3D1A3D",
  pink:     "#F9A8D4",
  pinkDk:   "#EC4899",
  pinkMd:   "#F472B6",
  amber:    "#F5A623",
  coral:    "#FF6B6B",
  violet:   "#E879F9",
  violetDk: "#C026D3",
  blue:     "#60A5FA",
  text:     "#FDF2F8",
  sub:      "#C084A0",
  muted:    "#6B2D4F",
} as const;

export const APP_NAME = "Lilys";
export const APP_EMOJI = "🌸";

export const CATEGORIES: Category[] = [
  { id:"alimentacao", label:"Alimentação",  emoji:"🍔", color:"#FF6B6B", futile:false },
  { id:"transporte",  label:"Transporte",              emoji:"🚗", color:"#FBBF24", futile:false },
  { id:"moradia",     label:"Moradia",                 emoji:"🏠", color:"#60A5FA", futile:false },
  { id:"saude",       label:"Saúde",              emoji:"💊", color:"#34D399", futile:false },
  { id:"educacao",    label:"Educação",      emoji:"📚", color:"#22D3EE", futile:false },
  { id:"contas",      label:"Contas",                  emoji:"⚡",       color:"#F59E0B", futile:false },
  { id:"lazer",       label:"Lazer",                   emoji:"🎬", color:"#A78BFA", futile:true  },
  { id:"roupas",      label:"Roupas",                  emoji:"👗", color:"#F9A8D4", futile:true  },
  { id:"compras",     label:"Compras",                 emoji:"🛒", color:"#FB7185", futile:true  },
  { id:"bar",         label:"Bar/Balada",              emoji:"🍹", color:"#86EFAC", futile:true  },
  { id:"cafe",        label:"Café/Lanches",       emoji:"☕",       color:"#C084FC", futile:true  },
  { id:"games",       label:"Games/Apps",              emoji:"🎮", color:"#FB923C", futile:true  },
];

export const INCOME_CATS = [
  { id:"salario",      label:"Salário",           emoji:"💼" },
  { id:"freelance",    label:"Freelance",              emoji:"💻" },
  { id:"investimento", label:"Investimentos",          emoji:"📈" },
  { id:"presente",     label:"Presente",               emoji:"🎁" },
  { id:"aluguel",      label:"Aluguel recebido",       emoji:"🏠" },
  { id:"outro",        label:"Outro",                  emoji:"➕"       },
];

export const getCat = (id: string) =>
  CATEGORIES.find(c => c.id === id) ?? CATEGORIES[0];

export const getIncomeCat = (id: string) =>
  INCOME_CATS.find(c => c.id === id) ?? INCOME_CATS[INCOME_CATS.length - 1];

export const BADGES: Badge[] = [
  { id:"first_entry",   emoji:"📝", title:"Primeiro Passo",     desc:"Cadastrou o primeiro gasto",           xp:50  },
  { id:"first_income",  emoji:"💰", title:"Primeira Entrada",   desc:"Registrou sua primeira receita",       xp:50  },
  { id:"streak_7",      emoji:"🔥", title:"7 Dias de Fogo",     desc:"7 dias consecutivos registrando",      xp:100 },
  { id:"streak_14",     emoji:"⚡",        title:"14 Dias Imparavel",  desc:"14 dias consecutivos registrando",     xp:200 },
  { id:"streak_30",     emoji:"🌕", title:"Mes Completo",       desc:"30 dias consecutivos registrando",     xp:400 },
  { id:"goal_hit",      emoji:"🎯", title:"Meta Atingida",      desc:"Ficou abaixo do orcamento no mes",     xp:250 },
  { id:"cut_futile_20", emoji:"✂️", title:"Corte Inteligente",  desc:"Reduziu gastos futeis em 20%",         xp:150 },
  { id:"positive_bal",  emoji:"🌸", title:"Saldo Positivo",     desc:"Fechou o mes com saldo positivo",      xp:300 },
  { id:"investor",      emoji:"📈", title:"Investidora",        desc:"Registrou entrada de investimento",    xp:200 },
  { id:"perfect_month", emoji:"⭐",       title:"Mes Perfeito",       desc:"Todas categorias abaixo do orcamento", xp:500 },
  { id:"tx_50",         emoji:"🎓", title:"Organizadora Pro",   desc:"Classificou 50 transacoes",            xp:100 },
  { id:"diamond_3",     emoji:"💎", title:"Diamante",           desc:"3 meses consecutivos com meta batida", xp:600 },
];

export const LEVELS = [
  { name:"Iniciante",       icon:"🌱", minXP:0    },
  { name:"Aprendiz",        icon:"🌸", minXP:200  },
  { name:"Consciente",      icon:"👁️", minXP:500  },
  { name:"Planejadora",     icon:"📋", minXP:900  },
  { name:"Estrategista",    icon:"🧩", minXP:1400 },
  { name:"Especialista",    icon:"💎", minXP:2000 },
  { name:"Mestre",          icon:"🏅", minXP:2800 },
  { name:"Guru Financeira", icon:"🌟", minXP:3800 },
];

export function getLevelInfo(xp: number) {
  let lvlIdx = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) { lvlIdx = i; break; }
  }
  const current    = LEVELS[lvlIdx];
  const next       = LEVELS[lvlIdx + 1];
  const progressXP = xp - current.minXP;
  const neededXP   = next ? next.minXP - current.minXP : progressXP;
  const pct        = Math.min((progressXP / neededXP) * 100, 100);
  return { lvlIdx, current, next, progressXP, neededXP, pct };
}

export const brl = (n: number | undefined | null) =>
  "R$ " + (n ?? 0).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const fmtDate = (iso: string) => {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { day:"2-digit", month:"2-digit" });
};
