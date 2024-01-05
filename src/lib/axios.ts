import axios, { AxiosError } from "axios";

interface AxiosRequest {
	path: string;
	method: "POST" | "GET" | "PATCH" | "DELETE";
	headers: {
		Accept?: "application/json";
		Authorization?: `Bearer ${string}`;
		"Content-Type"?: "application/json" | "application/x-www-form-urlencoded";
	};
	data?: unknown;
}

export const axiosRequest = async (args: AxiosRequest) => {
	try {
		let { path, method, headers, data } = args;

		let response = await axios({
			url: path,
			method,
			headers,
			data,
			validateStatus(status) {
				return status >= 200 && status < 500;
			},
		});

		if ([400, 403, 429].includes(response.status)) {
			throw {
				data: null,
				name: "SERVER",
				status: response.status,
				error: response.data.errors,
			};
		}

		return {
			data: response.data,
			status: response.status,
			error: null,
		};
	} catch (err: unknown) {
		// TODO refactor later am losing context on server error responses
		// find a way to properly handle request errors and server error response
		if (err instanceof AxiosError) {
			return {
				data: null,
				name: "AXIOS",
				status: err.status,
				error: err.message,
			};
		}

		return err as {
			data: null;
			name: "SERVER";
			status: number;
			error: any;
		};
	}
};
