import { useConnectModal } from "@rainbow-me/rainbowkit";

export interface IConnectButton {
	label: string;
	height: string;
	width: string;
	color: "subtle" | "bold";
}

function ConnectButton({ label, height, width, color }: IConnectButton) {
	const { openConnectModal } = useConnectModal();

	return (
		<button
			className={`${color === "subtle" ? "bg-light-200 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300" : "bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"} ${height} ${width} items-center justify-center rounded-full outline-none`}
			onClick={() => {
				if (openConnectModal) {
					openConnectModal();
				}
			}}
		>
			{label}
		</button>
	);
}

export default ConnectButton;
