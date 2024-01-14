# kinde-cli

## 1.3.0

### Minor Changes

- [#8](https://github.com/emee-dev/kinde_cli/pull/8) [`93ebbd4`](https://github.com/emee-dev/kinde_cli/commit/93ebbd4cb92cd7495642470fe132c97a6162ef25) Thanks [@emee-dev](https://github.com/emee-dev)! - - Description:

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

## 1.2.0

### Minor Changes

- [#5](https://github.com/emee-dev/kinde_cli/pull/5) [`fd7afbc`](https://github.com/emee-dev/kinde_cli/commit/fd7afbca3dd1743732308ab5386ccb835016be0a) Thanks [@emee-dev](https://github.com/emee-dev)! - Description:

  - Added the feature of deleting permission by id

  Usage:

  - Simply run "kinde-cli permission" > choose "Delete Permission" from list of options, then provide the id of permission to delete

## 1.1.0

### Minor Changes

- [#2](https://github.com/emee-dev/kinde_cli/pull/2) [`c2a88ca`](https://github.com/emee-dev/kinde_cli/commit/c2a88ca674a1b19dca5fbcc8c54847dfa38f4523) Thanks [@emee-dev](https://github.com/emee-dev)! - Added axios retry logic and refactored the command classes to be more descriptive
