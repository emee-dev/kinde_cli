import colors from "picocolors";

interface GenerateMessage {
	key: `${string}`;
	desc: `${string}`;
	attr: "optional" | "required";
}

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

export const generateMessage = ({ key, desc, attr }: GenerateMessage) =>
	`${colors.green(`${key}:`)} ${colors.blue(`(${desc})`)} ${colors.green(
		`[${attr}]`
	)}`;

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

export function errorHandler(fn: (...args: any[]) => Promise<any>) {
	return (...args: any[]) => {
		throw new Error("Unauthenticated user be gone");
		return fn(...args).catch((error: Error) => {
			console.error(error.message);
		});
	};
}
