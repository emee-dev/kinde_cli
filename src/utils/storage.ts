import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { AccessTokenConfig } from "../questions/auth";

export const rootDirectoryPath = () => {
	let dirName = ".kinde";
	let rootDirectory = path.join(os.homedir(), dirName);
	return rootDirectory;
};

async function getGlobalConfigPath() {
	return path.join(rootDirectoryPath(), "config.json");
}

export function isValidPath(path: string) {
	if (fs.existsSync(path)) {
		return true;
	} else {
		return false;
	}
}

export async function createRootDirectory() {
	let rootDirectory = rootDirectoryPath();

	try {
		// if directory does not exist, create directory
		if (!fs.existsSync(rootDirectory)) {
			rootDirectory = await new Promise<string>((resolve, reject) => {
				return fs.mkdir(path.join(rootDirectory), (err) => {
					if (err) return reject(null);

					return resolve(rootDirectory);
				});
			});
		}

		return rootDirectory;
	} catch (err) {
		return null;
	}
}

export async function readGlobalConfig() {
	try {
		const configPath = await getGlobalConfigPath();

		let configFile = await new Promise((resolve, reject) => {
			fs.readFile(path.join(configPath), (err, data) => {
				if (err) {
					return reject(err);
				}

				return resolve(data.toString());
			});
		});

		return configFile as AccessTokenConfig;
	} catch (err) {
		return null;
	}
}

export async function writeGlobalConfig<T>(data: T) {
	try {
		let rootDirectory = rootDirectoryPath();

		// // Does Directory already exist
		// if (rootDirectory) {
		// 	return null;
		// }

		let config = await new Promise<boolean>((resolve, reject) => {
			fs.writeFile(
				path.join(rootDirectory, "config.json"),
				JSON.stringify(data),
				{ encoding: "utf-8" },
				(err) => {
					if (err) {
						return reject(false);
					}

					return resolve(true);
				}
			);
		});

		return config;
	} catch (err) {
		return null;
	}
}

export async function clearGlobalConfig(path: string) {
	try {
		let deleted = await new Promise<boolean>((resolve, reject) => {
			fs.unlink(path, (err) => {
				if (err) {
					return reject(false);
				}

				return resolve(true);
			});
		});

		return deleted;
	} catch (err) {
		return null;
	}
}
