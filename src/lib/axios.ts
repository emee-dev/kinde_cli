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

		return {
			data: response.data,
			status: response.status,
		};
	} catch (err: unknown) {
		if (err instanceof AxiosError) {
			return {
				data: null,
				status: err.status,
				error: err.toJSON(),
			};
		}

		return {
			data: null,
			status: 500,
			error: "Internal Error",
		};
	}
};
