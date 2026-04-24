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
      app_config: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      civic_events: {
        Row: {
          confidence: Database["public"]["Enums"]["data_confidence"]
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          kind: string
          last_verified_at: string | null
          location: string | null
          source_doc: string | null
          source_url: string | null
          starts_at: string
          title: string
          town_slug: string
          updated_at: string
          verified_by: string | null
        }
        Insert: {
          confidence?: Database["public"]["Enums"]["data_confidence"]
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          kind?: string
          last_verified_at?: string | null
          location?: string | null
          source_doc?: string | null
          source_url?: string | null
          starts_at: string
          title: string
          town_slug: string
          updated_at?: string
          verified_by?: string | null
        }
        Update: {
          confidence?: Database["public"]["Enums"]["data_confidence"]
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          kind?: string
          last_verified_at?: string | null
          location?: string | null
          source_doc?: string | null
          source_url?: string | null
          starts_at?: string
          title?: string
          town_slug?: string
          updated_at?: string
          verified_by?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          address: string | null
          confidence: Database["public"]["Enums"]["data_confidence"]
          created_at: string
          dept: string
          description: string | null
          email: string | null
          hours: string | null
          id: string
          last_verified_at: string | null
          meetings: string | null
          phone: string | null
          source_doc: string | null
          source_url: string | null
          town_slug: string
          verified_by: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          confidence?: Database["public"]["Enums"]["data_confidence"]
          created_at?: string
          dept: string
          description?: string | null
          email?: string | null
          hours?: string | null
          id?: string
          last_verified_at?: string | null
          meetings?: string | null
          phone?: string | null
          source_doc?: string | null
          source_url?: string | null
          town_slug: string
          verified_by?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          confidence?: Database["public"]["Enums"]["data_confidence"]
          created_at?: string
          dept?: string
          description?: string | null
          email?: string | null
          hours?: string | null
          id?: string
          last_verified_at?: string | null
          meetings?: string | null
          phone?: string | null
          source_doc?: string | null
          source_url?: string | null
          town_slug?: string
          verified_by?: string | null
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
      data_corrections: {
        Row: {
          created_at: string
          current_value: string | null
          description: string
          evidence_url: string | null
          field: string | null
          id: string
          proposed_value: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          row_id: string | null
          section: string | null
          status: Database["public"]["Enums"]["correction_status"]
          submitter_email: string | null
          submitter_user_id: string | null
          table_name: string
          town_slug: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_value?: string | null
          description: string
          evidence_url?: string | null
          field?: string | null
          id?: string
          proposed_value?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          row_id?: string | null
          section?: string | null
          status?: Database["public"]["Enums"]["correction_status"]
          submitter_email?: string | null
          submitter_user_id?: string | null
          table_name: string
          town_slug?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_value?: string | null
          description?: string
          evidence_url?: string | null
          field?: string | null
          id?: string
          proposed_value?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          row_id?: string | null
          section?: string | null
          status?: Database["public"]["Enums"]["correction_status"]
          submitter_email?: string | null
          submitter_user_id?: string | null
          table_name?: string
          town_slug?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      data_drifts: {
        Row: {
          change_type: string
          detected_at: string
          diff_summary: string | null
          id: string
          ingestion_type: string
          new_snapshot: Json | null
          old_snapshot: Json | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          row_id: string | null
          source_url: string
          status: string
          table_name: string
          town_slug: string
        }
        Insert: {
          change_type?: string
          detected_at?: string
          diff_summary?: string | null
          id?: string
          ingestion_type: string
          new_snapshot?: Json | null
          old_snapshot?: Json | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          row_id?: string | null
          source_url: string
          status?: string
          table_name: string
          town_slug: string
        }
        Update: {
          change_type?: string
          detected_at?: string
          diff_summary?: string | null
          id?: string
          ingestion_type?: string
          new_snapshot?: Json | null
          old_snapshot?: Json | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          row_id?: string | null
          source_url?: string
          status?: string
          table_name?: string
          town_slug?: string
        }
        Relationships: []
      }
      glossary_terms: {
        Row: {
          created_at: string
          definition: string
          id: string
          related: string[] | null
          term: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          definition: string
          id?: string
          related?: string[] | null
          term: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          definition?: string
          id?: string
          related?: string[] | null
          term?: string
          updated_at?: string
        }
        Relationships: []
      }
      guides: {
        Row: {
          author: string | null
          body: string
          category: string | null
          created_at: string
          description: string | null
          hero_image_url: string | null
          id: string
          published_at: string
          read_time: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          body?: string
          category?: string | null
          created_at?: string
          description?: string | null
          hero_image_url?: string | null
          id?: string
          published_at?: string
          read_time?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          body?: string
          category?: string | null
          created_at?: string
          description?: string | null
          hero_image_url?: string | null
          id?: string
          published_at?: string
          read_time?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      homeowner_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          read_at: string | null
          ref_id: string | null
          town_slug: string | null
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          read_at?: string | null
          ref_id?: string | null
          town_slug?: string | null
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          read_at?: string | null
          ref_id?: string | null
          town_slug?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ingestion_runs: {
        Row: {
          error_message: string | null
          finished_at: string | null
          id: string
          ingestion_type: string
          raw_response: Json | null
          rows_added: number | null
          rows_updated: number | null
          source_doc: string | null
          source_url: string
          started_at: string
          status: string
          town_slug: string | null
          triggered_by: string | null
        }
        Insert: {
          error_message?: string | null
          finished_at?: string | null
          id?: string
          ingestion_type: string
          raw_response?: Json | null
          rows_added?: number | null
          rows_updated?: number | null
          source_doc?: string | null
          source_url: string
          started_at?: string
          status?: string
          town_slug?: string | null
          triggered_by?: string | null
        }
        Update: {
          error_message?: string | null
          finished_at?: string | null
          id?: string
          ingestion_type?: string
          raw_response?: Json | null
          rows_added?: number | null
          rows_updated?: number | null
          source_doc?: string | null
          source_url?: string
          started_at?: string
          status?: string
          town_slug?: string | null
          triggered_by?: string | null
        }
        Relationships: []
      }
      ordinances: {
        Row: {
          category: string
          code: string | null
          confidence: Database["public"]["Enums"]["data_confidence"]
          created_at: string
          id: string
          last_verified_at: string | null
          source_doc: string | null
          source_url: string | null
          summary: string | null
          title: string
          town_slug: string
          updated_at: string
          verified_by: string | null
        }
        Insert: {
          category: string
          code?: string | null
          confidence?: Database["public"]["Enums"]["data_confidence"]
          created_at?: string
          id?: string
          last_verified_at?: string | null
          source_doc?: string | null
          source_url?: string | null
          summary?: string | null
          title: string
          town_slug: string
          updated_at?: string
          verified_by?: string | null
        }
        Update: {
          category?: string
          code?: string | null
          confidence?: Database["public"]["Enums"]["data_confidence"]
          created_at?: string
          id?: string
          last_verified_at?: string | null
          source_doc?: string | null
          source_url?: string | null
          summary?: string | null
          title?: string
          town_slug?: string
          updated_at?: string
          verified_by?: string | null
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
          confidence: Database["public"]["Enums"]["data_confidence"]
          created_at: string
          description: string | null
          fee: string | null
          fee_note: string | null
          id: string
          last_verified_at: string | null
          name: string
          requirements: string[] | null
          source_doc: string | null
          source_url: string | null
          timeline: string | null
          town_slug: string
          verified_by: string | null
        }
        Insert: {
          confidence?: Database["public"]["Enums"]["data_confidence"]
          created_at?: string
          description?: string | null
          fee?: string | null
          fee_note?: string | null
          id?: string
          last_verified_at?: string | null
          name: string
          requirements?: string[] | null
          source_doc?: string | null
          source_url?: string | null
          timeline?: string | null
          town_slug: string
          verified_by?: string | null
        }
        Update: {
          confidence?: Database["public"]["Enums"]["data_confidence"]
          created_at?: string
          description?: string | null
          fee?: string | null
          fee_note?: string | null
          id?: string
          last_verified_at?: string | null
          name?: string
          requirements?: string[] | null
          source_doc?: string | null
          source_url?: string | null
          timeline?: string | null
          town_slug?: string
          verified_by?: string | null
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
          primary_address: string | null
          primary_town_slug: string | null
          primary_zone_code: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          primary_address?: string | null
          primary_town_slug?: string | null
          primary_zone_code?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          primary_address?: string | null
          primary_town_slug?: string | null
          primary_zone_code?: string | null
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
      town_sources: {
        Row: {
          created_at: string
          discovered_by: string | null
          id: string
          ingestion_type: string
          last_used_at: string | null
          notes: string | null
          source_doc: string | null
          source_label: string | null
          source_url: string
          town_slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          discovered_by?: string | null
          id?: string
          ingestion_type: string
          last_used_at?: string | null
          notes?: string | null
          source_doc?: string | null
          source_label?: string | null
          source_url: string
          town_slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          discovered_by?: string | null
          id?: string
          ingestion_type?: string
          last_used_at?: string | null
          notes?: string | null
          source_doc?: string | null
          source_label?: string | null
          source_url?: string
          town_slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      towns: {
        Row: {
          auto_refresh_enabled: boolean
          character: string | null
          county: string
          created_at: string
          data_status: Database["public"]["Enums"]["town_data_status"]
          full_name: string
          last_verified: string | null
          median_home: string | null
          name: string
          next_refresh_at: string | null
          num_zones: number | null
          population: string | null
          slug: string
          source: string | null
          total_area: string | null
          updated_at: string
        }
        Insert: {
          auto_refresh_enabled?: boolean
          character?: string | null
          county: string
          created_at?: string
          data_status?: Database["public"]["Enums"]["town_data_status"]
          full_name: string
          last_verified?: string | null
          median_home?: string | null
          name: string
          next_refresh_at?: string | null
          num_zones?: number | null
          population?: string | null
          slug: string
          source?: string | null
          total_area?: string | null
          updated_at?: string
        }
        Update: {
          auto_refresh_enabled?: boolean
          character?: string | null
          county?: string
          created_at?: string
          data_status?: Database["public"]["Enums"]["town_data_status"]
          full_name?: string
          last_verified?: string | null
          median_home?: string | null
          name?: string
          next_refresh_at?: string | null
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
          confidence: Database["public"]["Enums"]["data_confidence"]
          created_at: string
          description: string | null
          far: string | null
          id: string
          last_verified_at: string | null
          max_coverage: string | null
          max_height: string | null
          min_lot: string | null
          name: string
          permitted: string[] | null
          prohibited: string[] | null
          setback_front: string | null
          setback_rear: string | null
          setback_side: string | null
          source_doc: string | null
          source_url: string | null
          town_slug: string
          verified_by: string | null
        }
        Insert: {
          code: string
          conditional?: string[] | null
          confidence?: Database["public"]["Enums"]["data_confidence"]
          created_at?: string
          description?: string | null
          far?: string | null
          id?: string
          last_verified_at?: string | null
          max_coverage?: string | null
          max_height?: string | null
          min_lot?: string | null
          name: string
          permitted?: string[] | null
          prohibited?: string[] | null
          setback_front?: string | null
          setback_rear?: string | null
          setback_side?: string | null
          source_doc?: string | null
          source_url?: string | null
          town_slug: string
          verified_by?: string | null
        }
        Update: {
          code?: string
          conditional?: string[] | null
          confidence?: Database["public"]["Enums"]["data_confidence"]
          created_at?: string
          description?: string | null
          far?: string | null
          id?: string
          last_verified_at?: string | null
          max_coverage?: string | null
          max_height?: string | null
          min_lot?: string | null
          name?: string
          permitted?: string[] | null
          prohibited?: string[] | null
          setback_front?: string | null
          setback_rear?: string | null
          setback_side?: string | null
          source_doc?: string | null
          source_url?: string | null
          town_slug?: string
          verified_by?: string | null
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
      get_cron_secret: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      recompute_town_data_status: {
        Args: { _town_slug: string }
        Returns: Database["public"]["Enums"]["town_data_status"]
      }
    }
    Enums: {
      app_role: "admin" | "contractor" | "user"
      correction_status: "pending" | "approved" | "rejected"
      data_confidence: "verified" | "ai_extracted" | "placeholder"
      town_data_status: "verified" | "partial" | "placeholder"
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
      correction_status: ["pending", "approved", "rejected"],
      data_confidence: ["verified", "ai_extracted", "placeholder"],
      town_data_status: ["verified", "partial", "placeholder"],
      user_type: ["homeowner", "contractor"],
    },
  },
} as const
