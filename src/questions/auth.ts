import {
	cancel,
	spinner as clarkSpinner,
	confirm,
	group,
	select,
	text,
} from "@clack/prompts";
import { Command } from "commander";
import colors from "picocolors";
import qs from "qs";
import { axiosRequest } from "../lib/axios";
import ctx from "../lib/context";
import {
	errorHandler,
	extractUrlWithoutApi,
	generateMessage,
	onCancelCallback,
} from "../utils/index";
import {
	clearGlobalConfig,
	createRootDirectory,
	readGlobalConfig,
	writeGlobalConfig,
} from "../utils/storage";
import { z } from "zod";

const spinner = clarkSpinner();

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

export interface ConfigData {
	clientId: string;
	clientSecret: string;
	normalDomain: string;
	personalDomainNoApiEndingPath: string;
	token: AccessTokenResponse;
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
			.action(
				errorHandler("NoAuth", async (str, options) => {
					await clearGlobalConfig();
					let data = await this.__getAuthenticationArguments();
					await this.__generateAccessToken(data);
				})
			);
	}

	private async __getAuthenticationArguments() {
		let values = await group(
			{
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
			},
			onCancelCallback
		);

		return values;
	}

	private async __generateAccessToken(args: AccessTokenConfig) {
		let { domain, clientId, clientSecret } = args;

		let rawInput = z.object({
			clientId: z.string().min(1),
			clientSecret: z.string().min(1),
			domain: z.string().url(),
		});

		let validation = rawInput.safeParse(args);
		if (!validation.success) {
			console.warn(
				validation.error.errors.map((e) => `Path: [${e.path}] - '${e.message}'`)
			);
			throw new Error(
				"Input Validation Error, please make sure you entered valid data"
			);
		}

		let noApiEndingPath = extractUrlWithoutApi(domain);

		if (!noApiEndingPath) {
			throw new Error(
				"Please provide a valid kinde domain, go to your dashboard > application to copy it"
			);
		}

		// URL Encoded Params
		let payload = qs.stringify({
			grant_type: "client_credentials",
			client_id: clientId,
			client_secret: clientSecret,
			audience: `${noApiEndingPath}/api`, // I don't understand it very well
		});

		spinner.start("Authenticating, please wait...");

		let accessTokenResponse = await axiosRequest({
			path: `${noApiEndingPath}/oauth2/token`,
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json",
			},
			data: payload,
		});

		if (accessTokenResponse.error) {
			console.log("Access Token Response", accessTokenResponse.error);
			spinner.stop(
				"Error authenticating user, please try again",
				accessTokenResponse.status
			);
			return;
		}

		spinner.stop("Authentication success, please hold on...");

		let configData: ConfigData = {
			clientId,
			clientSecret,
			normalDomain: domain,
			personalDomainNoApiEndingPath: `${noApiEndingPath}/api`,
			token: accessTokenResponse.data as AccessTokenResponse,
		};

		// Hold lifetime data in memory for easy access
		ctx.setData(configData);

		spinner.start("Hold on creating directory...");
		let rootPath = createRootDirectory();
		if (!rootPath) {
			spinner.stop("Failed to create directory", 400);
			return;
		}
		spinner.stop();

		spinner.start("Hold on writing config to directory...");
		let configCreated = await writeGlobalConfig<ConfigData>(configData);
		if (!configCreated) {
			spinner.stop("Falled to write config to directory", 400);
			return;
		}
		spinner.stop("Config was saved sucessfully...");
	}
}

export default Authentication;
