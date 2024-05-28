export const formatDateUtc = (dateString: string, showTime: boolean = true) => {
	const date = new Date(dateString);
	if (showTime) {
		return `${date.toISOString().replace("T", " ").substring(0, 19)} UTC`;
	}
	return `${date.toISOString().split("T")[0]}`;
};
