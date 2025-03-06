import React from "react";

import BasicPage from "@/components/BasicPage";
import { paths, pathStrings } from "@/data/constants/paths";

export default function EfrogsPage() {
	return (
		<BasicPage>
			<h1 className="mb-6 text-center text-xl font-bold">
				Locker “Efrogr Daily” Sweepstakes Official Rules
			</h1>
			<p className="mb-4 text-sm font-semibold uppercase">
				No purchase necessary. A purchase or payment will not increase
				your chances of winning.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				1. Sponsor & Administrator:
			</h2>
			<ul className="mb-4 list-inside list-disc">
				<li className="mb-2">
					<strong>Sponsor/Administrator:</strong> Locker
				</li>
				<li className="mb-2">
					<strong>Contact Information:</strong>{" "}
					<a
						href={pathStrings.CONTACT_EMAIL_MAILTO}
						className="text-blue-500"
					>
						{paths.CONTACT_EMAIL}
					</a>
				</li>
				<li>
					<strong>Address:</strong> 400 Poydras St, Suite 900, New
					Orleans, LA
				</li>
			</ul>

			<h2 className="mb-4 mt-6 text-lg font-semibold">2. Eligibility</h2>
			<p className="mb-4">
				The Locker “Efrogr Daily” Sweepstakes (the “Sweepstakes”) is
				open to individuals who have reached the age of majority in
				their jurisdiction of residence at the time of entry and who
				comply with these Official Rules. Employees, officers,
				directors, members, managers, agents, and representatives of
				Locker, its parent, subsidiaries, or affiliates, and their
				immediate family members (defined as spouse, parent, child,
				sibling, and their respective spouses) are not eligible to enter
				or win.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				3. Sweepstakes Period
			</h2>
			<p className="mb-4">
				<ul>
					<li>
						<strong>Start Date</strong>: December 1, 2024, at 12:00
						AM Central Time (“CT”).
					</li>
					<li>
						<strong>End Date</strong>: This Sweepstakes is ongoing
						and will continue until terminated by Sponsor
						(“Indefinite End Date”). Daily drawings will be
						conducted as described below in Section 7.
					</li>
				</ul>
				Sponsor reserves the right to modify or end the Sweepstakes at
				any time for any reason.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">4. How to Enter</h2>
			<p className="mb-4">
				There are two (2) methods of entry into the Sweepstakes:
			</p>
			<ol className="mb-4 list-inside list-decimal">
				<li>
					<strong>Entry by Playing the Efrogr Game</strong>
					<ul className="mb-4 mt-4 list-inside list-disc pl-6">
						<li>
							Visit{" "}
							<a
								href={paths.EFROGS_LOCKER}
								className="text-blue-500"
							>
								{pathStrings.EFROGS_LOCKER}
							</a>{" "}
							or the Efrogr Telegram Bot at{" "}
							<a
								href={paths.EFROGS_TELEGRAM}
								className="text-blue-500"
							>
								{paths.EFROGS_TELEGRAM}
							</a>
							.
						</li>
						<li>
							Each game entry requires <strong>333 CROAK</strong>{" "}
							tokens (“Player Fee”). Playing one (1) game equals
							one (1) entry into the Sweepstakes for the relevant
							drawing period (see Section 7).
						</li>
						<li>
							Sponsor will allocate{" "}
							<strong>50% of all Player Fees</strong> to the daily
							prize pool for this Sweepstakes.
						</li>
						<li>
							<strong>Winnings Distribution:</strong> If you are
							selected as a winner and entered by paying with
							CROAK, your prize will be automatically distributed
							to the <strong>same address</strong> that was used
							to pay for your entry.
						</li>
					</ul>
				</li>
				<li>
					<strong>Free Entry by Mail</strong>
					<ul className="mt-4 list-inside list-disc pl-6">
						<li>
							To enter without payment or gameplay, mail a letter
							that includes:
							<ul className="list-inside list-disc pl-6">
								<li>Your full name</li>
								<li>Your complete return mailing address</li>
								<li>A valid email address (if available)</li>
								<li>
									<strong>
										A payment address (e.g., a compatible
										CROAK wallet address)
									</strong>{" "}
									to receive any potential winnings
								</li>
								<li>
									A statement that you wish to enter the
									“Locker Efrogr Daily Sweepstakes”
								</li>
							</ul>
						</li>
						<li>
							Mail your letter in a postage-paid envelope to:
							<p className="pl-6">
								<strong>
									Locker – Efrogr Daily Sweepstakes
								</strong>
							</p>
							<p className="pl-6">400 Poydras St, Suite 900,</p>
							<p className="pl-6">New Orleans, LA</p>
						</li>
						<li>
							<strong>Important</strong>: If a potential winner
							from the free mail-in entry method did{" "}
							<strong>not</strong> include a valid payment address
							in their entry letter, they will forfeit the right
							to claim any winnings.
						</li>
						<li className="mb-4">
							Each mail-in entry will be valid for the daily
							drawing in which it is received and subsequent daily
							drawings for as long as the Sweepstakes continues
							(or until Sponsor, in its discretion, limits
							eligibility based on any duplication or tampering
							concerns).
						</li>
					</ul>
				</li>
			</ol>
			<p className="mb-4">
				<strong>Limit:</strong> One (1) entry per person per day,
				regardless of the method of entry. Multiple entries in a single
				day via the same or multiple methods (beyond the one entry) may
				be disqualified.
			</p>
			<p className="mb-4">
				<strong>Important:</strong>{" "}
				<strong>No Purchase Necessary</strong>. A payment of CROAK for
				gameplay is considered a paid entry, but it does{" "}
				<strong>not</strong> increase your odds of winning over a free
				mail-in entry. Each method of entry receives one entry into the
				daily draw.
			</p>
			<h2 className="mb-4 mt-6 text-lg font-semibold">
				5. Prize(s), Prize Pool, and Odds of Winning
			</h2>
			<ul className="mb-4 list-inside list-disc">
				{" "}
				<li>
					<strong>Daily Prize Pool</strong>: 50% of the total Player
					Fees collected from entries on the preceding day (12:00 AM
					CT to 11:59 PM CT) will be allocated to the prize pool for
					the daily drawing. Sponsor reserves the right to use an
					alternate or supplemental prize structure if necessary.
				</li>
				<li>
					<strong>Number of Daily Winners</strong>: One (1) daily
					winner (unless otherwise stated by Sponsor).
				</li>
				<li>
					<strong>Odds of Winning</strong>: Depend on the total number
					of eligible entries received for that day&apos;s drawing.
				</li>
			</ul>
			<p className="mb-4">
				Prizes will be awarded in CROAK tokens or another form specified
				by Sponsor, consistent with the daily prize pool.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				6. Winner Selection and Notification
			</h2>
			<ul className="mb-4 list-inside list-disc">
				<li>
					<strong>Daily Drawings</strong>: One (1) daily winner will
					be selected in a random drawing from among all eligible
					entries received for that day.
				</li>
				<li>
					<strong>Notification</strong>: Winners will be announced in
					the official Telegram group at{" "}
					<a href={paths.CROAK_TELEGRAM} className="text-blue-500">
						{pathStrings.CROAK_TELEGRAM}
					</a>
					. In addition, potential winners may be notified by email or
					other contact information on file if available.
				</li>
				<li>
					<strong>Claiming Prize</strong>:
				</li>
				<ul className="mb-4 list-inside list-disc pl-6">
					<li>
						If you entered via the Efrogr game (paid entry), your
						winnings will be automatically distributed to the{" "}
						<strong>address used for your CROAK payment</strong>.
					</li>
					<li>
						If you entered via mail-in, you must have{" "}
						<strong>included a payment address</strong> in your
						entry letter. If no payment address was provided, the
						prize will be forfeited.
					</li>
					<li>
						If a potential winner does not respond to any direct
						communication (if requested) within five (5) business
						days, or if the notification is undeliverable, Sponsor
						may disqualify that winner and select an alternate.
					</li>
				</ul>
			</ul>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				7. No Substitution; Taxes
			</h2>
			<p className="mb-4">
				No substitution or transfer of the prize is permitted except at
				Sponsor’s sole discretion. All taxes, fees, and surcharges on
				prizes (if any) are the sole responsibility of the winner.
				Sponsor will comply with all tax reporting obligations.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				8. Privacy & Publicity
			</h2>
			<p className="mb-4">
				By entering, participants agree to Sponsor’s use of the
				information supplied for Sweepstakes administration purposes.
				Except where prohibited by law, acceptance of a prize
				constitutes consent to the Sponsor’s use of winner’s name,
				likeness, photograph, voice, opinions, and/or hometown and state
				for promotional purposes in any media without further payment or
				consideration.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				9. General Conditions
			</h2>
			<p className="mb-4">
				By participating, entrants agree to abide by these Official
				Rules and the decisions of Sponsor, which are final and binding
				in all matters relating to this Sweepstakes. Sponsor reserves
				the right to disqualify any entry that it determines, in its
				sole discretion, to be in violation of these Official Rules or
				if the entrant is found tampering with the entry process or the
				operation of the Sweepstakes.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				10. Limitation of Liability
			</h2>
			<p className="mb-4">Sponsor is not responsible for:</p>
			<ul className="mb-4 list-inside list-disc pl-6">
				<li>
					Any technical problems, delays, or malfunctions that may
					impede entry or notifications;
				</li>
				<li>
					Lost, late, misdirected, incomplete, or unintelligible
					entries;
				</li>
				<li>
					Any damage or loss suffered by entrants or any other party.
				</li>
			</ul>
			<p className="mb-4">
				By participating, you agree to release and hold harmless
				Sponsor, its affiliates, and their respective officers,
				directors, employees, and agents from and against any claim or
				cause of action arising out of participation in the Sweepstakes
				or receipt/use of any prize.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">11. Disputes</h2>
			<p className="mb-4">
				All issues concerning the construction, validity,
				interpretation, and enforceability of these Official Rules shall
				be governed by and construed in accordance with the laws of the
				State of Louisiana, without giving effect to any choice of law
				or conflict of law rules. Any disputes shall be resolved
				individually, without resort to any form of class action, and
				exclusively in the federal or state courts located in Louisiana.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				12. Winners’ List
			</h2>
			<p className="mb-4">
				For a list of daily winners, send a request to{" "}
				<a
					href={pathStrings.CONTACT_EMAIL_MAILTO}
					className="text-blue-500"
				>
					{paths.CONTACT_EMAIL}
				</a>{" "}
				with “Efrogr Daily Sweepstakes Winners’ List” in the subject
				line. Requests must be received within thirty (30) days after
				the end date of the applicable daily drawing.
			</p>

			<p className="mb-4">
				<strong>Sponsor/Administrator</strong>: Locker, 400 Poydras St,
				Suite 900, New Orleans, LA
			</p>
			<p className="mb-4">
				<strong>Effective Date</strong>: December 1, 2024
			</p>
			<p className="mb-4 text-sm font-semibold uppercase">
				These Official Rules constitute the entire agreement between the
				Sponsor and participants with respect to this Sweepstakes.
			</p>
		</BasicPage>
	);
}
