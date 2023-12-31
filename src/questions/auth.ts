import { group, text } from "@clack/prompts";
import axios from "axios";
import qs from "qs";
import { generateMessage } from "../utils";
import { Command } from "commander";
import colors from "picocolors";
import { axiosRequest } from "../lib/axios";
/* 
/oauth2/token
client_id: "",
client_secret: ""
personaldomain: ""

//response
{
  access_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImNmOjdjOmNhOjI0OjUwOjVmOmE2OmNhOjc2OjIzOjU1OjMxOjUyOmFkOjY2OmFkIiwidHlwIjoiSldUIn0.eyJhdWQiOltdLCJhenAiOiIwZDRlNWFmZTc5Njk0NWQ3YTBjZmQzZTdjZmVjZDQxZSIsImV4cCI6MTcwNDA1OTU5MSwiZ3R5IjpbImNsaWVudF9jcmVkZW50aWFscyJdLCJpYXQiOjE3MDM5NzMxOTEsImlzcyI6Imh0dHBzOi8vZ2V0dHVpdGlvbi5raW5kZS5jb20iLCJqdGkiOiI5NWNjNGRiZC03YWJkLTQyMjgtYmQwNi1hOTZlMmE4ZWVlODEiLCJzY3AiOltdfQ.4pf-9ECGRfz-Zp7wuOaqJTP1NG4fH8wNI3ilwxEbr1AXNIAFiGOuaidZ8MzygXNmn7MNV8KEpBns2c6oLH_v_gmQqGAHgaVHPKrUfHbC3Lgplxj7_hMZeBtG3STo439hIkMfHnBWsQPkGnxcLYze1ekVCRsyKRl38X-Luxd4Gn_kQOfHGhyiVSdDhaSBQtd3APHXzHYmEO1rWdEmeB_iQ0uIGDqsvoKcz1VKqnOO8cxp6v5JsvowP91poIbMs3m0__vpaLvT7CIn-vD91JY2aaXS9A3LrhaKSOMFpiw5RgUrXEN7Y0GClcNcXd4r6-Jb_UaSGIfnZoCn2W2i0eHlSw',
  expires_in: 86399,
  scope: '',
  token_type: 'bearer'
}
*/

let env = process.env.NODE_ENV;

// export const authenticationQuestion = {
// 	clientId: () =>
// 		text({
// 			message: "ClientId: (Application ClientId) [required]",
// 			defaultValue: env === "development" ? "TEST_CLIENT_ID" : "",
// 		}),

// 	clientSecret: () =>
// 		text({
// 			message: "ClientSecret: (Application Client Secret) [required]",
// 			defaultValue: env === "development" ? "TEST_SECRET" : "",
// 		}),
// 	personalDomain: () =>
// 		text({
// 			message: "Domain: (Enter your kinde's business domain) [required]",
// 			placeholder: "(https://<businessName>.kinde.com)",
// 		}),
// };

// export const handleAuthenticationProcess = async () => {
// 	try {
// 		let params = qs.stringify({
// 			// required
// 			grant_type: "client_credentials",
// 			client_id: "",
// 			client_secret: "",
// 		});
// 		let data = await axios.request({
// 			url: "https://gettuition.kinde.com/oauth2/token",
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/x-www-form-urlencoded",
// 				Accept: "application/json",
// 			},
// 			data: params,
// 		});
// 		console.log(data.data);
// 	} catch (err: any) {
// 		console.log(err.message);
// 	}
// };

interface GenerateAccessToken {
	domain: string;
	client_id: string;
	client_secret: string;
}

interface AccessTokenResponse {
	access_token: string;
	expires_in: number;
	scope: string;
	token_type: string;
}

class Authentication {
	constructor(private program: Command) {
		this.handleAuthentication();
	}

	private handleAuthentication() {
		let program = this.program;

		program
			.command("login")
			.description(
				colors.blue(
					"Obtain authentication to use this CLI. Requirements include the Business Domain Client Id and Client Secret. For more information, refer to: https://kinde.com/docs/build/get-access-token-for-connecting-securely-to-kindes-api/"
				)
			)
			.action(async (str, options) => {
				const args = options.opts() as {};

				let data = await this.__getAuthenticationArguments();
				console.log(data);
			});
	}

	private async __getAuthenticationArguments() {
		let values = await group({
			businessDomain: () =>
				text({
					message: generateMessage({
						key: "Domain",
						desc: "Business domain eg: https://<domain>.kinde.com",
						attr: "required",
					}),
					defaultValue: undefined,
				}),
			clientId: () =>
				text({
					message: generateMessage({
						key: "ClientId",
						desc: "From Settings > Applications > New Application",
						attr: "required",
					}),
					defaultValue: undefined,
				}),
			clientSecret: () =>
				text({
					message: generateMessage({
						key: "ClientSecret",
						desc: "From Settings > Applications > New Application",
						attr: "required",
					}),
					defaultValue: undefined,
				}),
		});
		return values;
	}

	private async __generateAccessToken({
		domain,
		client_id,
		client_secret,
	}: GenerateAccessToken) {
		let params = qs.stringify({
			grant_type: "client_credentials",
			client_id,
			client_secret,
		});

		let data = (await axiosRequest({
			path: "/oauth2/token",
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json",
			},
			data: params,
		})) as AccessTokenResponse;
	}
	// private async __updatePermissionArguments() {
	// 	let values = await group({
	// 		permissionId: () =>
	// 			text({
	// 				message: generateMessage({
	// 					key: "Id",
	// 					desc: "permission's id",
	// 					attr: "required",
	// 				}),

	// 				validate(value) {
	// 					if (!value) return "id is required";
	// 				},
	// 			}),
	// 		key: () =>
	// 			text({
	// 				message: generateMessage({
	// 					key: "Key",
	// 					desc: "identifier to use in code",
	// 					attr: "optional",
	// 				}),
	// 				defaultValue: undefined,
	// 			}),
	// 		name: () =>
	// 			text({
	// 				message: generateMessage({
	// 					key: "Name",
	// 					desc: "Permission's name",
	// 					attr: "optional",
	// 				}),
	// 				defaultValue: undefined,
	// 			}),
	// 		description: () =>
	// 			text({
	// 				message: generateMessage({
	// 					key: "Description",
	// 					desc: "Permission's description",
	// 					attr: "optional",
	// 				}),
	// 				defaultValue: undefined,
	// 			}),
	// 		body: () =>
	// 			text({
	// 				message: generateMessage({
	// 					key: "Body:",
	// 					desc: "Permission's details",
	// 					attr: "optional",
	// 				}),
	// 				defaultValue: undefined,
	// 			}),
	// 	});

	// 	return values;
	// }
}

export default Authentication;
