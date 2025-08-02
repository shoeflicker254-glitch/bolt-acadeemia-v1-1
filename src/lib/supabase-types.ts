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