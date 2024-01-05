import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// export const isValidConfig = (data: string) => {
// 	try {
// 		let config = JSON.parse(data);
// 		return true;
// 	} catch (e) {
// 		return false;
// 	}
// };

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

		let configFile = await new Promise<string>((resolve, reject) => {
			fs.readFile(path.join(configPath), (err, data) => {
				if (err) {
					return reject(err);
				}

				return resolve(data.toString("utf8"));
			});
		});

		return configFile;
	} catch (err) {
		return null;
	}
}

export async function writeGlobalConfig<T>(data: T) {
	try {
		let rootDirectory = rootDirectoryPath();

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

export async function clearGlobalConfig() {
	try {
		const configPath = await getGlobalConfigPath();

		let deleted = await new Promise<boolean>((resolve, reject) => {
			fs.unlink(configPath, (err) => {
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
