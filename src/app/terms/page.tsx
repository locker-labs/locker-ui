import React from "react";

import BasicPage from "@/components/BasicPage";
import { paths, pathStrings } from "@/data/constants/paths";

export default function TermsPage() {
	return (
		<BasicPage>
			<h1 className="mb-6 text-center text-xl font-bold">
				Locker User Agreement
			</h1>
			<p className="mb-4 text-sm font-semibold uppercase">
				Last Updated: Nov 2, 2024
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				1. Control of Funds
			</h2>
			<p className="mb-4">
				You are always in control of your funds with Locker. As the
				owner of your smart account wallet, you are the sole authority
				over your assets. Locker provides tools for automation, but all
				permissions to move funds must be granted by you, and you can
				adjust or revoke permissions at any time.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				2. Permissions and Automated Actions
			</h2>
			<p className="mb-4">
				By using Locker, you may grant permissions for Locker to
				automate certain actions, such as savings transfers to specific
				addresses. These actions are executed solely based on your
				explicit permissions. Locker does not access or control your
				funds beyond the permissions you authorize.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				3. No Investment Advice
			</h2>
			<p className="mb-4">
				Locker does not provide financial, legal, or tax advice. Any
				savings goals or partnership opportunities (e.g., Efrogs savings
				goals) presented on Locker are optional and are not financial
				recommendations. You are solely responsible for any decisions
				regarding your funds, and Locker encourages consulting with a
				financial advisor if you have questions regarding investments.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">4. Eligibility</h2>
			<p className="mb-4">
				You must be at least 18 years old to use Locker. By agreeing to
				this Agreement, you confirm that you meet this age requirement
				and that no applicable law prohibits you from using Locker.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				5. Fees and Third-Party Costs
			</h2>
			<p className="mb-4">
				Locker will charge a small platform fee. However, no platform
				fees will be charged during the beta testing period. If you use
				the offramp functionality, our banking partner, Beam, charges a
				1.5% fee for USDC offramps and a 3.5% fee for ETH offramps.
				Locker does not receive any portion of these fees. For more
				details, please see Beam’s{" "}
				<a
					href="https://www.getbeam.cash/terms"
					className="text-blue-500"
					target="_blank"
					rel="noopener noreferrer"
				>
					terms
				</a>
				.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				6. Termination of Service
			</h2>
			<p className="mb-4">
				Locker reserves the right to suspend or terminate your access to
				the platform at any time if you violate the terms of this
				Agreement or if deemed necessary for platform security or
				integrity. You may also choose to discontinue using Locker at
				any time. Upon termination, all permissions you granted to
				Locker will be revoked, but any actions already completed cannot
				be reversed.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				7. Limitation of Liability
			</h2>
			<p className="mb-4">
				Locker provides its services on an “as-is” and “as-available”
				basis. Locker does not guarantee the value or performance of any
				digital asset and is not responsible for any losses, including
				losses due to market fluctuations or delays in automated
				transactions. You agree to use Locker at your own risk.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				8. Dispute Resolution and Arbitration
			</h2>
			<p className="mb-4">
				In the event of a dispute, please contact us at{" "}
				<a
					href={pathStrings.CONTACT_EMAIL_MAILTO}
					className="text-blue-500"
				>
					{paths.CONTACT_EMAIL}
				</a>
				. If we cannot resolve the dispute informally, you and Locker
				agree to settle all disputes through binding arbitration in the
				state of Louisiana. You waive your right to bring claims as a
				plaintiff or class member in any class action lawsuit.
				Arbitration will be conducted on an individual basis, and you
				agree to waive your right to a jury trial.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				9. Modification of Terms
			</h2>
			<p className="mb-4">
				We may update this Agreement periodically. The updated Agreement
				will be posted on our site, and any changes become effective
				upon posting. By continuing to use Locker after updates are
				made, you agree to the modified terms. If you do not agree, you
				may discontinue your use of Locker.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">10. Contact Us</h2>
			<p className="mb-4">
				If you have questions about this Agreement, please contact us at{" "}
				<a
					href={pathStrings.CONTACT_EMAIL_MAILTO}
					className="text-blue-500"
				>
					{paths.CONTACT_EMAIL}
				</a>
				.
			</p>
		</BasicPage>
	);
}
