export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  listings: {
    Tables: {
      listings: {
        Row: {
          category: Database["listings"]["Enums"]["category_type"];
          created_at: string | null;
          description: string | null;
          id: number;
          image_url: string | null;
          is_active: boolean | null;
          price: number;
          seller_id: string;
          stock: number;
          title: string;
        };
        Insert: {
          category: Database["listings"]["Enums"]["category_type"];
          created_at?: string | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          price: number;
          seller_id: string;
          stock: number;
          title: string;
        };
        Update: {
          category?: Database["listings"]["Enums"]["category_type"];
          created_at?: string | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          price?: number;
          seller_id?: string;
          stock?: number;
          title?: string;
        };
        Relationships: [];
      };
      listings_caramel: {
        Row: {
          category: Database["listings"]["Enums"]["category_type"];
          created_at: string | null;
          description: string | null;
          id: number;
          image_url: string | null;
          is_active: boolean | null;
          price: number;
          seller_id: string;
          stock: number;
          title: string;
        };
        Insert: {
          category: Database["listings"]["Enums"]["category_type"];
          created_at?: string | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          price: number;
          seller_id: string;
          stock: number;
          title: string;
        };
        Update: {
          category?: Database["listings"]["Enums"]["category_type"];
          created_at?: string | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          price?: number;
          seller_id?: string;
          stock?: number;
          title?: string;
        };
        Relationships: [];
      };
      listings_chocolate: {
        Row: {
          category: Database["listings"]["Enums"]["category_type"];
          created_at: string | null;
          description: string | null;
          id: number;
          image_url: string | null;
          is_active: boolean | null;
          price: number;
          seller_id: string;
          stock: number;
          title: string;
        };
        Insert: {
          category: Database["listings"]["Enums"]["category_type"];
          created_at?: string | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          price: number;
          seller_id: string;
          stock: number;
          title: string;
        };
        Update: {
          category?: Database["listings"]["Enums"]["category_type"];
          created_at?: string | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          price?: number;
          seller_id?: string;
          stock?: number;
          title?: string;
        };
        Relationships: [];
      };
      listings_fruity: {
        Row: {
          category: Database["listings"]["Enums"]["category_type"];
          created_at: string | null;
          description: string | null;
          id: number;
          image_url: string | null;
          is_active: boolean | null;
          price: number;
          seller_id: string;
          stock: number;
          title: string;
        };
        Insert: {
          category: Database["listings"]["Enums"]["category_type"];
          created_at?: string | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          price: number;
          seller_id: string;
          stock: number;
          title: string;
        };
        Update: {
          category?: Database["listings"]["Enums"]["category_type"];
          created_at?: string | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          price?: number;
          seller_id?: string;
          stock?: number;
          title?: string;
        };
        Relationships: [];
      };
      listings_tropical: {
        Row: {
          category: Database["listings"]["Enums"]["category_type"];
          created_at: string | null;
          description: string | null;
          id: number;
          image_url: string | null;
          is_active: boolean | null;
          price: number;
          seller_id: string;
          stock: number;
          title: string;
        };
        Insert: {
          category: Database["listings"]["Enums"]["category_type"];
          created_at?: string | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          price: number;
          seller_id: string;
          stock: number;
          title: string;
        };
        Update: {
          category?: Database["listings"]["Enums"]["category_type"];
          created_at?: string | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          price?: number;
          seller_id?: string;
          stock?: number;
          title?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      category_type: "chocolate" | "fruity" | "tropical" | "caramel";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          balance: number | null;
          first_name: string;
          id: string;
          last_name: string;
        };
        Insert: {
          balance?: number | null;
          first_name: string;
          id: string;
          last_name: string;
        };
        Update: {
          balance?: number | null;
          first_name?: string;
          id?: string;
          last_name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  transactions: {
    Tables: {
      deposits: {
        Row: {
          amount: number;
          created_at: string | null;
          id: number;
          user_id: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          id?: number;
          user_id?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          id?: number;
          user_id?: string | null;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          amount: number;
          buyer_id: string | null;
          created_at: string | null;
          id: number;
          listing_category: Database["listings"]["Enums"]["category_type"];
          listing_id: number;
          seller_id: string | null;
        };
        Insert: {
          amount: number;
          buyer_id?: string | null;
          created_at?: string | null;
          id?: number;
          listing_category: Database["listings"]["Enums"]["category_type"];
          listing_id: number;
          seller_id?: string | null;
        };
        Update: {
          amount?: number;
          buyer_id?: string | null;
          created_at?: string | null;
          id?: number;
          listing_category?: Database["listings"]["Enums"]["category_type"];
          listing_id?: number;
          seller_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      best_selling: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: number;
          title: string;
          seller_id: string;
          category: Database["listings"]["Enums"]["category_type"];
          sales_count: number;
        }[];
      };
      best_selling_seller: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          first_name: string;
          last_name: string;
          sales_count: number;
        }[];
      };
      deposit: {
        Args: { amount: number };
        Returns: number;
      };
      favourite_flavours: {
        Args: Record<PropertyKey, never>;
        Returns: {
          product_name: string;
          product_description: string;
          product_category: Database["listings"]["Enums"]["category_type"];
        }[];
      };
      most_loyal_buyer: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          first_name: string;
          last_name: string;
          sales_count: number;
        }[];
      };
      purchase: {
        Args: {
          listing_id: number;
          listing_category: Database["listings"]["Enums"]["category_type"];
        };
        Returns: undefined;
      };
      recent_activity: {
        Args: Record<PropertyKey, never>;
        Returns: {
          activity_type: string;
          activity_amount: number;
          activity_date: string;
          product_name: string;
        }[];
      };
      recent_transactions: {
        Args: Record<PropertyKey, never>;
        Returns: {
          transaction_type: string;
          transaction_amount: number;
          transaction_date: string;
          product_name: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  listings: {
    Enums: {
      category_type: ["chocolate", "fruity", "tropical", "caramel"],
    },
  },
  public: {
    Enums: {},
  },
  transactions: {
    Enums: {},
  },
} as const;
