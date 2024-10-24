/*
    Interacting with the Element API
    https://element.readme.io/reference/api-overview
*/

const getCollectionStats = async (slug: string = "ethereum-frogs") => {
	const url = `https://api.element.market/openapi/v1/collection/stats?collection_slug=${slug}`;
	const options = {
		method: "GET",
		headers: {
			"X-Api-Key": process.env.NEXT_PUBLIC_ELEMENT_API_KEY!,
			Accept: "application/json",
		},
	};

	const response = await fetch(url, options);
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data.data;
};

export const getCollectionFloor = async (slug: string = "ethereum-frogs") => {
	const collectionStats = await getCollectionStats(slug);
	console.log("collectionStats", collectionStats);
	return collectionStats.floorPrice;
};
