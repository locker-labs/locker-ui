// This is a copy of client.ts, but the supabase client function here accepts a token as an argument.
// This is used for linking Clerk with the Realtime Supabase client.
import { createClient } from "@supabase/supabase-js";

import { Database } from "./database.types";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
	throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
	throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

declare global {
	interface Window {
		Clerk: {
			session?: {
				getToken: (options: { template: string }) => Promise<string>;
			};
		};
	}
}

function getSupabaseRealtime(token: string) {
	const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
		global: {
			fetch: async (url, options = {}) => {
				const headers = new Headers(options?.headers);
				headers.set("Authorization", `Bearer ${token}`);

				return fetch(url, {
					...options,
					headers,
				});
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	});

	// client.realtime.accessToken = token;
	return client;
}

// NOTE: The above errors out. This, along with disabling RLS in Supabase, works.
// function getSupabase() {
// 	return createClient<Database>(supabaseUrl, supabaseAnonKey);
// }

export default getSupabaseRealtime;
