import ctx from "@/lib/context";
import colors from "picocolors";
import { readGlobalConfig } from "./storage";
import { z } from "zod";
import { cancel } from "@clack/prompts";

interface GenerateMessage {
	key: `${string}`;
	desc: `${string}`;
	attr: "optional" | "required";
}

export const onCancelCallback = {
	onCancel: ({ results }: { results: any }) => {
		cancel("Done.");
		process.exit(0);
	},
};

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

const handleMiddlewareError = (err: Error) => {
	console.error(err.message);
	process.exit(1);
};

const isAuthenticated = async () => {
	let config = await readGlobalConfig();

	if (!config) {
		throw new Error(
			"You are not authenticated, please login: 'kinde-cli login'"
		);
	}

	let toJson = JSON.parse(config);

	let schema = z.object({
		clientId: z.string().min(1),
		clientSecret: z.string().min(1),
		normalDomain: z.string().url(),
		personalDomainNoApiEndingPath: z.string().url(),
		token: z.object({
			access_token: z.string().min(1),
			expires_in: z.number(),
			scope: z.string(), // probably not an empty string
			token_type: z.string().min(1),
		}),
	});

	let validateContext = schema.safeParse(toJson);

	if (!validateContext.success) {
		console.warn(
			validateContext.error.errors.map(
				(e) => `Path: [${e.path}] - '${e.message}'`
			)
		);
		throw new Error(
			"Invalid config structure, please login: 'kinde-cli login'"
		);
	}

	ctx.setData(toJson);
};

export function errorHandler(
	handler: "Auth" | "NoAuth",
	fn: (...args: any[]) => Promise<any>
) {
	return async (...args: any[]) => {
		/**
		 * Some command action handlers do not require auth,
		 * But this auth check should run all at all times
		 */
		if (handler === "Auth") {
			try {
				await isAuthenticated();
			} catch (e) {
				handleMiddlewareError(e as Error);
			}
		}
		/**
		 * This function below will never be executed if auth check fails,
		 * if auth fails handleMiddlwareError exits the process with a status of 1
		 */
		return await fn(...args).catch(handleMiddlewareError);
	};
}
