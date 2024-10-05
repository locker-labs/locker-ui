import { useConnectModal } from "@/hooks/useConnectModal";

function ConnectButton() {
	const { openConnectModal, renderConnectModal } = useConnectModal();
	return (
		<>
			<button
				className="bg-light-200 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300 h-10 w-32 shrink-0 items-center justify-center rounded-full text-sm"
				onClick={openConnectModal}
			>
				Connect wallet
			</button>
			{renderConnectModal()}
		</>
	);
}

export default ConnectButton;
