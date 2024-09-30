// https://github.com/supabase/supabase-js/issues/553#issuecomment-1924720347
import { useAuth } from "@clerk/nextjs";
import jwtDecode from "jsonwebtoken";
import { useCallback } from "react";

export const useJwt = () => {
	const { getToken } = useAuth();

	const getJwt = useCallback(async (): Promise<string> => {
		const jwt = await getToken({ template: "supabase" });
		if (!jwt) throw new Error("No JWT found");
		return jwt;
	}, [getToken]);

	const getJwtExpiration = useCallback(async (): Promise<number | null> => {
		try {
			const jwt = await getJwt();
			const decoded = jwtDecode.decode(jwt) as { exp: number } | null;
			return decoded?.exp || null;
		} catch (error) {
			console.error("Failed to decode JWT", error);
			return null;
		}
	}, [getJwt]);

	return { getJwt, getJwtExpiration };
};
