"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export interface IThemedImage {
	darkImageSrc: string;
	lightImageSrc: string;
	alt: string;
}

function ThemedImage({ darkImageSrc, lightImageSrc, alt }: IThemedImage) {
	const [mounted, setMounted] = useState<boolean>(false);
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	let src;

	switch (resolvedTheme) {
		case "light":
			src = lightImageSrc;
			break;
		case "dark":
			src = darkImageSrc;
			break;
		default:
			src =
				"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
			break;
	}

	return <Image src={src} alt={alt} fill />;
}

export default ThemedImage;
