import { z } from "zod";

export const prettifyAxios = (response: Record<string, any>) => {
	if (response.name === "SERVER") {
		console.error(JSON.stringify(response.error, null, 2));
	} else if (response.name === "AXIOS") {
		console.warn(JSON.stringify(response, null, 2));
	} else {
		console.log(response);
	}
};

export const prettifyZod = (validation: { error: z.ZodError }) => {
	console.warn(
		validation.error.errors.map((e) => `Path: [${e.path}] - '${e.message}'`)
	);
};
