export function getRandColor(): string {
	const colorCodes: { [key: string]: string } = {
		"alt-1": "#7401B8",
		"alt-3": "#5E60CD",
		"alt-5": "#4EA8DD",
		"alt-7": "#56CFE0",
		"alt-9": "#72EFDD",
		"alt-10": "#7FFFDA",
	};

	const keys = Object.keys(colorCodes);
	const randomIndex = Math.floor(Math.random() * keys.length);
	return colorCodes[keys[randomIndex]];
}
