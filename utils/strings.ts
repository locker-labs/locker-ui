export function titleCaseWord(word: string) {
	if (!word) return word;
	return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

// Utility function to convert snake_case to camelCase
function snakeToCamel(s: string): string {
	return s.replace(/(_\w)/g, (matches) => matches[1].toUpperCase());
}

// Recursive function to convert all keys of an object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertKeysToCamelCase(obj: any): any {
	if (Array.isArray(obj)) {
		return obj.map((item) => convertKeysToCamelCase(item));
	}
	if (obj !== null && typeof obj === "object") {
		return Object.keys(obj).reduce((acc, key) => {
			const camelCaseKey = snakeToCamel(key);
			acc[camelCaseKey] = convertKeysToCamelCase(obj[key]);
			return acc;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		}, {} as any);
	}
	return obj;
}
