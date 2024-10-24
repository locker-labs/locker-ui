// https://github.com/supabase/supabase-js/issues/553#issuecomment-1924720347
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClientPool: Record<string, SupabaseClient> = {};

const purgePoolOnBrowser = () => {
	if (typeof window !== "undefined") {
		supabaseClientPool = {};
	}
};

// Function to create or retrieve a Supabase client for a given JWT token
export const supabaseJwtClient = (accessToken: string) => {
	// Ensure the access token is defined
	if (!accessToken) {
		throw new Error(
			"Access token is required to create a Supabase client."
		);
	}

	// Return the existing client from the pool if available
	if (supabaseClientPool[accessToken]) {
		return supabaseClientPool[accessToken];
	}

	// Clear the client pool if running in the browser
	purgePoolOnBrowser();

	// Ensure the environment variables are defined
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error(
			"Supabase URL and ANON KEY must be defined in the environment variables."
		);
	}

	// Create a new Supabase client
	const client = createClient(supabaseUrl, supabaseAnonKey, {
		global: { headers: { Authorization: `Bearer ${accessToken}` } },
	});

	// Set the authentication token for real-time subscriptions
	client.realtime.setAuth(accessToken);

	// Store the client in the pool
	supabaseClientPool[accessToken] = client;

	return client;
};
