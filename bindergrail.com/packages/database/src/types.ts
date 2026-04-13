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
          plan: 'free' | 'premium'
          stripe_customer_id: string | null
          beehiiv_subscriber_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          plan?: 'free' | 'premium'
          stripe_customer_id?: string | null
          beehiiv_subscriber_id?: string | null
        }
        Update: {
          display_name?: string | null
          plan?: 'free' | 'premium'
          stripe_customer_id?: string | null
          beehiiv_subscriber_id?: string | null
        }
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
          note?: string | null
          destination?: 'budget' | 'grail_fund' | null
        }
        Update: {
          type?: 'spend' | 'return' | 'sale'
          name?: string
          amount?: number
          date?: string
          tag?: string | null
          note?: string | null
          destination?: 'budget' | 'grail_fund' | null
        }
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
      }
      pm_wishlist_items: {
        Row: {
          id: string
          user_id: string
          name: string
          target_price: number | null
          note: string | null
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
          is_grail?: boolean
          status?: 'active' | 'acquired'
        }
        Update: {
          name?: string
          target_price?: number | null
          note?: string | null
          is_grail?: boolean
          status?: 'active' | 'acquired'
        }
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
      }
    }
  }
}
