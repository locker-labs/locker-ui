import React from "react";

export default function PrivacyPage() {
	return (
		<div className="container mx-auto px-4 py-8 text-black">
			<h1 className="mb-6 text-xl font-bold">Privacy Policy</h1>
			<p className="mb-4">Last Updated: Oct 20, 2024</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				1. Information We Collect
			</h2>
			<p className="mb-4">
				We collect information when you use our Services, including:
			</p>
			<ul className="mb-4 list-inside list-disc">
				<li>
					<strong>Wallet Address and Email:</strong> We collect your
					wallet address and email when you create a Locker account.
					We do not track any additional details related to your
					wallet address or email.
				</li>
				<li>
					<strong>Transaction Monitoring:</strong> We track
					transactions in and out of your locker to facilitate and
					improve our Services.
				</li>
			</ul>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				2. How We Use Your Information
			</h2>
			<p className="mb-4">
				We process your information for the following purposes:
			</p>
			<ul className="mb-4 list-inside list-disc">
				<li>
					<strong>Provide and Maintain the Services:</strong> We use
					your wallet address and transaction information to operate
					and improve the Services.
				</li>
				<li>
					<strong>Customer Support:</strong> To assist with support
					requests, we may use the information you provide.
				</li>
				<li>
					<strong>Security and Fraud Prevention:</strong> We may
					process your information to detect and prevent fraud or
					other illegal activities.
				</li>
			</ul>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				3. Data Sharing and Disclosure
			</h2>
			<p className="mb-4">
				We do not sell your information or share it with third parties,
				except as described below:
			</p>
			<ul className="mb-4 list-inside list-disc">
				<li>
					<strong>Blockchain Transactions:</strong> Your transaction
					data is recorded on public blockchains, such as Ethereum,
					and is publicly accessible.
				</li>
				<li>
					<strong>Service Providers:</strong> We use Clerk for user
					management and other service providers for app
					functionality. We also work with Beam to provide off-ramp
					services, allowing you to convert digital assets to fiat
					currency. Beam&apos;s handling of your information is
					governed by their privacy policy, which can be found{" "}
					<a
						href="https://www.getbeam.cash/privacypolicy"
						className="text-blue-500"
						target="_blank"
						rel="noopener noreferrer"
					>
						here
					</a>
					.
				</li>
				<li>
					<strong>Legal Obligations:</strong> We may disclose your
					information if required by law, court order, or other legal
					process.
				</li>
			</ul>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				4. Data Retention
			</h2>
			<p className="mb-4">
				We currently retain your information indefinitely. In the
				future, we plan to delete or anonymize old data as part of our
				ongoing efforts to protect your privacy.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				5. Account Deletion
			</h2>
			<p className="mb-4">
				You can delete your Locker account directly through the app.
				This will remove your account information and associated wallet
				address. However, past transactions recorded on the blockchain
				cannot be removed as blockchain data is permanent.
			</p>
			<p className="mb-4">
				To request the deletion of transaction history logs, email us at{" "}
				<a href="mailto:privacy@geeky.rocks" className="text-blue-500">
					privacy@geeky.rocks
				</a>
				.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				6. Your Privacy Rights
			</h2>
			<p className="mb-4">
				Depending on your location, you may have certain rights
				regarding your personal information under applicable privacy
				laws, such as the right to access, correct, or delete your data.
				To exercise these rights, contact us at{" "}
				<a href="mailto:privacy@geeky.rocks" className="text-blue-500">
					privacy@geeky.rocks
				</a>
				.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">
				7. Updates to This Policy
			</h2>
			<p className="mb-4">
				We may update this privacy policy from time to time. The updated
				version will be indicated by a &ldquo;Last Updated&rdquo; date
				at the top of this page. We encourage you to review this policy
				periodically to stay informed about how we protect your
				information.
			</p>

			<h2 className="mb-4 mt-6 text-lg font-semibold">8. Contact Us</h2>
			<p className="mb-4">
				If you have any questions about this privacy policy, please
				contact us at{" "}
				<a href="mailto:privacy@geeky.rocks" className="text-blue-500">
					privacy@geeky.rocks
				</a>
				.
			</p>
		</div>
	);
}
