export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          role: string
          school_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role?: string
          school_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role?: string
          school_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          admission_number: string
          first_name: string
          last_name: string
          date_of_birth: string | null
          gender: string | null
          school_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          admission_number: string
          first_name: string
          last_name: string
          date_of_birth?: string | null
          gender?: string | null
          school_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          admission_number?: string
          first_name?: string
          last_name?: string
          date_of_birth?: string | null
          gender?: string | null
          school_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          school_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          school_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          school_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      super_admins: {
        Row: {
          id: string
          email: string
          password_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          school_id: string
          plan: string
          status: string
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          plan: string
          status?: string
          start_date?: string
          end_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          plan?: string
          status?: string
          start_date?: string
          end_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      demo_requests: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          institution: string
          role: string
          version: string
          message: string | null
          calendly_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          institution: string
          role: string
          version: string
          message?: string | null
          calendly_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          institution?: string
          role?: string
          version?: string
          message?: string | null
          calendly_url?: string | null
          created_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          created_at?: string
        }
      }
      email_support_requests: {
        Row: {
          id: string
          sender_name: string
          sender_email: string
          subject: string
          support_type: string
          message: string
          ticket_number: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          sender_name: string
          sender_email: string
          subject: string
          support_type: string
          message: string
          ticket_number: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          sender_name?: string
          sender_email?: string
          subject?: string
          support_type?: string
          message?: string
          ticket_number?: string
          status?: string
          created_at?: string
        }
      }
      cms_pricing_plans: {
        Row: {
          id: string
          plan_name: string
          plan_description: string
          plan_type: 'saas' | 'standalone'
          price_amount: number
          price_period: string
          features: string[]
          is_highlighted: boolean
          badge_text?: string
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
          created_by?: string
          updated_by?: string
        }
        Insert: {
          id?: string
          plan_name: string
          plan_description: string
          plan_type: 'saas' | 'standalone'
          price_amount: number
          price_period?: string
          features?: string[]
          is_highlighted?: boolean
          badge_text?: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string
          updated_by?: string
        }
        Update: {
          id?: string
          plan_name?: string
          plan_description?: string
          plan_type?: 'saas' | 'standalone'
          price_amount?: number
          price_period?: string
          features?: string[]
          is_highlighted?: boolean
          badge_text?: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string
          updated_by?: string
        }
      }
      cms_addons: {
        Row: {
          id: string
          store_addon_id?: string
          addon_name: string
          addon_description: string
          addon_category: 'saas' | 'standalone'
          price_amount: number
          features: string[]
          is_popular: boolean
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
          updated_by?: string
        }
        Insert: {
          id?: string
          store_addon_id?: string
          addon_name: string
          addon_description: string
          addon_category: 'saas' | 'standalone'
          price_amount: number
          features?: string[]
          is_popular?: boolean
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
          updated_by?: string
        }
        Update: {
          id?: string
          store_addon_id?: string
          addon_name?: string
          addon_description?: string
          addon_category?: 'saas' | 'standalone'
          price_amount?: number
          features?: string[]
          is_popular?: boolean
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
          updated_by?: string
        }
      }
      cms_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: any
          setting_description?: string
          setting_category: string
          is_active: boolean
          created_at: string
          updated_at: string
          updated_by?: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: any
          setting_description?: string
          setting_category?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          updated_by?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: any
          setting_description?: string
          setting_category?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          updated_by?: string
        }
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
  }
}