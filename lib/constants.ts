import type { Category, Badge } from "@/types/database";

// â”€â”€ Palette â€” Lilys (dark rose/pink) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const C = {
  bg:       "#0E0812",
  card:     "#1C0E1C",
  raised:   "#280F28",
  border:   "#3D1A3D",
  pink:     "#F9A8D4",   // pastel pink â€” acento principal
  pinkDk:   "#EC4899",   // pink mÃ©dio
  pinkMd:   "#F472B6",   // pink vibrante
  amber:    "#F5A623",
  coral:    "#FF6B6B",
  violet:   "#E879F9",
  violetDk: "#C026D3",
  blue:     "#60A5FA",
  text:     "#FDF2F8",
  sub:      "#C084A0",
  muted:    "#6B2D4F",
} as const;

// â”€â”€ App â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const APP_NAME = "Lilys";
export const APP_EMOJI = "";

// â”€â”€ Categories (expenses) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const CATEGORIES: Category[] = [
  { id:"alimentacao", label:"AlimentaÃ§Ã£o",  emoji:"ðŸ”", color:"#FF6B6B", futile:false },
  { id:"transporte",  label:"Transporte",   emoji:"ðŸš—", color:"#FBBF24", futile:false },
  { id:"moradia",     label:"Moradia",      emoji:"ðŸ ", color:"#60A5FA", futile:false },
  { id:"saude",       label:"SaÃºde",        emoji:"ðŸ’Š", color:"#34D399", futile:false },
  { id:"educacao",    label:"EducaÃ§Ã£o",     emoji:"ðŸ“š", color:"#22D3EE", futile:false },
  { id:"contas",      label:"Contas",       emoji:"âš¡", color:"#F59E0B", futile:false },
  { id:"lazer",       label:"Lazer",        emoji:"ðŸŽ¬", color:"#A78BFA", futile:true  },
  { id:"roupas",      label:"Roupas",       emoji:"ðŸ‘—", color:"#F9A8D4", futile:true  },
  { id:"compras",     label:"Compras",      emoji:"ðŸ›’", color:"#FB7185", futile:true  },
  { id:"bar",         label:"Bar/Balada",   emoji:"ðŸ¹", color:"#86EFAC", futile:true  },
  { id:"cafe",        label:"CafÃ©/Lanches", emoji:"â˜•", color:"#C084FC", futile:true  },
  { id:"games",       label:"Games/Apps",   emoji:"ðŸŽ®", color:"#FB923C", futile:true  },
];

// â”€â”€ Income Categories â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const INCOME_CATS = [
  { id:"salario",      label:"SalÃ¡rio",        emoji:"ðŸ’¼" },
  { id:"freelance",    label:"Freelance",      emoji:"ðŸ’»" },
  { id:"investimento", label:"Investimentos",  emoji:"ðŸ“ˆ" },
  { id:"presente",     label:"Presente",       emoji:"ðŸŽ" },
  { id:"aluguel",      label:"Aluguel recebido",emoji:"ðŸ " },
  { id:"outro",        label:"Outro",          emoji:"âž•" },
];

export const getCat = (id: string) =>
  CATEGORIES.find(c => c.id === id) ?? CATEGORIES[0];

export const getIncomeCat = (id: string) =>
  INCOME_CATS.find(c => c.id === id) ?? INCOME_CATS[INCOME_CATS.length - 1];

// â”€â”€ Badges â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const BADGES: Badge[] = [
  { id:"first_entry",   emoji:"ðŸ“", title:"Primeiro Passo",      desc:"Cadastrou o primeiro gasto",            xp:50  },
  { id:"first_income",  emoji:"ðŸ’°", title:"Primeira Entrada",    desc:"Registrou sua primeira receita",        xp:50  },
  { id:"streak_7",      emoji:"ðŸ”¥", title:"7 Dias de Fogo",      desc:"7 dias consecutivos registrando",       xp:100 },
  { id:"streak_14",     emoji:"âš¡", title:"14 Dias ImparÃ¡vel",   desc:"14 dias consecutivos registrando",      xp:200 },
  { id:"streak_30",     emoji:"ðŸŒ•", title:"MÃªs Completo",        desc:"30 dias consecutivos registrando",      xp:400 },
  { id:"goal_hit",      emoji:"ðŸŽ¯", title:"Meta Atingida",       desc:"Ficou abaixo do orÃ§amento no mÃªs",      xp:250 },
  { id:"cut_futile_20", emoji:"âœ‚ï¸", title:"Corte Inteligente",   desc:"Reduziu gastos fÃºteis em 20%",          xp:150 },
  { id:"positive_bal",  emoji:"ðŸŒ¸", title:"Saldo Positivo",      desc:"Fechou o mÃªs com saldo positivo",       xp:300 },
  { id:"investor",      emoji:"ðŸ“ˆ", title:"Investidora",         desc:"Registrou entrada de investimento",     xp:200 },
  { id:"perfect_month", emoji:"â­", title:"MÃªs Perfeito",        desc:"Todas categorias abaixo do orÃ§amento",  xp:500 },
  { id:"tx_50",         emoji:"ðŸŽ“", title:"Organizadora Pro",    desc:"Classificou 50 transaÃ§Ãµes",             xp:100 },
  { id:"diamond_3",     emoji:"ðŸ’Ž", title:"Diamante",            desc:"3 meses consecutivos com meta batida",  xp:600 },
];

// â”€â”€ Levels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const LEVELS = [
  { name:"Iniciante",         icon:"ðŸŒ±", minXP:0    },
  { name:"Aprendiz",          icon:"ðŸŒ¸", minXP:200  },
  { name:"Consciente",        icon:"ðŸ‘ï¸",  minXP:500  },
  { name:"Planejadora",       icon:"ðŸ“‹", minXP:900  },
  { name:"Estrategista",      icon:"ðŸ§©", minXP:1400 },
  { name:"Especialista",      icon:"ðŸ’Ž", minXP:2000 },
  { name:"Mestre",            icon:"ðŸ…", minXP:2800 },
  { name:"Guru Financeira",   icon:"ðŸŒŸ", minXP:3800 },
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

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const brl = (n: number | undefined | null) =>
  "R$ " + (n ?? 0).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const fmtDate = (iso: string) => {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { day:"2-digit", month:"2-digit" });
};

