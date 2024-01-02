import colors from "picocolors";

export const removeOptionalNullProperties = (obj: Record<string, unknown>) => {
	let temp = {} as typeof obj;
	for (let property in obj) {
		let key = property as keyof typeof obj;
		if (obj[key] && obj[key] !== undefined) {
			temp[key] = obj[key];
		}
	}

	return temp;
};

interface GenerateMessage {
	key: `${string}`;
	desc: `${string}`;
	attr: "optional" | "required";
}
export const generateMessage = ({ key, desc, attr }: GenerateMessage) =>
	`${colors.green(`${key}:`)} ${colors.blue(`(${desc})`)} ${colors.green(
		`[${attr}]`
	)}`;
// `${key} ${colors.blue(`${desc}`)} ${colors.green(`${attr}`)}`;

/**
 * Strips the api ending portion of the endpoint
 * `'https://<domain>.kinde.com/api'` => `'https://<domain>.kinde.com/'`
 */
export function extractUrlWithoutApi(url: string) {
	// Define the regex pattern to match URLs excluding "/api"
	let pattern = /(https:\/\/(?:www\.)?[^\/]+)(?:\/api)?(?:\/|$)/;

	// Find the match in the given URL
	let match = url.match(pattern);

	// If a match is found, return the extracted URL
	if (match) {
		return match[1];
	} else {
		return null;
	}
}
