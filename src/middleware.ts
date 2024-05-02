// See https://clerk.com/docs/references/nextjs/clerk-middleware
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { PATHS } from "@/data/paths";

const isProtectedRoute = createRouteMatcher([
	`${PATHS.HOME}(.*)`,
	`${PATHS.PROFILE}(.*)`,
]);

export default clerkMiddleware(
	(auth, req) => {
		if (isProtectedRoute(req)) auth().protect();
	},
	{ debug: true }
);

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
