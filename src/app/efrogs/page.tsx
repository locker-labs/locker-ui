import React from "react";

import BasicPage from "@/components/BasicPage";

export default function EfrogsPage() {
	return (
		<BasicPage>
			<h1 className="mb-6 text-center text-xl font-bold">
				Locker Sweepstakes Official Rules
			</h1>
			<p className="mb-4 text-sm font-semibold uppercase">
				No purchase necessary. A purchase or payment will not increase
				your chances of winning.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				Promotion Sponsor:
			</h2>
			<p className="mb-4">Locker</p>
			<p className="mb-4">
				<strong>Contact Information:</strong>{" "}
				<a href="mailto:locker@geeky.rocks" className="text-blue-500">
					locker@geeky.rocks
				</a>
			</p>
			<p className="mb-4">
				<strong>Address:</strong> 400 Poydras St, Suite 900, New
				Orleans, LA
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">1. Eligibility</h2>
			<p className="mb-4">
				The Locker Sweepstakes (the “Sweepstakes”) is open to
				individuals who meet the age requirements and comply with these
				rules. Employees, contractors, and affiliates of Locker, as well
				as immediate family members, are not eligible to enter.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">2. Entry Period</h2>
			<p className="mb-4">
				The Sweepstakes begins on November 1, 2024, at 12:00 AM (CT) and
				ends on January 1, 2025, at 11:59 PM (CT). Locker reserves the
				right to end the Sweepstakes early and conduct the winner
				selection if there has been sufficient participation.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">3. How to Enter</h2>
			<p className="mb-4">You can enter the Sweepstakes in two ways:</p>
			<ul className="mb-4 list-inside list-disc">
				<li>
					<strong>Automatic Entry by Participation:</strong> Save with
					Locker toward your Efrogs NFT goal and complete an
					Efrogs-related purchase through Locker during the
					Sweepstakes period.
				</li>
				<li>
					<strong>Free Entry by Mail:</strong> To enter without
					purchase, mail a handwritten postcard with your name, Locker
					address, and a statement expressing your intent to enter the
					Sweepstakes to: Locker, 400 Poydras St, Suite 900, New
					Orleans, LA. Mail-in entries must be received by January 7,
					2025, or by the earlier drawing date if participation goals
					have been met.
				</li>
			</ul>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				4. Prize and Odds of Winning
			</h2>
			<p className="mb-4">
				One (1) Efrog NFT will be awarded to an eligible participant
				selected at random from all valid entries. Odds of winning
				depend on the number of eligible entries received.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				5. Winner Selection and Notification
			</h2>
			<p className="mb-4">
				The winner will be selected in a random drawing conducted on or
				about January 10, 2025, or earlier if participation goals are
				met. The winner will be notified via the email associated with
				their Locker account within 48 hours of selection. If the winner
				does not respond within 5 business days, an alternate winner may
				be chosen.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				6. Privacy and Use of Information
			</h2>
			<p className="mb-4">
				By entering, participants agree to Locker’s handling of their
				information as described in the primary{" "}
				<a href="/privacy" className="text-blue-500">
					Privacy Policy
				</a>
				. No additional personal information is collected for the
				Sweepstakes beyond what is provided in your Locker account or
				required for free mail-in entry.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				7. General Conditions
			</h2>
			<p className="mb-4">
				By participating, you agree to these Official Rules and the
				decisions of Locker, which are final. Locker reserves the right
				to disqualify any entrant who tampers with the entry process or
				violates these rules. The prize is non-transferable, and no
				substitution is allowed except at Locker’s sole discretion.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				8. Limitation of Liability
			</h2>
			<p className="mb-4">
				Locker is not responsible for any technical errors, lost
				entries, or other issues outside its control that may affect
				participation or outcome. By entering, you release Locker and
				its affiliates from any claims arising from participation or
				prize acceptance.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">9. Disputes</h2>
			<p className="mb-4">
				This Sweepstakes is governed by the laws of the State of
				Louisiana. Any disputes will be resolved individually and
				exclusively by the appropriate courts located within Louisiana.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				10. Winner’s List
			</h2>
			<p className="mb-4">
				To obtain a copy of the winner&apos;s name, please send a
				request to{" "}
				<a href="mailto:locker@geeky.rocks" className="text-blue-500">
					locker@geeky.rocks
				</a>{" "}
				by January 31, 2025, or within 30 days of an earlier drawing
				date if applicable.
			</p>
		</BasicPage>
	);
}
