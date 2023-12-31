import { group, select, text } from "@clack/prompts";
import { Command } from "commander";
import colors from "picocolors";
import { generateMessage } from "../utils";

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
			.description(colors.blue("to manage organization's permissions"))
			.option(
				"-c, --create <name>",
				"create permission",
				this.__createPermissionArguments
			)
			.option(
				"-u, --update",
				"update permission",
				this.__updatePermissionArguments
			)
			.option("-d, --delete", "delete permission")
			.action(async (str, options) => {
				const permission = options.opts() as PermissionArgument;
				let noCliArguments = Object.keys(permission).length === 0;

				if (noCliArguments) {
					let permissionAction = (await select({
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

					if (permissionAction === "create") {
						let createPermission = await this.__createPermissionArguments();

						console.log(createPermission);
					}

					if (permissionAction === "update") {
						let updatePermission = await this.__updatePermissionArguments();

						console.log(updatePermission);
					}
				}
			});
	}

	private async __createPermissionArguments() {
		let values = await group({
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
						key: "Body:",
						desc: "Permission's details",
						attr: "optional",
					}),
					defaultValue: undefined,
				}),
		});

		return values;
	}
	private async __updatePermissionArguments() {
		let values = await group({
			permissionId: () =>
				text({
					message: generateMessage({
						key: "Id",
						desc: "permission's id",
						attr: "required",
					}),

					validate(value) {
						if (!value) return "id is required";
					},
				}),
			key: () =>
				text({
					message: generateMessage({
						key: "Key",
						desc: "identifier to use in code",
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
						key: "Body:",
						desc: "Permission's details",
						attr: "optional",
					}),
					defaultValue: undefined,
				}),
		});

		return values;
	}
}

export default Permission;