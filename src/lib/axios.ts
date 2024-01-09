import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";

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

export interface RequestError {
	data: null;
	name: "SERVER" | "AXIOS";
	status: number;
	error: any;
}

export const axiosRequest = async (args: AxiosRequest) => {
	try {
		let { path, method, headers, data } = args;

		let RETRIES = 3;
		let DELAY = 3000;

		axiosRetry(axios, {
			retries: RETRIES,
			retryDelay: (...arg) => axiosRetry.exponentialDelay(...arg, DELAY),
			retryCondition(error: AxiosError) {
				switch (error?.response?.status) {
					case 429:
						return true;
					case 500:
						return true;
					case 501:
						return true;
					default:
						return false;
				}
			},
			onRetry: (retryCount, error, request) => {
				console.warn(
					`WARN ${request.method?.toUpperCase()} ${request.url} ${
						error.code
					} (${error.message}). Will retry in ${DELAY / 1000} seconds. ${
						RETRIES - retryCount
					} retries left.`
				);
			},
		});

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
