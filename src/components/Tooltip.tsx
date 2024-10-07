/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/require-default-props */
import type * as PopperJS from "@popperjs/core";
import { type ReactNode, useCallback, useRef, useState } from "react";
import { usePopper } from "react-popper";

export interface ITooltip {
	children: ReactNode;
	label: string;
	placement?: PopperJS.Placement;
	width?: string;
	marginTop?: string;
	enterDelay?: number;
	leaveDelay?: number;
}

function Tooltip({
	children,
	label,
	placement = "bottom",
	width,
	marginTop,
	enterDelay = 100,
	leaveDelay = 100,
}: ITooltip) {
	const [isOpen, setIsOpen] = useState(false);

	const [referenceElement, setReferenceElement] =
		useState<HTMLDivElement | null>(null);

	const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
		null
	);

	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		placement,
		modifiers: [{ name: "offset", options: { offset: [0, 4] } }],
	});

	const enterTimeout = useRef<NodeJS.Timeout>();

	const leaveTimeout = useRef<NodeJS.Timeout>();

	const handleMouseEnter = useCallback(() => {
		leaveTimeout.current && clearTimeout(leaveTimeout.current);
		enterTimeout.current = setTimeout(() => setIsOpen(true), enterDelay);
	}, [enterDelay]);

	const handleMouseLeave = useCallback(() => {
		enterTimeout.current && clearTimeout(enterTimeout.current);
		leaveTimeout.current = setTimeout(() => setIsOpen(false), leaveDelay);
	}, [leaveDelay]);

	return (
		<div>
			<div
				ref={setReferenceElement}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				className="relative"
			>
				{children}
			</div>

			<div
				ref={setPopperElement}
				style={{
					...styles.popper,
					pointerEvents: isOpen ? "auto" : "none",
				}}
				{...attributes.popper}
				className={`transition-opacity ${isOpen ? "z-50 opacity-100" : "opacity-0"}`}
			>
				<span
					className={`${marginTop && marginTop} bg-light-200 dark:bg-dark-400 flex items-center rounded-xl p-3 text-left text-xs ${width && width}`}
				>
					{label}
				</span>
			</div>
		</div>
	);
}

export default Tooltip;
