export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:             string;
          full_name:      string | null;
          display_name:   string | null;
          avatar_url:     string | null;
          monthly_budget: number;
          salary:         number;
          streak_days:    number;
          streak_record:  number;
          last_entry_date:string | null;
          created_at:     string;
          updated_at:     string;
        };
        Insert: {
          id:              string;
          full_name?:      string | null;
          display_name?:   string | null;
          avatar_url?:     string | null;
          monthly_budget?: number;
          salary?:         number;
          streak_days?:    number;
          streak_record?:  number;
          last_entry_date?:string | null;
        };
        Update: {
          full_name?:      string | null;
          display_name?:   string | null;
          avatar_url?:     string | null;
          monthly_budget?: number;
          salary?:         number;
          streak_days?:    number;
          streak_record?:  number;
          last_entry_date?:string | null;
          updated_at?:     string;
        };
      };
      transactions: {
        Row: {
          id:          string;
          user_id:     string;
          category:    string;
          amount:      number;
          description: string;
          date:        string;
          futile:      boolean;
          created_at:  string;
        };
        Insert: {
          id?:          string;
          user_id:      string;
          category:     string;
          amount:       number;
          description:  string;
          date?:        string;
          futile?:      boolean;
        };
        Update: {
          category?:    string;
          amount?:      number;
          description?: string;
          date?:        string;
          futile?:      boolean;
        };
      };
      income_entries: {
        Row: {
          id:          string;
          user_id:     string;
          amount:      number;
          description: string;
          category:    string;
          date:        string;
          created_at:  string;
        };
        Insert: {
          id?:          string;
          user_id:      string;
          amount:       number;
          description:  string;
          category?:    string;
          date?:        string;
        };
        Update: {
          amount?:      number;
          description?: string;
          category?:    string;
          date?:        string;
        };
      };
      user_badges: {
        Row: {
          id:          string;
          user_id:     string;
          badge_id:    string;
          unlocked_at: string;
        };
        Insert: {
          id?:         string;
          user_id:     string;
          badge_id:    string;
          unlocked_at?:string;
        };
        Update: never;
      };
    };
    Views: {
      monthly_summaries: {
        Row: {
          user_id:           string;
          month:             string;
          total_spent:       number;
          futile_spent:      number;
          essential_spent:   number;
          transaction_count: number;
          total_income:      number;
        };
      };
    };
    Functions: Record<string, never>;
    Enums:     Record<string, never>;
  };
};

export type Profile        = Database["public"]["Tables"]["profiles"]["Row"];
export type Transaction    = Database["public"]["Tables"]["transactions"]["Row"];
export type IncomeEntry    = Database["public"]["Tables"]["income_entries"]["Row"];
export type UserBadge      = Database["public"]["Tables"]["user_badges"]["Row"];
export type MonthlySummary = Database["public"]["Views"]["monthly_summaries"]["Row"];

export type Category = {
  id:     string;
  label:  string;
  emoji:  string;
  color:  string;
  futile: boolean;
};

export type Badge = {
  id:    string;
  emoji: string;
  title: string;
  desc:  string;
  xp:    number;
};

export type CategoryData = Category & { value: number };

