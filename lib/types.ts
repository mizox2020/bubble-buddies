export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: "admin" | "user";
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: string;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          duration_minutes: number;
          images: string[];
          features: string[];
          active: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          price: number;
          duration_minutes?: number;
          images?: string[];
          features?: string[];
          active?: boolean;
        };
        Update: {
          name?: string;
          description?: string | null;
          price?: number;
          duration_minutes?: number;
          images?: string[];
          features?: string[];
          active?: boolean;
        };
      };
      available_slots: {
        Row: {
          id: string;
          slot_date: string;
          start_time: string;
          end_time: string;
          is_booked: boolean;
          created_at: string;
        };
        Insert: {
          slot_date: string;
          start_time: string;
          end_time: string;
          is_booked?: boolean;
        };
        Update: {
          slot_date?: string;
          start_time?: string;
          end_time?: string;
          is_booked?: boolean;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          service_id: string;
          slot_id: string;
          status: "pending" | "confirmed" | "cancelled" | "completed";
          notes: string | null;
          event_address: string | null;
          guest_count: number;
          assigned_user_id: string | null;
          answers: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          user_id: string;
          service_id: string;
          slot_id: string;
          status?: string;
          notes?: string | null;
          event_address?: string | null;
          guest_count?: number;
          assigned_user_id?: string | null;
          answers?: Record<string, unknown>;
        };
        Update: {
          status?: string;
          notes?: string | null;
          event_address?: string | null;
          guest_count?: number;
          assigned_user_id?: string | null;
          answers?: Record<string, unknown>;
        };
      };
      booking_questions: {
        Row: {
          id: string;
          label: string;
          type: "checkbox" | "text" | "select";
          options: string[] | null;
          required: boolean;
          active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          label: string;
          type?: string;
          options?: string[] | null;
          required?: boolean;
          active?: boolean;
          sort_order?: number;
        };
        Update: {
          label?: string;
          type?: string;
          options?: string[] | null;
          required?: boolean;
          active?: boolean;
          sort_order?: number;
        };
      };
      payments: {
        Row: {
          id: string;
          booking_id: string;
          amount: number;
          status: "pending" | "paid" | "refunded";
          payment_method: string | null;
          stripe_payment_id: string | null;
          created_at: string;
        };
        Insert: {
          booking_id: string;
          amount: number;
          status?: string;
          payment_method?: string | null;
          stripe_payment_id?: string | null;
        };
        Update: {
          amount?: number;
          status?: string;
          payment_method?: string | null;
          stripe_payment_id?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

export type Service = Database["public"]["Tables"]["services"]["Row"];
export type AvailableSlot = Database["public"]["Tables"]["available_slots"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type BookingQuestion = Database["public"]["Tables"]["booking_questions"]["Row"];
