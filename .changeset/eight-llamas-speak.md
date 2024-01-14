---
"kinde-cli": minor
---

- Description:

Added support for user roles, you can now: create, update, and delete roles

- Usage:

Simply run "kinde-cli role" and follow the prompt

```bash
kinde-cli role
```

Refactored the command object to be better

```ts
export type Question<T extends string> = {
	[index in T]: GenerateMessage;
};
```
