/**
 * Safely parses a JSON string, replacing single quotes with double quotes and handling errors.
 *
 * @param value {string} The JSON string to parse.
 * @returns The parsed JSON object or the original input if parsing fails.
 */
const SafeParse = (value: string): string => {
	try {
		const replacedSingleQuotes = value.replace(/'/g, '"');
		return JSON.parse(replacedSingleQuotes);
	} catch (err) {
		return value;
	}
};

export default SafeParse;
