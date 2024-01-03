import axios from "axios";

interface AxiosRequest {
	path: string;
	method: "POST" | "GET" | "PATCH" | "DELETE";
	headers: {
		Accept: "application/json";
		"Content-Type"?: "application/json" | "application/x-www-form-urlencoded";
		Authorization?: `Bearer ${string}`;
	};
	data?: unknown;
}

export const axiosRequest = async ({
	path,
	method,
	headers,
	data,
}: AxiosRequest) => {
	try {
		let response = await axios.request({
			url: path,
			method,
			headers,
			data,
		});

		return response.data;
	} catch (err: unknown) {
		return null;
	}
};
