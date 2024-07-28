export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			deployments: {
				Row: {
					chain_id: number;
					created_at: string;
					deployment_tx_hash: string | null;
					id: number;
					locker_id: number | null;
					updated_at: string;
				};
				Insert: {
					chain_id: number;
					created_at?: string;
					deployment_tx_hash?: string | null;
					id?: number;
					locker_id?: number | null;
					updated_at?: string;
				};
				Update: {
					chain_id?: number;
					created_at?: string;
					deployment_tx_hash?: string | null;
					id?: number;
					locker_id?: number | null;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "deployments_locker_id_lockers_id_fk";
						columns: ["locker_id"];
						isOneToOne: false;
						referencedRelation: "lockers";
						referencedColumns: ["id"];
					},
				];
			};
			lockers: {
				Row: {
					address: string;
					created_at: string;
					id: number;
					owner_address: string;
					provider: string;
					seed: number;
					updated_at: string;
					usd_value: number | null;
					user_id: string;
				};
				Insert: {
					address: string;
					created_at?: string;
					id?: number;
					owner_address: string;
					provider: string;
					seed: number;
					updated_at?: string;
					usd_value?: number | null;
					user_id: string;
				};
				Update: {
					address?: string;
					created_at?: string;
					id?: number;
					owner_address?: string;
					provider?: string;
					seed?: number;
					updated_at?: string;
					usd_value?: number | null;
					user_id?: string;
				};
				Relationships: [];
			};
			policies: {
				Row: {
					automations: Json;
					chain_id: number;
					created_at: string;
					encoded_iv: string;
					encrypted_session_key: string;
					id: number;
					locker_id: number | null;
					session_key_is_valid: boolean;
					updated_at: string;
				};
				Insert: {
					automations: Json;
					chain_id: number;
					created_at?: string;
					encoded_iv: string;
					encrypted_session_key: string;
					id?: number;
					locker_id?: number | null;
					session_key_is_valid?: boolean;
					updated_at?: string;
				};
				Update: {
					automations?: Json;
					chain_id?: number;
					created_at?: string;
					encoded_iv?: string;
					encrypted_session_key?: string;
					id?: number;
					locker_id?: number | null;
					session_key_is_valid?: boolean;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "policies_locker_id_lockers_id_fk";
						columns: ["locker_id"];
						isOneToOne: false;
						referencedRelation: "lockers";
						referencedColumns: ["id"];
					},
				];
			};
			token_transactions: {
				Row: {
					amount: string | null;
					automations_state: string;
					chain_id: number;
					contract_address: string;
					created_at: string;
					from_address: string;
					id: number;
					is_confirmed: boolean | null;
					locker_direction: string;
					locker_id: number | null;
					to_address: string;
					token_decimals: number | null;
					token_symbol: string;
					triggered_by_token_tx_id: number | null;
					tx_hash: string;
					updated_at: string;
					usd_value: number | null;
				};
				Insert: {
					amount?: string | null;
					automations_state?: string;
					chain_id: number;
					contract_address: string;
					created_at?: string;
					from_address: string;
					id?: number;
					is_confirmed?: boolean | null;
					locker_direction: string;
					locker_id?: number | null;
					to_address: string;
					token_decimals?: number | null;
					token_symbol: string;
					triggered_by_token_tx_id?: number | null;
					tx_hash: string;
					updated_at?: string;
					usd_value?: number | null;
				};
				Update: {
					amount?: string | null;
					automations_state?: string;
					chain_id?: number;
					contract_address?: string;
					created_at?: string;
					from_address?: string;
					id?: number;
					is_confirmed?: boolean | null;
					locker_direction?: string;
					locker_id?: number | null;
					to_address?: string;
					token_decimals?: number | null;
					token_symbol?: string;
					triggered_by_token_tx_id?: number | null;
					tx_hash?: string;
					updated_at?: string;
					usd_value?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "token_transactions_locker_id_lockers_id_fk";
						columns: ["locker_id"];
						isOneToOne: false;
						referencedRelation: "lockers";
						referencedColumns: ["id"];
					},
				];
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
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
				Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
				PublicSchema["Views"])
		? (PublicSchema["Tables"] &
				PublicSchema["Views"])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

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
		: never;
