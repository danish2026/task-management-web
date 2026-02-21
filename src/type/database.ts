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
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          due_date: string | null
          priority: 'Low' | 'Medium' | 'High'
          status: 'Pending' | 'Completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          due_date?: string | null
          priority?: 'Low' | 'Medium' | 'High'
          status?: 'Pending' | 'Completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          due_date?: string | null
          priority?: 'Low' | 'Medium' | 'High'
          status?: 'Pending' | 'Completed'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
