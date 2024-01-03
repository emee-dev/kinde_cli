import { Command } from "commander";
import packageJson from "../package.json";
import Authentication from "./questions/auth";
import Permission from "./questions/permissions";
import { createRootDirectory } from "./utils/storage";

// // intro(`Kinde Auth, easy drop in auth for your needs`);
// // outro(`You're all set!`);

createRootDirectory(); /* .then((d) => console.log("Root Directory Created at:", d)); */
const program = new Command();

program
	.name("kinde-cli")
	.option("--v", "version")
	.description("A cli to manage your Kinde projects and dashboard workspace")
	.version(packageJson.version);

new Authentication(program);
new Permission(program);

program.parse();
