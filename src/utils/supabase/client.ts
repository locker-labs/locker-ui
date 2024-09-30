// Copied from https://github.com/Ali-Onar/nextjs-supabase-todo-app/blob/main/utils/supabase/supabaseClient.ts
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

function getSupabase() {
	return createClient<Database>(supabaseUrl, supabaseAnonKey, {
		global: {
			fetch: async (url, options = {}) => {
				const clerkToken = await window.Clerk.session?.getToken({
					template: "supabase",
				});

				const headers = new Headers(options?.headers);
				headers.set("Authorization", `Bearer ${clerkToken}`);

				return fetch(url, {
					...options,
					headers,
				});
			},
		},
	});
}

// NOTE: The above errors out. This, along with disabling RLS in Supabase, works.
// function getSupabase() {
// 	return createClient<Database>(supabaseUrl, supabaseAnonKey);
// }

const supabaseClient = getSupabase();

export default supabaseClient;
