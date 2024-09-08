import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

import { Database } from "../../utils/supabase/database.types";

export function createClerkSupabaseClientSsr() {
	// The `useAuth()` hook is used to access the `getToken()` method
	const { getToken } = auth();

	return createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			global: {
				// Get the custom Supabase token from Clerk
				fetch: async (url, options = {}) => {
					const clerkToken = await getToken({
						template: "supabase",
					});

					// Insert the Clerk Supabase token into the headers
					const headers = new Headers(options?.headers);
					headers.set("Authorization", `Bearer ${clerkToken}`);

					// Now call the default fetch
					return fetch(url, {
						...options,
						headers,
					});
				},
			},
		}
	);
}

export const supabaseServerClient = createClerkSupabaseClientSsr();
