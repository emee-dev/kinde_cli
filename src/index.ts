#!/usr/bin/env node

import { Command } from "commander";
import packageJson from "../package.json";
import Authentication from "./questions/auth";
import Permission from "./questions/permissions";
import { createRootDirectory } from "./utils/storage";

createRootDirectory();
const program = new Command();

program
	.name("kinde-cli")
	.option("-v, --version", "version")
	.description("A cli to manage your Kinde projects and dashboard workspace")
	.version(packageJson.version);

new Authentication(program);
new Permission(program);

try {
	program.parse(process.argv);
} catch (err) {
	let error = err as Error;
	console.log(`[Error]: ${error.message}`);
}
