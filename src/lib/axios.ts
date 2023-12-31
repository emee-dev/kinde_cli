import axios from "axios";

interface AxiosRequest {
	path: string;
	// domain: string;
	method: "POST" | "GET" | "PATCH" | "DELETE";
	headers: {
		Accept: "application/json";
		"Content-Type"?: "application/json" | "application/x-www-form-urlencoded";
		Authorization?: `Bearer ${string}`;
	};
	data?: unknown;
}

let PERSONAL_KINDE_DOMAIN = "";

export const axiosRequest = async ({
	path,
	method,
	headers,
	data,
}: AxiosRequest) => {
	try {
		// Get this from local storage, must be available before any api call
		let domain = ""; // "https://gettuition.kinde.com/api".split("/api")[0]

		let response = await axios.request({
			url: `${domain}${path}`,
			method,
			headers,
			data,
		});
		return response.data;
	} catch (err: unknown) {
		return err;
	}
};
