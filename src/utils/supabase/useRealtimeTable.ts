// https://github.com/supabase/supabase-js/issues/553#issuecomment-1924720347

import {
	REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
	REALTIME_SUBSCRIBE_STATES,
	RealtimeChannel,
} from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

import { convertKeysToCamelCase } from "../strings";
import { supabaseJwtClient } from "./jwt";
import { useJwt } from "./useJwt";

export const useRealtimeTable = <T extends { id: number }>(
	tableName: string,
	initialRecords: T[]
) => {
	const { getJwt, getJwtExpiration } = useJwt();
	const [records, setRecords] = useState<T[]>(initialRecords);

	// const fetchRecords = useCallback(async () => {
	// 	const supabase = supabaseJwtClient(await getJwt());
	// 	const { data, error } = await supabase.from(tableName).select("*");

	// 	if (error) {
	// 		console.log(`Error fetching ${tableName}:`, error);
	// 	} else {
	// 		setRecords(data || []);
	// 	}
	// }, [tableName, getJwt]);

	const subscribeToTable = useCallback(async () => {
		const supabase = supabaseJwtClient(await getJwt());
		let lastChannelState: REALTIME_SUBSCRIBE_STATES | null = null;
		let channel: RealtimeChannel | null = null;

		const cleanup = () => {
			if (channel) supabase.removeChannel(channel);
		};

		const refreshToken = async () => {
			const token = await getJwt();
			supabase.realtime.setAuth(token);
		};

		const subscribe = () => {
			channel = supabase
				.channel(`${tableName}-changes`)
				.on(
					"postgres_changes",
					{
						event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL,
						schema: "public",
						table: tableName,
					},
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(rawPayload: any) => {
						console.log("got event", rawPayload);
						const payload = convertKeysToCamelCase(rawPayload);
						console.log("adaptedPayload", payload);

						if (
							payload.eventType ===
							REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE
						) {
							setRecords((prevRecords) =>
								prevRecords.map((record) =>
									record.id === payload.new.id
										? payload.new
										: record
								)
							);
						}
						if (
							payload.eventType ===
							REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT
						) {
							setRecords((prevRecords) => [
								payload.new,
								...prevRecords,
							]);
						}
						if (
							payload.eventType ===
							REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE
						) {
							setRecords((prevRecords) =>
								prevRecords.filter(
									(record) => record.id !== payload.old.id
								)
							);
						}
					}
				)
				.subscribe(async (status, error) => {
					console.log(`[${tableName}]: `, status);
					if (
						status === REALTIME_SUBSCRIBE_STATES.CLOSED &&
						lastChannelState ===
							REALTIME_SUBSCRIBE_STATES.SUBSCRIBED
					) {
						console.log(
							"Channel closed (e.g. JWT expiration), resubscribing..."
						);
						await refreshToken();
						cleanup();
						subscribe();
					}
					if (error) {
						console.error(
							`[${tableName}] Real-time channel error:`,
							error
						);
					}
					lastChannelState = status as REALTIME_SUBSCRIBE_STATES;
				});
		};

		const automaticallyRefreshJwt = async () => {
			const expiration = await getJwtExpiration();
			if (expiration) {
				const currentTime = Math.floor(Date.now() / 1000);
				// Refresh 5 seconds before expiration
				const timeUntilExpiration = expiration - currentTime - 5;
				if (timeUntilExpiration > 0) {
					setTimeout(async () => {
						await refreshToken();
						automaticallyRefreshJwt(); // Set up the next refresh
					}, timeUntilExpiration * 1000);
				}
			}
		};

		window.addEventListener("beforeunload", cleanup);
		subscribe();
		await automaticallyRefreshJwt();

		// Clean up on unmount
		return () => {
			window.removeEventListener("beforeunload", cleanup);
			cleanup();
		};
	}, [tableName, getJwt, getJwtExpiration]);

	// useEffect(() => {
	// 	fetchRecords();
	// 	subscribeToTable();
	// }, [tableName, fetchRecords, subscribeToTable]);

	useEffect(() => {
		subscribeToTable();
	}, [tableName, subscribeToTable]);

	return { records };
};
