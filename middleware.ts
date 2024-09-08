// See https://clerk.com/docs/references/nextjs/clerk-middleware
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { paths } from "./data/constants/paths";

const isProtectedRoute = createRouteMatcher([
	`${paths.HOME}(.*)`,
	`${paths.ACCOUNT}(.*)`,
	`${paths.TX}(.*)`,
	`${paths.TEST}(.*)`,
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
