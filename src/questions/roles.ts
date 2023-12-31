import { text } from "@clack/prompts";

export const createRoleQuestion = {
	name: () => text({ message: "Give permission a name" }),
	key: () =>
		text({
			message: "Permission key",
			// placeholder: "(Generate)",
			// defaultValue: "ZIK8292-288",
		}),
	description: () => text({ message: "Give permission a description" }),
};
