// https://github.com/supabase/supabase-js/issues/553#issuecomment-1924720347
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClientPool: Record<string, SupabaseClient> = {};

const purgePoolOnBrowser = () => {
	if (typeof window !== "undefined") {
		supabaseClientPool = {};
	}
};

export const supabaseJwtClient = (accessToken: string) => {
	if (supabaseClientPool[accessToken]) {
		return supabaseClientPool[accessToken];
	}
	purgePoolOnBrowser();
	const client = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			global: { headers: { Authorization: `Bearer ${accessToken}` } },
		}
	);
	client.realtime.setAuth(accessToken);
	supabaseClientPool[accessToken] = client;
	return client;
};
