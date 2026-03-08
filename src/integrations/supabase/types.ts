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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      criteria: {
        Row: {
          completion_percentage: number | null
          created_at: string
          criterion_name: string
          criterion_number: number
          evidence_count: number | null
          id: string
          institution_id: string
          required_evidence_count: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string
          criterion_name: string
          criterion_number: number
          evidence_count?: number | null
          id?: string
          institution_id: string
          required_evidence_count?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string
          criterion_name?: string
          criterion_number?: number
          evidence_count?: number | null
          id?: string
          institution_id?: string
          required_evidence_count?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "criteria_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      data_sources: {
        Row: {
          api_endpoint: string | null
          api_key: string | null
          created_at: string
          id: string
          institution_id: string
          is_connected: boolean | null
          last_synced_at: string | null
          records_count: number | null
          source_name: string
        }
        Insert: {
          api_endpoint?: string | null
          api_key?: string | null
          created_at?: string
          id?: string
          institution_id: string
          is_connected?: boolean | null
          last_synced_at?: string | null
          records_count?: number | null
          source_name: string
        }
        Update: {
          api_endpoint?: string | null
          api_key?: string | null
          created_at?: string
          id?: string
          institution_id?: string
          is_connected?: boolean | null
          last_synced_at?: string | null
          records_count?: number | null
          source_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_sources_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_files: {
        Row: {
          criteria_id: string
          file_name: string
          file_type: string | null
          file_url: string
          id: string
          uploaded_at: string
          uploaded_by: string
          verified: boolean | null
        }
        Insert: {
          criteria_id: string
          file_name: string
          file_type?: string | null
          file_url: string
          id?: string
          uploaded_at?: string
          uploaded_by: string
          verified?: boolean | null
        }
        Update: {
          criteria_id?: string
          file_name?: string
          file_type?: string | null
          file_url?: string
          id?: string
          uploaded_at?: string
          uploaded_by?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_files_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "criteria"
            referencedColumns: ["id"]
          },
        ]
      }
      gaps: {
        Row: {
          ai_suggested_action: string | null
          assigned_department: string | null
          assigned_to: string | null
          created_at: string
          criteria_id: string | null
          due_date: string | null
          gap_description: string
          id: string
          institution_id: string
          severity: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          ai_suggested_action?: string | null
          assigned_department?: string | null
          assigned_to?: string | null
          created_at?: string
          criteria_id?: string | null
          due_date?: string | null
          gap_description: string
          id?: string
          institution_id: string
          severity?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          ai_suggested_action?: string | null
          assigned_department?: string | null
          assigned_to?: string | null
          created_at?: string
          criteria_id?: string | null
          due_date?: string | null
          gap_description?: string
          id?: string
          institution_id?: string
          severity?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gaps_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gaps_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          accreditation_body: string | null
          affiliation_university: string | null
          created_at: string
          created_by: string | null
          cycle_year: string | null
          id: string
          naac_id: string | null
          name: string
          submission_deadline: string | null
          updated_at: string
        }
        Insert: {
          accreditation_body?: string | null
          affiliation_university?: string | null
          created_at?: string
          created_by?: string | null
          cycle_year?: string | null
          id?: string
          naac_id?: string | null
          name: string
          submission_deadline?: string | null
          updated_at?: string
        }
        Update: {
          accreditation_body?: string | null
          affiliation_university?: string | null
          created_at?: string
          created_by?: string | null
          cycle_year?: string | null
          id?: string
          naac_id?: string | null
          name?: string
          submission_deadline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      key_indicators: {
        Row: {
          completion_percentage: number | null
          created_at: string | null
          criteria_id: string
          evidence_count: number | null
          id: string
          indicator_code: string
          indicator_name: string
          required_evidence_count: number | null
          status: string | null
          updated_at: string | null
          weightage: number | null
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string | null
          criteria_id: string
          evidence_count?: number | null
          id?: string
          indicator_code: string
          indicator_name: string
          required_evidence_count?: number | null
          status?: string | null
          updated_at?: string | null
          weightage?: number | null
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string | null
          criteria_id?: string
          evidence_count?: number | null
          id?: string
          indicator_code?: string
          indicator_name?: string
          required_evidence_count?: number | null
          status?: string | null
          updated_at?: string | null
          weightage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "key_indicators_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "criteria"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          created_at: string
          due_date: string
          id: string
          institution_id: string
          is_completed: boolean | null
          is_overdue: boolean | null
          title: string
        }
        Insert: {
          created_at?: string
          due_date: string
          id?: string
          institution_id: string
          is_completed?: boolean | null
          is_overdue?: boolean | null
          title: string
        }
        Update: {
          created_at?: string
          due_date?: string
          id?: string
          institution_id?: string
          is_completed?: boolean | null
          is_overdue?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          institution_id: string | null
          is_read: boolean | null
          message: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          institution_id?: string | null
          is_read?: boolean | null
          message: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          institution_id?: string | null
          is_read?: boolean | null
          message?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          accreditation_body: string | null
          content_json: Json | null
          created_at: string
          created_by: string | null
          docx_url: string | null
          id: string
          institution_id: string
          pdf_url: string | null
          status: string | null
          title: string
          updated_at: string
          version: number | null
        }
        Insert: {
          accreditation_body?: string | null
          content_json?: Json | null
          created_at?: string
          created_by?: string | null
          docx_url?: string | null
          id?: string
          institution_id: string
          pdf_url?: string | null
          status?: string | null
          title: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          accreditation_body?: string | null
          content_json?: Json | null
          created_at?: string
          created_by?: string | null
          docx_url?: string | null
          id?: string
          institution_id?: string
          pdf_url?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          criteria_id: string | null
          department: string | null
          description: string | null
          due_date: string | null
          id: string
          institution_id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          criteria_id?: string | null
          department?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          institution_id: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          criteria_id?: string | null
          department?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          institution_id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
      setup_institution: {
        Args: { _naac_id?: string; _name: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
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
      app_role: ["admin", "editor", "viewer"],
    },
  },
} as const
