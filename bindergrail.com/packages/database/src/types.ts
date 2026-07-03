export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_color: string | null
          plan: 'free' | 'premium'
          currency: string
          stripe_customer_id: string | null
          beehiiv_subscriber_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_color?: string | null
          plan?: 'free' | 'premium'
          currency?: string
          stripe_customer_id?: string | null
          beehiiv_subscriber_id?: string | null
        }
        Update: {
          display_name?: string | null
          avatar_color?: string | null
          plan?: 'free' | 'premium'
          currency?: string
          stripe_customer_id?: string | null
          beehiiv_subscriber_id?: string | null
        }
        Relationships: []
      }
      pm_monthly_budgets: {
        Row: {
          id: string
          user_id: string
          year: number
          month: number
          budget_amount: number
          currency: string
          created_at: string
        }
        Insert: {
          user_id: string
          year: number
          month: number
          budget_amount: number
          currency?: string
        }
        Update: {
          budget_amount?: number
          currency?: string
        }
        Relationships: []
      }
      pm_transactions: {
        Row: {
          id: string
          user_id: string
          type: 'spend' | 'return' | 'sale'
          name: string
          amount: number
          date: string
          tag: string | null
          tags: string[]
          note: string | null
          destination: 'budget' | 'grail_fund' | null
          created_at: string
        }
        Insert: {
          user_id: string
          type: 'spend' | 'return' | 'sale'
          name: string
          amount: number
          date: string
          tag?: string | null
          tags?: string[]
          note?: string | null
          destination?: 'budget' | 'grail_fund' | null
        }
        Update: {
          type?: 'spend' | 'return' | 'sale'
          name?: string
          amount?: number
          date?: string
          tag?: string | null
          tags?: string[]
          note?: string | null
          destination?: 'budget' | 'grail_fund' | null
        }
        Relationships: []
      }
      pm_holds: {
        Row: {
          id: string
          user_id: string
          name: string
          amount: number
          due_date: string
          tag: string | null
          note: string | null
          status: 'pending' | 'done'
          created_at: string
        }
        Insert: {
          user_id: string
          name: string
          amount: number
          due_date: string
          tag?: string | null
          note?: string | null
          status?: 'pending' | 'done'
        }
        Update: {
          name?: string
          amount?: number
          due_date?: string
          tag?: string | null
          note?: string | null
          status?: 'pending' | 'done'
        }
        Relationships: []
      }
      pm_wishlist_items: {
        Row: {
          id: string
          user_id: string
          name: string
          target_price: number | null
          note: string | null
          url: string | null
          tag: string | null
          is_grail: boolean
          status: 'active' | 'acquired'
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          target_price?: number | null
          note?: string | null
          url?: string | null
          tag?: string | null
          is_grail?: boolean
          status?: 'active' | 'acquired'
        }
        Update: {
          name?: string
          target_price?: number | null
          note?: string | null
          url?: string | null
          tag?: string | null
          is_grail?: boolean
          status?: 'active' | 'acquired'
        }
        Relationships: []
      }
      pm_grail_fund: {
        Row: {
          id: string
          user_id: string
          wishlist_item_id: string
          amount_saved: number
          updated_at: string
        }
        Insert: {
          user_id: string
          wishlist_item_id: string
          amount_saved?: number
        }
        Update: {
          amount_saved?: number
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          id: string
          email: string
          source: string
          opted_into_newsletter: boolean
          created_at: string
        }
        Insert: {
          email: string
          source?: string
          opted_into_newsletter?: boolean
        }
        Update: {
          opted_into_newsletter?: boolean
        }
        Relationships: []
      }
      pm_user_settings: {
        Row: {
          user_id: string
          cash_reserve: number
          updated_at: string
        }
        Insert: {
          user_id: string
          cash_reserve?: number
        }
        Update: {
          cash_reserve?: number
        }
        Relationships: []
      }
      pm_user_tags: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          name: string
          color?: string | null
        }
        Update: {
          name?: string
          color?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
