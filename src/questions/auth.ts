import { group, spinner as clarkSpinner, text } from "@clack/prompts";
import { Command } from "commander";
import colors from "picocolors";
import qs from "qs";
import { axiosRequest } from "../lib/axios";
import { extractUrlWithoutApi, generateMessage } from "../utils/index";
import {
	createRootDirectory,
	isValidPath,
	rootDirectoryPath,
	writeGlobalConfig,
} from "../utils/storage";
import Context from "../lib/context";

const spinner = clarkSpinner();
/* 
/oauth2/token
client_id: "",
client_secret: ""
personaldomain: ""

// Before login request clientSecret

 

*/

let env = process.env.NODE_ENV;

export interface AccessTokenConfig {
	domain: string;
	clientId: string;
	clientSecret: string;
}

interface AccessTokenResponse {
	access_token: string;
	expires_in: number;
	scope: string;
	token_type: string;
}

interface ConfigData {
	clientId: string;
	normalDomain: string;
	personalDomainNoApiEndingPath: string;
	accessToken: {
		access_token: string;
		expires_in: number;
		scope: string;
		token_type: string;
	};
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

				await this.__generateAccessToken(data);
			});
	}

	private async __getAuthenticationArguments() {
		let values = await group({
			domain: () =>
				text({
					message: generateMessage({
						key: "Domain",
						desc: "Business domain eg: https://<domain>.kinde.com",
						attr: "required",
					}),
					defaultValue: undefined,
					validate(value) {
						if (!value) return "Business domain is required!!";
					},
				}),
			clientId: () =>
				text({
					message: generateMessage({
						key: "ClientId",
						desc: "From Settings > Applications > New Application",
						attr: "required",
					}),
					defaultValue: undefined,
					validate(value) {
						if (!value) return "Client Id is required!!";
					},
				}),
			clientSecret: () =>
				text({
					message: generateMessage({
						key: "ClientSecret",
						desc: "From Settings > Applications > New Application",
						attr: "required",
					}),
					defaultValue: undefined,
					validate(value) {
						if (!value) return "Client Secret is required!!";
					},
				}),
		});
		return values;
	}

	private async __generateAccessToken({
		domain,
		clientId,
		clientSecret,
	}: AccessTokenConfig) {
		let strippedApiEndpoint = extractUrlWithoutApi(domain);

		// URL Encoded Params
		let payload = qs.stringify({
			grant_type: "client_credentials",
			client_id: clientId,
			client_secret: clientSecret,
			audience: strippedApiEndpoint,
		});

		let doesRootPathExist = isValidPath(rootDirectoryPath());

		if (!doesRootPathExist) {
			return;
		}

		spinner.start("Authenticating, please wait...");
		let accessToken = (await axiosRequest({
			path: strippedApiEndpoint + "/oauth2/token",
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json",
			},
			data: payload,
		})) as AccessTokenResponse;

		if (!accessToken) {
			spinner.stop("Error authenticating user, please try again", 400);
			return;
		}
		spinner.stop("Authentication success, please hold on...");

		let configData = {
			clientId,
			normalDomain: domain,
			personalDomainNoApiEndingPath: strippedApiEndpoint as string,
			accessToken: accessToken,
		};

		// Hold lifetime data in memory
		Context.setData(configData);

		spinner.start("Hold on writing config data...");
		let configCreated = await writeGlobalConfig<ConfigData>(configData);

		if (!configCreated) {
			spinner.stop("Config could not be saved", 400);
			return;
		}

		spinner.stop("Config was saved sucessfully...");
	}
}

export default Authentication;
