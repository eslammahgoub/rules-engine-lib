/**
 * Find the path in object and return the value of that path.
 * @param obj {Record<string, unknown>} the object to search in
 * @param path {string | string[]} the path
 * @returns {unknown}
 */
const PathFinder = (
	obj: Record<string, unknown>,
	path: string | string[],
): unknown => {
	if (typeof path !== "string" && !Array.isArray(path)) return;

	if (
		typeof path === "string" &&
		path.indexOf(".") === -1 &&
		Object.hasOwn(obj, path)
	)
		return obj[path];

	const split = Array.isArray(path) ? path : path.split(".");
	let index = 0;
	let result = obj;

	while (index < split.length) {
		const key = split[index];
		if (!result || typeof result !== "object" || !Object.hasOwn(result, key))
			return;

		result = result[key] as Record<string, unknown>;
		index++;
	}

	return result;
};

export default PathFinder;
