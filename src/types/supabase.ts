export type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

export interface Database {
  public: {
    Tables: {
      tickets: {
        Row: {
          id: string
          ticket_no: string
          created_at: string
          short_desc: string
          description: string
          owner: string
          device: string
          status: string
          user: string | null
        }
        Insert: {
          short_desc: string
          description: string
          owner: string
          device: string
          status?: string
          user?: string | null
        }
        // etc...
      }
      // other tables here...
    }
  }
}