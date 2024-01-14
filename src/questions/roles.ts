import { axiosRequest } from "@/lib/axios";
import ctx from "@/lib/context";
import { prettifyAxios } from "@/utils/error";
import { group, select, text } from "@clack/prompts";
import { Command } from "commander";
import colors from "picocolors";
import {
    Question,
    errorHandler,
    generateMessage,
    omit,
    onCancelCallback,
} from "../utils";
import { ConfigData } from "./auth";

const command: Question<
	"ID" | "KEY" | "NAME" | "DESCRIPTION" | "BODY" | "IS_DEFAULT_ROLE"
> = {
	ID: {
		identifier: "Id",
		desc: "Role's id",
		attr: "required",
	},
	KEY: {
		identifier: "Key",
		desc: "Identifier to use in code eg blog:admin",
		attr: "optional",
	},
	NAME: {
		identifier: "Name",
		desc: "Role's name eg blog:admin",
		attr: "optional",
	},
	DESCRIPTION: {
		identifier: "Description",
		desc: "Role's description eg for managing blogs",
		attr: "optional",
	},
	BODY: {
		identifier: "Body",
		desc: "Role's details",
		attr: "optional",
	},
	IS_DEFAULT_ROLE: {
		identifier: "Is Default Role",
		desc: "Set role as default for new users",
		attr: "optional",
	},
} as const;

type RoleArgument = {
	create: "create";
	update: "update";
	delete: "delete";
};

type RoleAction = keyof RoleArgument;

class Role {
	constructor(private program: Command) {
		this.handleRole();
	}

	private handleRole() {
		let program = this.program;

		program
			.command("role")
			.description(
				colors.blue(
					"Manage User Roles. For more information, refer to: https://kinde.com/docs/user-management/user-roles/"
				)
			)
			.action(
				errorHandler("Auth", async (str, options) => {
					let context = ctx.getData() as ConfigData;

					let prompt = (await select({
						message: "Proceed with appropriate action",
						options: [
							{
								label: "Create Role",
								value: "create",
							},
							{
								label: "Update Role",
								value: "update",
							},
							{
								label: "Delete Role",
								value: "delete",
							},
						],
					})) as RoleAction;

					if (prompt === "create") {
						let createRoleData = await this.__createRolePrompts();

						let response = await axiosRequest({
							path: `${context.normalDomain}/api/v1/roles`,
							method: "POST",
							data: createRoleData,
							headers: {
								Accept: "application/json",
								"Content-Type": "application/json",
								Authorization: `Bearer ${context.token.access_token}`,
							},
						});

						return prettifyAxios(response);
					}

					if (prompt === "update") {
						let updateRoleData = await this.__updateRolePrompts();

						let response = await axiosRequest({
							path: `${context.normalDomain}/api/v1/roles/${updateRoleData.roleId}`,
							method: "PATCH",
							data: omit("roleId", updateRoleData),
							headers: {
								Accept: "application/json",
								"Content-Type": "application/json",
								Authorization: `Bearer ${context.token.access_token}`,
							},
						});

						return prettifyAxios(response);
					}

					if (prompt === "delete") {
						let deleteRoleData = await this.__deleteRolePrompts();

						let response = await axiosRequest({
							path: `${context.normalDomain}/api/v1/roles/${deleteRoleData.roleId}`,
							method: "DELETE",
							headers: {
								Accept: "application/json",
								"Content-Type": "application/json",
								Authorization: `Bearer ${context.token.access_token}`,
							},
						});

						return prettifyAxios(response);
					}
				})
			);
	}

	private async __createRolePrompts() {
		let values = await group(
			{
				key: () =>
					text({
						message: generateMessage({
							identifier: command.KEY.identifier,
							desc: command.KEY.desc,
							attr: command.KEY.attr,
						}),
						defaultValue: undefined,
					}),
				name: () =>
					text({
						message: generateMessage({
							identifier: command.NAME.identifier,
							desc: command.NAME.desc,
							attr: command.NAME.attr,
						}),
						defaultValue: undefined,
					}),
				description: () =>
					text({
						message: generateMessage({
							identifier: command.DESCRIPTION.identifier,
							desc: command.DESCRIPTION.desc,
							attr: command.DESCRIPTION.attr,
						}),
						defaultValue: undefined,
					}),
				body: () =>
					text({
						message: generateMessage({
							identifier: command.BODY.identifier,
							desc: command.BODY.desc,
							attr: command.BODY.attr,
						}),
						defaultValue: undefined,
					}),
				is_default_role: () =>
					text({
						message: generateMessage({
							identifier: command.IS_DEFAULT_ROLE.identifier,
							desc: command.IS_DEFAULT_ROLE.desc,
							attr: command.IS_DEFAULT_ROLE.attr,
						}),
						defaultValue: undefined,
					}),
			},
			onCancelCallback
		);

		return values;
	}
	private async __updateRolePrompts() {
		let values = await group(
			{
				roleId: () =>
					text({
						message: generateMessage({
							identifier: command.ID.identifier,
							desc: command.ID.desc,
							attr: command.ID.attr,
						}),
						validate(value) {
							if (!value) return "Id is required";
						},
					}),
				key: () =>
					text({
						message: generateMessage({
							identifier: command.KEY.identifier,
							desc: command.KEY.desc,
							attr: command.KEY.attr,
						}),
						defaultValue: undefined,
					}),
				name: () =>
					text({
						message: generateMessage({
							identifier: command.NAME.identifier,
							desc: command.NAME.desc,
							attr: command.NAME.attr,
						}),
						defaultValue: undefined,
					}),
				description: () =>
					text({
						message: generateMessage({
							identifier: command.DESCRIPTION.identifier,
							desc: command.DESCRIPTION.desc,
							attr: command.DESCRIPTION.attr,
						}),
						defaultValue: undefined,
					}),
				body: () =>
					text({
						message: generateMessage({
							identifier: command.BODY.identifier,
							desc: command.BODY.desc,
							attr: command.BODY.attr,
						}),
						defaultValue: undefined,
					}),
				is_default_role: () =>
					text({
						message: generateMessage({
							identifier: command.IS_DEFAULT_ROLE.identifier,
							desc: command.IS_DEFAULT_ROLE.desc,
							attr: command.IS_DEFAULT_ROLE.attr,
						}),
						defaultValue: undefined,
					}),
			},
			onCancelCallback
		);

		return values;
	}
	private async __deleteRolePrompts() {
		let values = await group(
			{
				roleId: () =>
					text({
						message: generateMessage({
							identifier: command.ID.identifier,
							desc: command.ID.desc,
							attr: command.ID.attr,
						}),
						validate(value) {
							if (!value) return "Id is required";
						},
					}),
			},
			onCancelCallback
		);

		return values;
	}
}

export default Role;
