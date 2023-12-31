import colors from "picocolors";

export const removeOptionalNullProperties = (obj: Record<string, unknown>) => {
	let temp = {} as typeof obj;
	for (let property in obj) {
		let key = property as keyof typeof obj;
		if (obj[key] && obj[key] !== undefined) {
			temp[key] = obj[key];
		}
	}

	return temp;
};

interface GenerateMessage {
	key: `${string}`;
	desc: `${string}`;
	attr: "optional" | "required";
}
export const generateMessage = ({ key, desc, attr }: GenerateMessage) =>
	`${colors.green(`${key}:`)} ${colors.blue(`(${desc})`)} ${colors.green(
		`[${attr}]`
	)}`;
// `${key} ${colors.blue(`${desc}`)} ${colors.green(`${attr}`)}`;
