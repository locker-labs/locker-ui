import { useConnectModal } from "@/hooks/useConnectModal";

function ConnectButton() {
	const { openConnectModal, renderConnectModal } = useConnectModal();
	return (
		<>
			<button
				className="h-10 w-32 shrink-0 items-center justify-center rounded-full bg-light-200 text-sm hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300"
				onClick={openConnectModal}
			>
				Connect wallet
			</button>
			{renderConnectModal()}
		</>
	);
}

export default ConnectButton;
