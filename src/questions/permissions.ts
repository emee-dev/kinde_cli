import { axiosRequest } from "@/lib/axios";
import ctx from "@/lib/context";
import { group, select, text } from "@clack/prompts";
import { Command } from "commander";
import colors from "picocolors";
import { errorHandler, generateMessage, onCancelCallback } from "../utils";
import { ConfigData } from "./auth";

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
			// 	this.__createPermissionArguments
			// )
			// .option(
			// 	"-u, --update",
			// 	"update permission",
			// 	this.__updatePermissionArguments
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
						],
					})) as PermissionAction;

					if (prompt === "create") {
						let createPermissionData = await this.__createPermissionArguments();

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

						if (response.error) {
							console.error(response.error);
							return;
						}

						if ("errors" in response.data) {
							console.warn(JSON.stringify(response.data, null, 2));
						} else {
							console.log(JSON.stringify(response.data, null, 2));
						}
					}

					if (prompt === "update") {
						let updatePermission = await this.__updatePermissionArguments();

						console.log(updatePermission);
					}
				})
			);
	}

	private async __createPermissionArguments() {
		let values = await group(
			{
				key: () =>
					text({
						message: generateMessage({
							key: "Key",
							desc: "Identifier to use in code eg blog:admin",
							attr: "optional",
						}),
						defaultValue: undefined,
					}),
				name: () =>
					text({
						message: generateMessage({
							key: "Name",
							desc: "Permission's name eg blog:admin",
							attr: "optional",
						}),
						defaultValue: undefined,
					}),
				description: () =>
					text({
						message: generateMessage({
							key: "Description",
							desc: "Permission's description eg for managing blogs",
							attr: "optional",
						}),
						defaultValue: undefined,
					}),
				body: () =>
					text({
						message: generateMessage({
							key: "Body",
							desc: "Permission's details",
							attr: "optional",
						}),
						defaultValue: undefined,
					}),
			},
			onCancelCallback
		);

		return values;
	}
	private async __updatePermissionArguments() {
		let values = await group(
			{
				permissionId: () =>
					text({
						message: generateMessage({
							key: "Id",
							desc: "Permission's id",
							attr: "required",
						}),

						validate(value) {
							if (!value) return "Id is required";
						},
					}),
				key: () =>
					text({
						message: generateMessage({
							key: "Key",
							desc: "Identifier to use in code",
							attr: "optional",
						}),
						defaultValue: undefined,
					}),
				name: () =>
					text({
						message: generateMessage({
							key: "Name",
							desc: "Permission's name",
							attr: "optional",
						}),
						defaultValue: undefined,
					}),
				description: () =>
					text({
						message: generateMessage({
							key: "Description",
							desc: "Permission's description",
							attr: "optional",
						}),
						defaultValue: undefined,
					}),
				body: () =>
					text({
						message: generateMessage({
							key: "Body",
							desc: "Permission's details",
							attr: "optional",
						}),
						defaultValue: undefined,
					}),
			},
			onCancelCallback
		);

		return values;
	}
}

export default Permission;
