import { axiosRequest } from "@/lib/axios";
import ctx from "@/lib/context";
import { prettifyAxios } from "@/utils/error";
import { group, select, text } from "@clack/prompts";
import { Command } from "commander";
import qs from "querystring";

import colors from "picocolors";
import {
	Question,
	errorHandler,
	filterUndefined,
	generateMessage,
	onCancelCallback,
} from "../utils";
import { ConfigData } from "./auth";

const command: Question<
	| "BUSINESS_NAME"
	| "PRIMARY_EMAIL"
	| "PRIMARY_PHONE"
	| "INDUSTRY_KEY"
	| "TIMEZONE_ID"
	| "PRIVACY_URL"
	| "TERMS_URL"
	| "IS_SHOW_KINDE_BRANDING"
	| "IS_CLICK_WRAP"
	| "PARTNER_CODE"
> = {
	BUSINESS_NAME: {
		identifier: "Business Name",
		desc: "Business Name eg paystack",
		attr: "required",
	},
	PRIMARY_EMAIL: {
		identifier: "Primary Email",
		desc: "Email associated with business.",
		attr: "required",
	},
	PRIMARY_PHONE: {
		identifier: "Primary Phone",
		desc: "Phone number associated with business.",
		attr: "optional",
	},
	INDUSTRY_KEY: {
		identifier: "Industry Key",
		desc: "The key of the industry your business is in.",
		attr: "optional",
	},
	TIMEZONE_ID: {
		identifier: "Timezone Id",
		desc: "The ID of the timezone your business is in.",
		attr: "optional",
	},
	PRIVACY_URL: {
		identifier: "Privacy Url",
		desc: "Your Privacy policy URL.",
		attr: "optional",
	},
	TERMS_URL: {
		identifier: "Terms Url",
		desc: "Your Terms and Conditions URL.",
		attr: "optional",
	},
	IS_SHOW_KINDE_BRANDING: {
		identifier: "Show Kinde Branding",
		desc: "Display 'Powered by Kinde' branding",
		attr: "optional",
	},
	IS_CLICK_WRAP: {
		identifier: "Show Policy",
		desc: "Show a policy acceptance checkbox on sign up.",
		attr: "optional",
	},
	PARTNER_CODE: {
		identifier: "Partner Code",
		desc: "Your Kinde Perk code.",
		attr: "optional",
	},
} as const;

type BusinessArgument = {
	list: "list business details";
	update: "update";
};

type BusinessAction = keyof BusinessArgument;

class Business {
	constructor(private program: Command) {
		this.handleBusiness();
	}

	private handleBusiness() {
		let program = this.program;

		program
			.command("business")
			.description(colors.blue("Manage your Business details."))
			.action(
				errorHandler("Auth", async (str, options) => {
					let context = ctx.getData() as ConfigData;

					let prompt = (await select({
						message: "Proceed with appropriate action",
						options: [
							{
								label: "List Business Details",
								value: "list",
							},
							{
								label: "Update Business Details",
								value: "update",
							},
						],
					})) as BusinessAction;

					if (prompt === "list") {
						let response = await axiosRequest({
							path: `${context.normalDomain}/api/v1/business`,
							method: "GET",
							headers: {
								Accept: "application/json",
								"Content-Type": "application/json",
								Authorization: `Bearer ${context.token.access_token}`,
							},
						});

						return prettifyAxios(response);
					}

					if (prompt === "update") {
						let updateBusinessData =
							await this.__updateBusinessDetailsPrompts();

						let stringify = qs.stringify(filterUndefined(updateBusinessData));

						let response = await axiosRequest({
							path: `${context.normalDomain}/api/v1/business?${stringify}`,
							method: "PATCH",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${context.token.access_token}`,
							},
						});

						return prettifyAxios(response);
					}
				})
			);
	}

	private async __updateBusinessDetailsPrompts() {
		let values = await group(
			{
				business_name: () =>
					text({
						message: generateMessage({
							identifier: command.BUSINESS_NAME.identifier,
							desc: command.BUSINESS_NAME.desc,
							attr: command.BUSINESS_NAME.attr,
						}),
						validate(value) {
							if (!value) return "Business name is required";
						},
					}),
				email: () =>
					text({
						message: generateMessage({
							identifier: command.PRIMARY_EMAIL.identifier,
							desc: command.PRIMARY_EMAIL.desc,
							attr: command.PRIMARY_EMAIL.attr,
						}),
						validate(value) {
							if (!value) return "Business email is required";
						},
					}),
				primary_phone: () =>
					text({
						message: generateMessage({
							identifier: command.PRIMARY_PHONE.identifier,
							desc: command.PRIMARY_PHONE.desc,
							attr: command.PRIMARY_PHONE.attr,
						}),
						defaultValue: undefined,
					}),
				industry_key: () =>
					text({
						message: generateMessage({
							identifier: command.INDUSTRY_KEY.identifier,
							desc: command.INDUSTRY_KEY.desc,
							attr: command.INDUSTRY_KEY.attr,
						}),
						defaultValue: undefined,
					}),
				timezone_id: () =>
					text({
						message: generateMessage({
							identifier: command.TIMEZONE_ID.identifier,
							desc: command.TIMEZONE_ID.desc,
							attr: command.TIMEZONE_ID.attr,
						}),
						defaultValue: undefined,
					}),
				privacy_url: () =>
					text({
						message: generateMessage({
							identifier: command.PRIVACY_URL.identifier,
							desc: command.PRIVACY_URL.desc,
							attr: command.PRIVACY_URL.attr,
						}),
						defaultValue: undefined,
					}),
				terms_url: () =>
					text({
						message: generateMessage({
							identifier: command.TERMS_URL.identifier,
							desc: command.TERMS_URL.desc,
							attr: command.TERMS_URL.attr,
						}),
						defaultValue: undefined,
					}),
				is_show_kinde_branding: () =>
					text({
						message: generateMessage({
							identifier: command.IS_SHOW_KINDE_BRANDING.identifier,
							desc: command.IS_SHOW_KINDE_BRANDING.desc,
							attr: command.IS_SHOW_KINDE_BRANDING.attr,
						}),
						defaultValue: undefined,
					}),
				is_click_wrap: () =>
					text({
						message: generateMessage({
							identifier: command.IS_CLICK_WRAP.identifier,
							desc: command.IS_CLICK_WRAP.desc,
							attr: command.IS_CLICK_WRAP.attr,
						}),
						validate(value) {
							if (value !== "true" && value !== "false")
								return "Value should be true or false";
						},
					}),
				partner_code: () =>
					text({
						message: generateMessage({
							identifier: command.PARTNER_CODE.identifier,
							desc: command.PARTNER_CODE.desc,
							attr: command.PARTNER_CODE.attr,
						}),
						defaultValue: undefined,
					}),
			},
			onCancelCallback
		);

		return values;
	}
}

export default Business;
