import {
	intro,
	outro,
	select,
	text,
	group,
	spinner,
	isCancel,
	cancel,
	confirm,
} from "@clack/prompts";
// // import { createPermissionQuestion } from "./questions/permissions";
// import { createAuthQuestion } from "./questions/auth";
import { Command } from "commander";
import colors from "picocolors";
import packageJson from "../package.json";
import Permission from "./questions/permissions";

import axios from "axios";
import Authentication from "./questions/auth";
import Context from "./lib/context";
import { createRootDirectory } from "./utils/storage";

// // intro(`Kinde Auth, easy drop in auth for your needs`);

// // Do stuff
// // outro(`You're all set!`);

// const s = spinner();

// // Kinde dashboard functions

// // 1. Permissions = create, update, delete, list
// // 2. Roles = create, update, delete, list
// // 3. Business = list, update

// const wait = (time: number) => {
// 	return new Promise((resolve) => {
// 		return setTimeout(resolve, time);
// 	});
// };

// // async function Run() {
// // 	const requestAuth = await group(createAuthQuestion);
// // 	s.start("Authenticating...");

// // 	await wait(1000);

// // 	// const shouldContinue = await confirm({
// // 	// 	message: "Do you want to continue?",
// // 	// });

// // 	// Do installation
// // 	s.stop("Verified...");

// // 	const createPermission = await group(createPermissionQuestion);
// // 	console.log(createPermission);
// // }

// // Run();
createRootDirectory().then((d) => console.log("Root Directory Created at:", d));
const program = new Command();

program
	.name("kinde-cli")
	.option("--v", "version")
	.description("A cli to manage your Kinde projects and workspace")
	.version(packageJson.version);

new Authentication(program);
new Permission(program);

program.parse();
