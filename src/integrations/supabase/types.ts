export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contacts: {
        Row: {
          address: string | null
          created_at: string
          dept: string
          description: string | null
          email: string | null
          hours: string | null
          id: string
          meetings: string | null
          phone: string | null
          town_slug: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          dept: string
          description?: string | null
          email?: string | null
          hours?: string | null
          id?: string
          meetings?: string | null
          phone?: string | null
          town_slug: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          dept?: string
          description?: string | null
          email?: string | null
          hours?: string | null
          id?: string
          meetings?: string | null
          phone?: string | null
          town_slug?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_town_slug_fkey"
            columns: ["town_slug"]
            isOneToOne: false
            referencedRelation: "towns"
            referencedColumns: ["slug"]
          },
        ]
      }
      ordinances: {
        Row: {
          category: string
          code: string | null
          created_at: string
          id: string
          summary: string | null
          title: string
          town_slug: string
          updated_at: string
        }
        Insert: {
          category: string
          code?: string | null
          created_at?: string
          id?: string
          summary?: string | null
          title: string
          town_slug: string
          updated_at?: string
        }
        Update: {
          category?: string
          code?: string | null
          created_at?: string
          id?: string
          summary?: string | null
          title?: string
          town_slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordinances_town_slug_fkey"
            columns: ["town_slug"]
            isOneToOne: false
            referencedRelation: "towns"
            referencedColumns: ["slug"]
          },
        ]
      }
      permits: {
        Row: {
          created_at: string
          description: string | null
          fee: string | null
          fee_note: string | null
          id: string
          name: string
          requirements: string[] | null
          timeline: string | null
          town_slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          fee?: string | null
          fee_note?: string | null
          id?: string
          name: string
          requirements?: string[] | null
          timeline?: string | null
          town_slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          fee?: string | null
          fee_note?: string | null
          id?: string
          name?: string
          requirements?: string[] | null
          timeline?: string | null
          town_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "permits_town_slug_fkey"
            columns: ["town_slug"]
            isOneToOne: false
            referencedRelation: "towns"
            referencedColumns: ["slug"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      projects: {
        Row: {
          address: string
          checklist: Json | null
          created_at: string
          id: string
          project_type: string
          status: string
          town_slug: string | null
          updated_at: string
          user_id: string
          zone: string | null
        }
        Insert: {
          address: string
          checklist?: Json | null
          created_at?: string
          id?: string
          project_type: string
          status?: string
          town_slug?: string | null
          updated_at?: string
          user_id: string
          zone?: string | null
        }
        Update: {
          address?: string
          checklist?: Json | null
          created_at?: string
          id?: string
          project_type?: string
          status?: string
          town_slug?: string | null
          updated_at?: string
          user_id?: string
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_town_slug_fkey"
            columns: ["town_slug"]
            isOneToOne: false
            referencedRelation: "towns"
            referencedColumns: ["slug"]
          },
        ]
      }
      saved_towns: {
        Row: {
          created_at: string
          id: string
          town_slug: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          town_slug: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          town_slug?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_towns_town_slug_fkey"
            columns: ["town_slug"]
            isOneToOne: false
            referencedRelation: "towns"
            referencedColumns: ["slug"]
          },
        ]
      }
      towns: {
        Row: {
          character: string | null
          county: string
          created_at: string
          full_name: string
          last_verified: string | null
          median_home: string | null
          name: string
          num_zones: number | null
          population: string | null
          slug: string
          source: string | null
          total_area: string | null
          updated_at: string
        }
        Insert: {
          character?: string | null
          county: string
          created_at?: string
          full_name: string
          last_verified?: string | null
          median_home?: string | null
          name: string
          num_zones?: number | null
          population?: string | null
          slug: string
          source?: string | null
          total_area?: string | null
          updated_at?: string
        }
        Update: {
          character?: string | null
          county?: string
          created_at?: string
          full_name?: string
          last_verified?: string | null
          median_home?: string | null
          name?: string
          num_zones?: number | null
          population?: string | null
          slug?: string
          source?: string | null
          total_area?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      zones: {
        Row: {
          code: string
          conditional: string[] | null
          created_at: string
          description: string | null
          far: string | null
          id: string
          max_coverage: string | null
          max_height: string | null
          min_lot: string | null
          name: string
          permitted: string[] | null
          prohibited: string[] | null
          setback_front: string | null
          setback_rear: string | null
          setback_side: string | null
          town_slug: string
        }
        Insert: {
          code: string
          conditional?: string[] | null
          created_at?: string
          description?: string | null
          far?: string | null
          id?: string
          max_coverage?: string | null
          max_height?: string | null
          min_lot?: string | null
          name: string
          permitted?: string[] | null
          prohibited?: string[] | null
          setback_front?: string | null
          setback_rear?: string | null
          setback_side?: string | null
          town_slug: string
        }
        Update: {
          code?: string
          conditional?: string[] | null
          created_at?: string
          description?: string | null
          far?: string | null
          id?: string
          max_coverage?: string | null
          max_height?: string | null
          min_lot?: string | null
          name?: string
          permitted?: string[] | null
          prohibited?: string[] | null
          setback_front?: string | null
          setback_rear?: string | null
          setback_side?: string | null
          town_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "zones_town_slug_fkey"
            columns: ["town_slug"]
            isOneToOne: false
            referencedRelation: "towns"
            referencedColumns: ["slug"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "contractor" | "user"
      user_type: "homeowner" | "contractor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "contractor", "user"],
      user_type: ["homeowner", "contractor"],
    },
  },
} as const
