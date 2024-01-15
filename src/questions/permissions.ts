import { axiosRequest } from "@/lib/axios";
import ctx from "@/lib/context";
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
import { prettifyAxios } from "@/utils/error";

const command: Question<"ID" | "KEY" | "NAME" | "DESCRIPTION" | "BODY"> = {
	ID: {
		identifier: "Id",
		desc: "Permission's id",
		attr: "required",
	},
	KEY: {
		identifier: "Key",
		desc: "Identifier to use in code eg blog:admin",
		attr: "optional",
	},
	NAME: {
		identifier: "Name",
		desc: "Permission's name eg blog:admin",
		attr: "optional",
	},
	DESCRIPTION: {
		identifier: "Description",
		desc: "Permission's description eg for managing blogs",
		attr: "optional",
	},
	BODY: {
		identifier: "Body",
		desc: "Permission's details",
		attr: "optional",
	},
} as const;

type PermissionArgument = {
	create: "create";
	update: "update";
	delete: "delete";
};

type PermissionAction = keyof PermissionArgument;

class Permission {
	constructor(private program: Command) {
		this.handlePermission();
	}

	private handlePermission() {
		let program = this.program;

		program
			.command("permission")
			.description(
				colors.blue(
					"Manage User Permissions. For more information, refer to: https://kinde.com/docs/user-management/user-permissions/"
				)
			)
			// .option(
			// 	"-c, --create <name>",
			// 	"create permission",
			// 	this.__createPermissionPrompts
			// )
			// .option(
			// 	"-u, --update",
			// 	"update permission",
			// 	this.__updatePermissionPrompts
			// )
			// .option("-d, --delete", "delete permission")
			.action(
				errorHandler("Auth", async (str, options) => {
					let context = ctx.getData() as ConfigData;

					let prompt = (await select({
						message: "Proceed with appropriate action",
						options: [
							{
								label: "Create Permission",
								value: "create",
							},
							{
								label: "Update Permission",
								value: "update",
							},
							{
								label: "Delete Permission",
								value: "delete",
							},
						],
					})) as PermissionAction;

					if (prompt === "create") {
						let createPermissionData = await this.__createPermissionPrompts();

						let response = await axiosRequest({
							path: `${context.normalDomain}/api/v1/permissions`,
							method: "POST",
							data: createPermissionData,
							headers: {
								Accept: "application/json",
								"Content-Type": "application/json",
								Authorization: `Bearer ${context.token.access_token}`,
							},
						});

						return prettifyAxios(response);
					}

					if (prompt === "update") {
						let updatePermission = await this.__updatePermissionPrompts();

						let response = await axiosRequest({
							path: `${context.normalDomain}/api/v1/permissions/${updatePermission.permissionId}`,
							method: "PATCH",
							data: omit("permissionId", updatePermission),
							headers: {
								Accept: "application/json",
								"Content-Type": "application/json",
								Authorization: `Bearer ${context.token.access_token}`,
							},
						});

						return prettifyAxios(response);
					}

					if (prompt === "delete") {
						let deletePermission = await this.__deletePermissionPrompts();

						let response = await axiosRequest({
							path: `${context.normalDomain}/api/v1/permissions/${deletePermission.permissionId}`,
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

	private async __createPermissionPrompts() {
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
			},
			onCancelCallback
		);

		return values;
	}
	private async __updatePermissionPrompts() {
		let values = await group(
			{
				permissionId: () =>
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
			},
			onCancelCallback
		);

		return values;
	}
	private async __deletePermissionPrompts() {
		let values = await group(
			{
				permissionId: () =>
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

export default Permission;
