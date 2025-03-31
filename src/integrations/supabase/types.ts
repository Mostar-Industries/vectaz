export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          id: number
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          timestamp: string | null
          user_id: number | null
        }
        Insert: {
          action: string
          id?: never
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          timestamp?: string | null
          user_id?: number | null
        }
        Update: {
          action?: string
          id?: never
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          timestamp?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coordinates: {
        Row: {
          created_at: string | null
          destination_country: string | null
          destination_latitude: number | null
          destination_longitude: number | null
          id: string
          origin_country: string | null
          origin_latitude: number | null
          origin_longitude: number | null
        }
        Insert: {
          created_at?: string | null
          destination_country?: string | null
          destination_latitude?: number | null
          destination_longitude?: number | null
          id: string
          origin_country?: string | null
          origin_latitude?: number | null
          origin_longitude?: number | null
        }
        Update: {
          created_at?: string | null
          destination_country?: string | null
          destination_latitude?: number | null
          destination_longitude?: number | null
          id?: string
          origin_country?: string | null
          origin_latitude?: number | null
          origin_longitude?: number | null
        }
        Relationships: []
      }
      forwarders: {
        Row: {
          active: boolean | null
          cost_rating: number | null
          created_at: string | null
          id: string
          name: string
          reliability_rating: number | null
          time_rating: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          cost_rating?: number | null
          created_at?: string | null
          id: string
          name: string
          reliability_rating?: number | null
          time_rating?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          cost_rating?: number | null
          created_at?: string | null
          id?: string
          name?: string
          reliability_rating?: number | null
          time_rating?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: number
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: never
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: never
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          actual_delivery_date: string | null
          created_at: string | null
          delivery_status: string | null
          destination_country: string | null
          destination_latitude: number | null
          destination_longitude: number | null
          estimated_delivery_date: string | null
          freight_carrier: string | null
          id: string
          mode_of_shipment: string | null
          origin_country: string | null
          origin_latitude: number | null
          origin_longitude: number | null
          priority: string | null
          recommended_forwarder: string | null
          risk_level: string | null
          updated_at: string | null
        }
        Insert: {
          actual_delivery_date?: string | null
          created_at?: string | null
          delivery_status?: string | null
          destination_country?: string | null
          destination_latitude?: number | null
          destination_longitude?: number | null
          estimated_delivery_date?: string | null
          freight_carrier?: string | null
          id: string
          mode_of_shipment?: string | null
          origin_country?: string | null
          origin_latitude?: number | null
          origin_longitude?: number | null
          priority?: string | null
          recommended_forwarder?: string | null
          risk_level?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_delivery_date?: string | null
          created_at?: string | null
          delivery_status?: string | null
          destination_country?: string | null
          destination_latitude?: number | null
          destination_longitude?: number | null
          estimated_delivery_date?: string | null
          freight_carrier?: string | null
          id?: string
          mode_of_shipment?: string | null
          origin_country?: string | null
          origin_latitude?: number | null
          origin_longitude?: number | null
          priority?: string | null
          recommended_forwarder?: string | null
          risk_level?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      weather_data: {
        Row: {
          cloud_cover: number | null
          humidity: number | null
          id: string
          latitude: number
          longitude: number
          precipitation: number | null
          temperature: number | null
          timestamp: string | null
          visibility: number | null
          weather_description: string | null
          weather_main: string | null
          wind_speed: number | null
        }
        Insert: {
          cloud_cover?: number | null
          humidity?: number | null
          id?: string
          latitude: number
          longitude: number
          precipitation?: number | null
          temperature?: number | null
          timestamp?: string | null
          visibility?: number | null
          weather_description?: string | null
          weather_main?: string | null
          wind_speed?: number | null
        }
        Update: {
          cloud_cover?: number | null
          humidity?: number | null
          id?: string
          latitude?: number
          longitude?: number
          precipitation?: number | null
          temperature?: number | null
          timestamp?: string | null
          visibility?: number | null
          weather_description?: string | null
          weather_main?: string | null
          wind_speed?: number | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
