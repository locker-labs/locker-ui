import { Disclosure } from "@headlessui/react";
import { IoChevronDownOutline } from "react-icons/io5";

import { supportedChainNames } from "@/data/constants/supportedChains";

function FaqAccordion() {
	return (
		<div className="divide-light-200 border-light-200 shadow-light-600 w-full max-w-2xl divide-y rounded-md border text-sm  shadow-sm">
			<Disclosure as="div" className="p-5">
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full items-center justify-between">
							<span className="text-left font-medium">
								What is Locker?
							</span>
							<IoChevronDownOutline
								size={20}
								className={`${open && "rotate-180"} text-light-600 ml-2 shrink-0`}
							/>
						</Disclosure.Button>
						<Disclosure.Panel className="mt-3 flex flex-col space-y-3">
							<span>
								Locker is a company that provides secure savings
								and investment functionality for your crypto.
							</span>
							<span>
								When you sign up for Locker, we&apos;ll create
								you a smart account called a &quot;locker&quot;.
								You are the sole owner of the account and grant
								Locker limited permissions to transfer funds on
								your behalf.
							</span>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
			<Disclosure as="div" className="p-5">
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full items-center justify-between">
							<span className="text-left font-medium">
								What can I do with Locker?
							</span>
							<IoChevronDownOutline
								size={20}
								className={`${open && "rotate-180"} text-light-600 ml-2 shrink-0`}
							/>
						</Disclosure.Button>
						<Disclosure.Panel className="mt-3 flex flex-col space-y-3">
							<span>
								Locker allows users who get paid in crypto to
								automatically save and invest a portion of their
								earnings, every time they get paid.
							</span>
							<span>
								After initial setup, payments received at a
								user&apos;s locker will get automatically
								distributed based on the chosen allocation
								settings.
							</span>
							<span>
								You can also set a savings goal and work towards
								your next big purchase, regardless of if
								that&apos;s a new car or NFT.
							</span>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
			<Disclosure as="div" className="p-5">
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full items-center justify-between">
							<span className="text-left font-medium">
								Does it cost money to use Locker?
							</span>
							<IoChevronDownOutline
								size={20}
								className={`${open && "rotate-180"} text-light-600 ml-2 shrink-0`}
							/>
						</Disclosure.Button>
						<Disclosure.Panel className="mt-3 flex flex-col space-y-3">
							<span>
								Yes. Locker charges a small percentage fee each
								time a payment is received in a user&apos;s
								locker. More details coming soon.
							</span>
							<span>
								No platform fees will be charged during beta
								testing. If you use the offramp functionality, a
								1.5% / 3.5% fee is charged by our banking
								partner for each USDC / ETH offramp.
							</span>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
			<Disclosure as="div" className="p-5">
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full items-center justify-between">
							<span className="text-left font-medium">
								Are lockers self-custodial?
							</span>
							<IoChevronDownOutline
								size={20}
								className={`${open && "rotate-180"} text-light-600 ml-2 shrink-0`}
							/>
						</Disclosure.Button>
						<Disclosure.Panel className="mt-3 flex flex-col space-y-3">
							<span>
								Yes. Lockers are smart contract accounts that
								each user owns entirely.
							</span>
							<span>
								When creating a locker, users must connect an
								externally owned account (EOA) that can be the
								owner of their locker.
							</span>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
			<Disclosure as="div" className="p-5">
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full items-center justify-between">
							<span className="text-left font-medium">
								What chains are currently supported?
							</span>
							<IoChevronDownOutline
								size={20}
								className={`${open && "rotate-180"} text-light-600 ml-2 shrink-0`}
							/>
						</Disclosure.Button>
						<Disclosure.Panel className="mt-3 flex flex-col space-y-3">
							<span>
								Currently, we support {supportedChainNames()}.
							</span>
							<span>Support for more chains is coming soon.</span>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
			<Disclosure as="div" className="p-5">
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full items-center justify-between">
							<span className="text-left font-medium">
								How does Locker securely move users&apos; funds?
							</span>
							<IoChevronDownOutline
								size={20}
								className={`${open && "rotate-180"} text-light-600 ml-2 shrink-0`}
							/>
						</Disclosure.Button>
						<Disclosure.Panel className="mt-3 flex flex-col space-y-3 text-sm">
							<span>
								Currently, the secure movement of users&apos;
								funds is possible thanks to{" "}
								<a
									className="hover:text-secondary-100 underline underline-offset-2"
									href="https://docs-v4.zerodev.app/blog/session-keys-are-the-jwts-of-web3"
									target="_blank"
									rel="noopener noreferrer"
								>
									ZeroDev&apos;s session keys
								</a>
								, which allow users to give Locker (the company)
								very granular permissions to perform specific
								actions on their behalf.
							</span>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
		</div>
	);
}

export default FaqAccordion;
