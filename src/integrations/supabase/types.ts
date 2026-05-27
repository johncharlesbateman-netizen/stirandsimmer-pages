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
      admin_emails: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          content: string
          created_at: string
          excerpt: string
          id: string
          image_url: string | null
          published: boolean
          published_at: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          content: string
          created_at?: string
          excerpt: string
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          excerpt?: string
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      challenge_progress: {
        Row: {
          challenge_id: string
          completed: boolean
          completed_at: string | null
          id: string
          updated_at: string
          user_id: string
          verified_count: number
        }
        Insert: {
          challenge_id: string
          completed?: boolean
          completed_at?: string | null
          id?: string
          updated_at?: string
          user_id: string
          verified_count?: number
        }
        Update: {
          challenge_id?: string
          completed?: boolean
          completed_at?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          verified_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          cook_time_minutes: number
          created_at: string
          cuisine_region: string
          description: string
          id: string
          is_locked_until_points: number
          points_reward: number
          recipe_name: string
          recipe_url: string
          required_count: number
          sort_order: number
          title: string
          unlock_reward_id: string | null
        }
        Insert: {
          cook_time_minutes?: number
          created_at?: string
          cuisine_region: string
          description: string
          id?: string
          is_locked_until_points?: number
          points_reward?: number
          recipe_name: string
          recipe_url: string
          required_count?: number
          sort_order?: number
          title: string
          unlock_reward_id?: string | null
        }
        Update: {
          cook_time_minutes?: number
          created_at?: string
          cuisine_region?: string
          description?: string
          id?: string
          is_locked_until_points?: number
          points_reward?: number
          recipe_name?: string
          recipe_url?: string
          required_count?: number
          sort_order?: number
          title?: string
          unlock_reward_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_unlock_reward_id_fkey"
            columns: ["unlock_reward_id"]
            isOneToOne: false
            referencedRelation: "secrets_pass"
            referencedColumns: ["id"]
          },
        ]
      }
      cooked_dishes: {
        Row: {
          cooked_at: string
          id: string
          photo_url: string | null
          photo_verified: boolean
          recipe_id: string
          recipe_name: string | null
          user_id: string
        }
        Insert: {
          cooked_at?: string
          id?: string
          photo_url?: string | null
          photo_verified?: boolean
          recipe_id: string
          recipe_name?: string | null
          user_id: string
        }
        Update: {
          cooked_at?: string
          id?: string
          photo_url?: string | null
          photo_verified?: boolean
          recipe_id?: string
          recipe_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      guides: {
        Row: {
          body: string
          created_at: string
          id: string
          image_url: string | null
          intro: string
          last_updated_at: string
          published: boolean
          published_at: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          image_url?: string | null
          intro: string
          last_updated_at?: string
          published?: boolean
          published_at?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          image_url?: string | null
          intro?: string
          last_updated_at?: string
          published?: boolean
          published_at?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          chef_name: string | null
          cooking_style: string | null
          created_at: string
          dietary: string | null
          first_name: string | null
          id: string
          level: number
          onboarding_completed: boolean
          regions: string[]
          skill_level: string | null
          spice_tolerance: string | null
          time_available: string | null
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar?: string | null
          chef_name?: string | null
          cooking_style?: string | null
          created_at?: string
          dietary?: string | null
          first_name?: string | null
          id?: string
          level?: number
          onboarding_completed?: boolean
          regions?: string[]
          skill_level?: string | null
          spice_tolerance?: string | null
          time_available?: string | null
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar?: string | null
          chef_name?: string | null
          cooking_style?: string | null
          created_at?: string
          dietary?: string | null
          first_name?: string | null
          id?: string
          level?: number
          onboarding_completed?: boolean
          regions?: string[]
          skill_level?: string | null
          spice_tolerance?: string | null
          time_available?: string | null
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recipe_ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          recipe_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          recipe_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          recipe_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ratings_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          categories: Database["public"]["Enums"]["recipe_category"][]
          collections: string[]
          cook_time_minutes: number | null
          created_at: string
          cuisine_region: string | null
          description: string
          id: string
          image_url: string | null
          ingredients: Json
          instructions: Json
          is_seasonal: boolean | null
          meal_types: string[]
          prep_time_minutes: number | null
          published: boolean
          seo_description: string | null
          seo_title: string | null
          servings: number | null
          slug: string
          tips: string | null
          title: string
          updated_at: string
        }
        Insert: {
          categories?: Database["public"]["Enums"]["recipe_category"][]
          collections?: string[]
          cook_time_minutes?: number | null
          created_at?: string
          cuisine_region?: string | null
          description: string
          id?: string
          image_url?: string | null
          ingredients?: Json
          instructions?: Json
          is_seasonal?: boolean | null
          meal_types?: string[]
          prep_time_minutes?: number | null
          published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          servings?: number | null
          slug: string
          tips?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          categories?: Database["public"]["Enums"]["recipe_category"][]
          collections?: string[]
          cook_time_minutes?: number | null
          created_at?: string
          cuisine_region?: string | null
          description?: string
          id?: string
          image_url?: string | null
          ingredients?: Json
          instructions?: Json
          is_seasonal?: boolean | null
          meal_types?: string[]
          prep_time_minutes?: number | null
          published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          servings?: number | null
          slug?: string
          tips?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      region_challenge_history: {
        Row: {
          challenge: string
          id: string
          region_id: string
          replaced_at: string
        }
        Insert: {
          challenge: string
          id?: string
          region_id: string
          replaced_at?: string
        }
        Update: {
          challenge?: string
          id?: string
          region_id?: string
          replaced_at?: string
        }
        Relationships: []
      }
      region_challenges: {
        Row: {
          challenge: string
          created_at: string
          region_id: string
          updated_at: string
        }
        Insert: {
          challenge: string
          created_at?: string
          region_id: string
          updated_at?: string
        }
        Update: {
          challenge?: string
          created_at?: string
          region_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      secrets_pass: {
        Row: {
          content: string
          created_at: string
          id: string
          is_welcome: boolean
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_welcome?: boolean
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_welcome?: boolean
          title?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      unlocked_secrets: {
        Row: {
          id: string
          secret_id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          id?: string
          secret_id: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          id?: string
          secret_id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unlocked_secrets_secret_id_fkey"
            columns: ["secret_id"]
            isOneToOne: false
            referencedRelation: "secrets_pass"
            referencedColumns: ["id"]
          },
        ]
      }
      verifications: {
        Row: {
          challenge_id: string
          id: string
          photo_url: string
          points_awarded: number
          recipe_name: string
          recipe_url: string
          unlocked_secret_id: string | null
          user_id: string
          verified_at: string
        }
        Insert: {
          challenge_id: string
          id?: string
          photo_url: string
          points_awarded?: number
          recipe_name: string
          recipe_url: string
          unlocked_secret_id?: string | null
          user_id: string
          verified_at?: string
        }
        Update: {
          challenge_id?: string
          id?: string
          photo_url?: string
          points_awarded?: number
          recipe_name?: string
          recipe_url?: string
          unlocked_secret_id?: string | null
          user_id?: string
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "verifications_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verifications_unlocked_secret_id_fkey"
            columns: ["unlocked_secret_id"]
            isOneToOne: false
            referencedRelation: "secrets_pass"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      recipe_rating_stats: {
        Row: {
          average_rating: number | null
          rating_count: number | null
          recipe_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ratings_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      is_admin: { Args: never; Returns: boolean }
      level_for_points: { Args: { p: number }; Returns: number }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      verify_dish: {
        Args: { p_challenge_id: string; p_photo_url: string }
        Returns: Json
      }
    }
    Enums: {
      recipe_category:
        | "chicken"
        | "beef"
        | "lamb"
        | "pork"
        | "spicy"
        | "seafood"
        | "lunch_suggestions"
        | "sweets"
        | "pasta"
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
      recipe_category: [
        "chicken",
        "beef",
        "lamb",
        "pork",
        "spicy",
        "seafood",
        "lunch_suggestions",
        "sweets",
        "pasta",
      ],
    },
  },
} as const
