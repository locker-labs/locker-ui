/* eslint-disable react/require-default-props */
import { supportedChainIds } from "@/data/constants/supportedChains";

export interface IChainIcon {
	chainId: number;
	size?: string | number;
	className?: string;
	style?: React.CSSProperties;
}

function ChainIcon({
	chainId,
	size = "22px",
	className = "",
	style = {},
	...props
}: IChainIcon) {
	let svgContent;
	let viewBox = "0 0 38 38"; // default

	switch (chainId) {
		case supportedChainIds.SEPOLIA:
			// Ethereum Icon
			svgContent = (
				<>
					<path d="M18.7489 0V22.1796L37.4953 30.5564L18.7489 0Z" />
					<path d="M18.7489 0L0 30.5564L18.7489 22.1796V0Z" />
					<path d="M18.7489 44.9294V60L37.5078 34.0471L18.7489 44.9294Z" />
					<path d="M18.7489 60L18.7489 44.9269L0 34.0471L18.7489 60Z" />
					<path d="M18.7489 41.4411L37.4953 30.5564L18.7489 22.1846V41.4411Z" />
					<path d="M0 30.5564L18.7489 41.4411V22.1846L0 30.5564Z" />
				</>
			);
			viewBox = "0 0 38 60";
			break;
		case supportedChainIds.ARBITRUM:
			// Arbitrum Icon
			svgContent = (
				<>
					<path d="M26.8857 38.7158L35.1619 51.7056L42.8075 47.2748L31.9379 30.1426L26.8857 38.7158Z" />
					<path d="M49.7698 42.0635L49.7641 38.5133L37.8872 20.0146L33.481 27.4915L44.9464 46.0345L49.0919 43.6322C49.4985 43.3019 49.7445 42.8173 49.7704 42.2944L49.7698 42.0635Z" />
					<path d="M0 45.4108L5.85407 48.7842L25.3352 17.5419L22.0289 17.4547C19.2118 17.4149 16.1772 18.1472 14.7844 20.4208L3.72174 37.5675L0 43.2859V45.4108Z" />
					<path d="M36.5792 17.542L27.8653 17.5736L8.15088 50.1062L15.0417 54.0737L16.9156 50.8956L36.5792 17.542Z" />
					<path d="M53.4418 17.4976C53.3689 15.6752 52.3822 14.007 50.8367 13.0357L29.1736 0.577788C27.6447 -0.192019 25.7348 -0.193008 24.2033 0.577294C24.0222 0.668623 3.13645 12.7815 3.13645 12.7815C2.84738 12.9202 2.56895 13.0853 2.30707 13.2727C0.927377 14.2615 0.0863855 15.7982 0 17.4864V43.2864L3.72174 37.5681L3.68924 17.6607C3.69357 17.5879 3.70271 17.5163 3.71569 17.4456C3.79985 16.9772 4.06135 16.5593 4.45509 16.277C4.55334 16.2066 25.7959 3.91061 25.8634 3.87687C26.3626 3.62612 26.9973 3.62315 27.4972 3.86909L48.88 16.1686C49.3858 16.4908 49.7029 17.037 49.7311 17.6342V42.2944C49.7053 42.8173 49.4985 43.3019 49.0919 43.6322L44.9464 46.0345L42.8074 47.2741L35.162 51.7049L27.4087 56.198C26.9911 56.3489 26.5028 56.3404 26.0887 56.1721L16.9152 50.8959L15.0413 54.0741L23.2851 58.8205C23.5578 58.9756 23.8006 59.113 24 59.2249C24.3086 59.3979 24.5189 59.5137 24.5932 59.5498C25.1791 59.8344 26.0222 60 26.7818 60C27.4784 60 28.1576 59.8721 28.8002 59.6203L51.3204 46.5784C52.613 45.5768 53.3734 44.0665 53.4418 42.4304V17.4976Z" />
				</>
			);
			viewBox = "0 0 54 60";
			break;
		case supportedChainIds.OPTIMISM:
			// Optimism Icon
			svgContent = (
				<>
					<path d="M10.5479 28.1278C7.44861 28.1278 4.90939 27.3985 2.93002 25.94C0.976674 24.4555 0 22.346 0 19.6113C0 19.0383 0.0651662 18.335 0.195292 17.5016C0.534036 15.6266 1.01582 13.3736 1.64084 10.7432C3.4118 3.58106 7.98265 0 15.3532 0C17.3586 0 19.1556 0.338537 20.7443 1.01561C22.3331 1.66665 23.5832 2.65644 24.4947 3.98476C25.4062 5.28686 25.8621 6.84962 25.8621 8.67263C25.8621 9.21957 25.797 9.90976 25.6666 10.7432C25.2761 13.0611 24.8072 15.314 24.2602 17.5016C23.3487 21.0698 21.7731 23.7393 19.5332 25.5103C17.2934 27.2552 14.2984 28.1278 10.5479 28.1278ZM11.0948 22.5022C12.5535 22.5022 13.7904 22.0725 14.8062 21.213C15.8481 20.3536 16.5903 19.0383 17.033 17.2674C17.6319 14.8191 18.0879 12.6834 18.4004 10.8604C18.5045 10.3135 18.5566 9.75361 18.5566 9.18043C18.5566 6.81047 17.3194 5.62539 14.8454 5.62539C13.3867 5.62539 12.1367 6.05512 11.0948 6.91457C10.0792 7.77424 9.34991 9.08945 8.90727 10.8604C8.4384 12.6053 7.96953 14.7411 7.50087 17.2674C7.39656 17.7881 7.34451 18.335 7.34451 18.908C7.34451 21.3042 8.59476 22.5022 11.0948 22.5022Z" />
					<path d="M27.6562 27.7363C27.3698 27.7363 27.1482 27.6451 26.9921 27.4627C26.8617 27.2543 26.8228 27.0201 26.8749 26.7596L32.266 1.36632C32.3181 1.07983 32.4613 0.845399 32.6958 0.663014C32.9302 0.480838 33.1775 0.389648 33.438 0.389648H43.8297C46.7206 0.389648 49.0385 0.988643 50.7835 2.18663C52.5546 3.38483 53.4401 5.11665 53.4401 7.3825C53.4401 8.03355 53.362 8.71083 53.2057 9.41393C52.5546 12.4091 51.2394 14.6229 49.26 16.0553C47.3067 17.4878 44.624 18.204 41.2122 18.204H35.9383L34.1413 26.7596C34.089 27.0461 33.9458 27.2803 33.7116 27.4627C33.4771 27.6451 33.2296 27.7363 32.9693 27.7363H27.6562ZM41.4858 12.8128C42.5795 12.8128 43.5301 12.5132 44.3375 11.9142C45.171 11.3152 45.7179 10.4558 45.9784 9.33585C46.0564 8.89301 46.0956 8.50242 46.0956 8.16389C46.0956 7.40853 45.8743 6.83556 45.4314 6.44498C44.9886 6.02816 44.2334 5.81995 43.1656 5.81995H38.4775L36.993 12.8128H41.4858Z" />
				</>
			);
			viewBox = "0 0 54 29";
			break;
		case supportedChainIds.POLYGON:
			// Polygon Icon
			svgContent = (
				<path d="M53.44 24.3156V36.4071C53.4357 37.1612 53.2365 37.9012 52.8618 38.5548C52.4871 39.2084 51.9498 39.7532 51.3024 40.136L40.8649 46.1693C40.2185 46.556 39.4799 46.7601 38.7273 46.7601C37.9747 46.7601 37.2362 46.556 36.5898 46.1693L26.1522 40.136C25.5048 39.7532 24.9676 39.2084 24.5929 38.5548C24.2183 37.9012 24.019 37.1612 24.0147 36.4071V33.0134L29.3586 29.9005V35.7996L38.7106 41.2463L48.0627 35.7996V24.9314L38.7106 19.4847L16.8002 32.2215C16.1477 32.5905 15.4115 32.7844 14.6626 32.7844C13.9137 32.7844 13.1775 32.5905 12.525 32.2215L2.08747 26.1632C1.4501 25.7746 0.923143 25.2277 0.557513 24.5753C0.191883 23.9229 -0.000100161 23.187 3.9202e-08 22.4385V10.3469C0.00430864 9.59285 0.203606 8.85288 0.578254 8.19927C0.953003 7.54567 1.49028 7.00078 2.13757 6.61801L12.5751 0.584767C13.2229 0.201902 13.961 0 14.7127 0C15.4645 0 16.2026 0.201902 16.8503 0.584767L27.2878 6.61801C27.9352 7.00078 28.4725 7.54567 28.8471 8.19927C29.2218 8.85288 29.421 9.59285 29.4255 10.3469V13.7405L24.048 16.8326V10.967L14.696 5.52032L5.34397 10.967V21.8226L14.696 27.2692L36.6064 14.5324C37.2589 14.1635 37.9952 13.9697 38.7441 13.9697C39.493 13.9697 40.2291 14.1635 40.8816 14.5324L51.3192 20.5908C51.9628 20.9754 52.4963 21.5205 52.868 22.1731C53.2396 22.8258 53.4367 23.5639 53.44 24.3156Z" />
			);
			viewBox = "0 0 54 47";
			break;
		case supportedChainIds.AVALANCHE:
			// Avalanche Icon
			svgContent = (
				<>
					<path d="M13.412 47.4302H4.42632C2.53817 47.4302 1.6055 47.4302 1.03682 47.0665C0.422587 46.6682 0.0472484 46.0085 0.0017493 45.2804C-0.0324059 44.6096 0.433991 43.7904 1.36666 42.1525L23.5533 3.04545C24.4974 1.38479 24.9751 0.554466 25.5779 0.247378C26.2263 -0.0824594 26.9997 -0.0824594 27.6481 0.247378C28.2509 0.554466 28.7286 1.38479 29.6727 3.04545L34.257 11.0481C35.2767 12.8296 35.7938 13.7331 36.0195 14.6813C36.2697 15.7163 36.2697 16.8083 36.0195 17.8433C35.792 18.7987 35.2802 19.7087 34.2451 21.5172L22.591 42.1184L22.5609 42.1712L22.5603 42.1722C21.5343 43.9677 21.0142 44.8779 20.2934 45.5646C19.5086 46.3155 18.5645 46.8612 17.5295 47.1688C16.5854 47.4302 15.5276 47.4302 13.412 47.4302ZM36.1037 47.4302H48.9791C50.8786 47.4302 51.8342 47.4302 52.4032 47.0554C53.0173 46.6571 53.4038 45.9857 53.4384 45.2582C53.471 44.609 53.0148 43.8217 52.1209 42.279C52.0942 42.2336 52.0676 42.1876 52.0406 42.1409C52.0363 42.1335 52.0321 42.1261 52.0278 42.1186L45.5784 31.0857L45.5037 30.9592C44.5983 29.4281 44.141 28.6548 43.5537 28.3558C42.9057 28.0259 42.1431 28.0259 41.4951 28.3558C40.9036 28.6629 40.4259 29.4705 39.4818 31.097L33.0554 42.13L33.0334 42.168C32.0926 43.7919 31.6225 44.6035 31.6564 45.2693C31.7019 45.9974 32.0772 46.6682 32.6914 47.0665C33.2488 47.4302 34.2042 47.4302 36.1037 47.4302Z" />
					<path d="M13.412 47.4302H4.42632C2.53817 47.4302 1.6055 47.4302 1.03682 47.0665C0.422587 46.6682 0.0472484 46.0085 0.0017493 45.2804C-0.0324059 44.6096 0.433991 43.7904 1.36666 42.1525L23.5533 3.04545C24.4974 1.38479 24.9751 0.554466 25.5779 0.247378C26.2263 -0.0824594 26.9997 -0.0824594 27.6481 0.247378C28.2509 0.554466 28.7286 1.38479 29.6727 3.04545L34.257 11.0481C35.2767 12.8296 35.7938 13.7331 36.0195 14.6813C36.2697 15.7163 36.2697 16.8083 36.0195 17.8433C35.792 18.7987 35.2802 19.7087 34.2451 21.5172L22.591 42.1184L22.5609 42.1712L22.5603 42.1722C21.5343 43.9677 21.0142 44.8779 20.2934 45.5646C19.5086 46.3155 18.5645 46.8612 17.5295 47.1688C16.5854 47.4302 15.5276 47.4302 13.412 47.4302Z" />
					<path d="M36.1037 47.4302H48.9791C50.8786 47.4302 51.8342 47.4302 52.4032 47.0554C53.0173 46.6571 53.4038 45.9857 53.4384 45.2582C53.471 44.609 53.0148 43.8217 52.1209 42.279C52.0942 42.2336 52.0676 42.1876 52.0406 42.1409L52.0278 42.1186L45.5784 31.0857L45.5037 30.9592C44.5983 29.4281 44.141 28.6548 43.5537 28.3558C42.9057 28.0259 42.1431 28.0259 41.4951 28.3558C40.9036 28.6629 40.4259 29.4705 39.4818 31.097L33.0554 42.13L33.0334 42.168C32.0926 43.7919 31.6225 44.6035 31.6564 45.2693C31.7019 45.9974 32.0772 46.6682 32.6914 47.0665C33.2488 47.4302 34.2042 47.4302 36.1037 47.4302Z" />
				</>
			);
			viewBox = "0 0 54 48";
			break;
		default:
			// Empty Icon
			svgContent = <path />;
	}

	return (
		<svg
			width={size}
			height={size}
			viewBox={viewBox}
			className={`fill-current ${className}`}
			style={style}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
			xmlns="http://www.w3.org/2000/svg"
		>
			{svgContent}
		</svg>
	);
}

export default ChainIcon;