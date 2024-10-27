/*
    Interacting with the Element API
    https://element.readme.io/reference/api-overview
*/

const ELEMENT_API_BASE_URL = "https://api.element.market/openapi/v1";
const EFROGS_CONTRACT_ADDRESS = "0x194395587d7b169e63eaf251e86b1892fa8f1960";
const ELEMENT_API_KEY = process.env.NEXT_PUBLIC_ELEMENT_API_KEY!;

const fetchFromElementAPI = async (endpoint: string) => {
	const url = `${ELEMENT_API_BASE_URL}${endpoint}`;
	const options = {
		method: "GET",
		headers: {
			"X-Api-Key": ELEMENT_API_KEY,
			Accept: "application/json",
		},
	};

	const response = await fetch(url, options);
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();

	if (data.code !== 0) {
		throw new Error(`API error! Code: ${data.code}`);
	}
	return data.data;
};

const getCollectionStats = async (slug: string = "ethereum-frogs") => {
	const url = `/collection/stats?collection_slug=${slug}`;
	const data = await fetchFromElementAPI(url);
	return data;
};

export const getCollectionFloor = async (slug: string = "ethereum-frogs") => {
	const collectionStats = await getCollectionStats(slug);
	return collectionStats.floorPrice;
};

export const getEfrogsFloor = async () => {
	const url =
		"/orders/list?chain=linea&asset_contract_address=0x194395587d7b169e63eaf251e86b1892fa8f1960&side=1&order_by=base_price&direction=asc&limit=1&offset=0";
	const data = await fetchFromElementAPI(url);

	if (!data.orders || data.orders.length === 0) {
		throw new Error("No orders found for Efrogs.");
	}

	const order = data.orders[0];
	const { priceBase, priceUSD, tokenId } = order;

	return { priceBase, priceUSD, tokenId };
};

/**
 * Fetches detailed information about a specific Efrog NFT.
 * @param tokenId - The ID of the token.
 * @returns Detailed information about the Efrog NFT.
 */
export const getEfrogNftInfo = async (tokenId: string) => {
	const endpoint = `/asset?chain=linea&contract_address=${EFROGS_CONTRACT_ADDRESS}&token_id=${tokenId}`;
	const data = await fetchFromElementAPI(endpoint);

	return {
		name: data.name,
		nftImgUrl: data.imagePreviewUrl,
		collectionImgUrl: data.collection.imageUrl,
		collectionName: data.collection.name,
	};
};

export type IEfrogsFloorInfo = {
	priceEth: string;
	priceUsd: string;
	tokenId: string;
	nftName: string;
	nftImgUrl: string;
	collectionImgUrl: string;
	collectionName: string;
	nftUrl: string;
};

/**
 * Combines the floor price information with detailed NFT information.
 * @returns An object containing priceEth, priceUsd, tokenId, nftName, nftImgUrl, and collectionImgUrl.
 */
export const getEfrogsFloorInfo = async (): Promise<IEfrogsFloorInfo> => {
	// Get the floor price and tokenId
	const { priceBase, priceUSD, tokenId } = await getEfrogsFloor();

	// Get detailed NFT information
	const { name, nftImgUrl, collectionImgUrl, collectionName } =
		await getEfrogNftInfo(tokenId);

	const nftUrl = `https://element.market/assets/linea/${EFROGS_CONTRACT_ADDRESS}/${tokenId}`;

	// Combine the data
	return {
		priceEth: priceBase,
		priceUsd: priceUSD,
		tokenId,
		nftName: name,
		nftImgUrl,
		collectionImgUrl,
		collectionName,
		nftUrl,
	};
};
