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
    PostgrestVersion: "14.15"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      account_invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string
          display_name: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          is_admin: boolean
          player_id: string | null
          token: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          display_name: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          is_admin?: boolean
          player_id?: string | null
          token?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          display_name?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          is_admin?: boolean
          player_id?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_invitations_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "account_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "account_invitations_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      activities: {
        Row: {
          activity_type: string
          actor_player_id: string | null
          color: string
          created_at: string
          description: string
          icon: string
          id: string
          match_id: string | null
          metadata: Json
          title: string
          tournament_id: string | null
        }
        Insert: {
          activity_type: string
          actor_player_id?: string | null
          color?: string
          created_at?: string
          description: string
          icon?: string
          id?: string
          match_id?: string | null
          metadata?: Json
          title: string
          tournament_id?: string | null
        }
        Update: {
          activity_type?: string
          actor_player_id?: string | null
          color?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          match_id?: string | null
          metadata?: Json
          title?: string
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_actor_player_id_fkey"
            columns: ["actor_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      group_players: {
        Row: {
          change_reason: string | null
          group_id: string
          id: string
          joined_at: string
          left_at: string | null
          moved_by: string | null
          player_id: string
          promoted_from_group_id: string | null
          seed: number | null
          status: string
          updated_at: string
        }
        Insert: {
          change_reason?: string | null
          group_id: string
          id?: string
          joined_at?: string
          left_at?: string | null
          moved_by?: string | null
          player_id: string
          promoted_from_group_id?: string | null
          seed?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          change_reason?: string | null
          group_id?: string
          id?: string
          joined_at?: string
          left_at?: string | null
          moved_by?: string | null
          player_id?: string
          promoted_from_group_id?: string | null
          seed?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_players_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_players_moved_by_fkey"
            columns: ["moved_by"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_players_promoted_from_group_id_fkey"
            columns: ["promoted_from_group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          tournament_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          tournament_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          tournament_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      match_history: {
        Row: {
          action: string
          created_at: string
          id: string
          match_id: string
          new_value: Json | null
          old_value: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          match_id: string
          new_value?: Json | null
          old_value?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          match_id?: string
          new_value?: Json | null
          old_value?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_history_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["user_id"]
          },
        ]
      }
      match_sets: {
        Row: {
          created_at: string
          id: string
          match_id: string
          player_one_score: number
          player_one_tiebreak_points: number | null
          player_two_score: number
          player_two_tiebreak_points: number | null
          set_number: number
          set_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
          player_one_score: number
          player_one_tiebreak_points?: number | null
          player_two_score: number
          player_two_tiebreak_points?: number | null
          set_number: number
          set_type?: string
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
          player_one_score?: number
          player_one_tiebreak_points?: number | null
          player_two_score?: number
          player_two_tiebreak_points?: number | null
          set_number?: number
          set_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_sets_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          court: string | null
          created_at: string
          group_id: string
          id: string
          location: string | null
          match_number: number | null
          notes: string | null
          player_one_id: string
          player_two_id: string
          result_entered_by: string | null
          result_type: string
          round_number: number
          scheduled_at: string | null
          status: string
          tournament_id: string
          updated_at: string
          winner_id: string | null
        }
        Insert: {
          court?: string | null
          created_at?: string
          group_id: string
          id?: string
          location?: string | null
          match_number?: number | null
          notes?: string | null
          player_one_id: string
          player_two_id: string
          result_entered_by?: string | null
          result_type?: string
          round_number?: number
          scheduled_at?: string | null
          status?: string
          tournament_id: string
          updated_at?: string
          winner_id?: string | null
        }
        Update: {
          court?: string | null
          created_at?: string
          group_id?: string
          id?: string
          location?: string | null
          match_number?: number | null
          notes?: string | null
          player_one_id?: string
          player_two_id?: string
          result_entered_by?: string | null
          result_type?: string
          round_number?: number
          scheduled_at?: string | null
          status?: string
          tournament_id?: string
          updated_at?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player_one_id_fkey"
            columns: ["player_one_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player_two_id_fkey"
            columns: ["player_two_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_result_entered_by_fkey"
            columns: ["result_entered_by"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string | null
          body: string
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          match_id: string | null
          read_at: string | null
          title: string
          tournament_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          body: string
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          match_id?: string | null
          read_at?: string | null
          title: string
          tournament_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          body?: string
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          match_id?: string | null
          read_at?: string | null
          title?: string
          tournament_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          avatar_url: string | null
          club_id: string | null
          created_at: string
          full_name: string
          id: string
          initials: string | null
          is_admin: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          club_id?: string | null
          created_at?: string
          full_name: string
          id: string
          initials?: string | null
          is_admin?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          club_id?: string | null
          created_at?: string
          full_name?: string
          id?: string
          initials?: string | null
          is_admin?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          club_id: string
          created_at: string
          ends_on: string | null
          id: string
          is_active: boolean
          name: string
          starts_on: string | null
          updated_at: string
        }
        Insert: {
          club_id: string
          created_at?: string
          ends_on?: string | null
          id?: string
          is_active?: boolean
          name: string
          starts_on?: string | null
          updated_at?: string
        }
        Update: {
          club_id?: string
          created_at?: string
          ends_on?: string | null
          id?: string
          is_active?: boolean
          name?: string
          starts_on?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seasons_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string
          id: string
          name: string
          points_for_loss: number
          points_for_win: number
          qualification_places: number | null
          season_id: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          points_for_loss?: number
          points_for_win?: number
          qualification_places?: number | null
          season_id: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          points_for_loss?: number
          points_for_win?: number
          qualification_places?: number | null
          season_id?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_accounts: {
        Row: {
          created_at: string
          is_admin: boolean
          player_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          is_admin?: boolean
          player_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          is_admin?: boolean
          player_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_accounts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_account_invitation: {
        Args: {
          invitation_display_name?: string
          invitation_email: string
          invitation_is_admin?: boolean
          invitation_player_id?: string
        }
        Returns: {
          expires_at: string
          token: string
        }[]
      }
      create_activity: {
        Args: {
          target_activity_type: string
          target_color?: string
          target_description: string
          target_icon?: string
          target_match_id?: string
          target_metadata?: Json
          target_title: string
          target_tournament_id?: string
        }
        Returns: string
      }
      create_notification: {
        Args: {
          notification_body: string
          notification_link?: string
          notification_title: string
          notification_type: string
          target_match_id?: string
          target_tournament_id?: string
          target_user_id: string
        }
        Returns: string
      }
      current_player_id: { Args: never; Returns: string }
      get_account_invitation_preview: {
        Args: { invitation_token: string }
        Returns: {
          display_name: string
          expires_at: string
          is_admin: boolean
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_match_participant: {
        Args: { target_match_id: string }
        Returns: boolean
      }
      save_match_result: {
        Args: { submitted_sets: Json; target_match_id: string }
        Returns: string
      }
      save_match_result_internal: {
        Args: { submitted_sets: Json; target_match_id: string }
        Returns: string
      }
      save_match_walkover: {
        Args: { selected_winner_id: string; target_match_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
