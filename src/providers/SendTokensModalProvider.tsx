"use client";

// providers/SendTokensModalProvider.tsx
import React, { createContext, useContext, useMemo, useState } from "react";

import { Token } from "@/types";

interface SendTokensModalContextType {
	isOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
	tokens: Token[] | undefined;
	setTokens: (tokens: Token[]) => void;
}

const SendTokensModalContext = createContext<
	SendTokensModalContextType | undefined
>(undefined);

export function SendTokensModalProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [tokens, setTokens] = useState<Token[] | undefined>(undefined);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	const value = useMemo(
		() => ({ isOpen, openModal, closeModal, tokens, setTokens }),
		[isOpen, openModal, closeModal, tokens, setTokens] // only recompute when these dependencies change
	);

	return (
		<SendTokensModalContext.Provider value={value}>
			{children}
		</SendTokensModalContext.Provider>
	);
}

// Custom hook to use the SendTokensModalContext
export const useSendTokensModal = (): SendTokensModalContextType => {
	const context = useContext(SendTokensModalContext);
	if (!context) {
		throw new Error(
			"useSendTokensModal must be used within a SendTokensModalProvider"
		);
	}
	return context;
};
