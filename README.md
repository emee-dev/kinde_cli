<!-- Update this link with your own project logo -->

# <img src="https://avatars.githubusercontent.com/u/105711507?s=300&v=4" style="width:70px;padding-right:20px;margin-bottom:-8px;"> Kinde CLI

Kinde is an alternative way of doing auth, kind of like clerk but better because it's been built with developers and startups in mind, save costs and achieve more free up 10,500 users. [Kinde](https://kinde.com)

<!-- Find new badges at https://shields.io/badges -->

This CLI all the functionality for Kinde

[x] Authentication & Access Token

- [ ] Users
  - [ ] Refresh User Claim
  - [ ] Get User
  - [ ] Create User
  - [ ] Update User
  - [ ] Delete User
  - [ ] Update User Feature Flag
- [x] Permissions
  - [ ] List Permission
  - [x] Create Permission
  - [x] Update Permission
  - [ ] Delete Permission
- [x] Roles
  - [ ] List Roles
  - [x] Create Roles
  - [x] Update Roles
  - [ ] Delete Roles

[![Demo of the Read Me template command line app. It shows the user inputting their GitHub username and a repository name to generate a set of customised files useful for sharing GitHub projects.](demo.gif)](https://raw.githubusercontent.com/Cutwell/readme-template/main/demo.gif)

## Getting Started

On your Kinde dashboard, create a new application call it CLI for convienience and choose Machine to Machine (M2M) option then click save to continue and then tab on the left click on API(s) then enable the api to connect this application to; copy your domain, client id and client secret you will need this to login.

[Applications view]()
[Add New M2M Application]()
[Enable Api]()
[Click Application Details]()
[Copy your Details]()

### Install the CLI

Available on NPM. To install:

```bash copy
npm install -g kinde-cli
```

## Usage

```bash
kinde-cli --help
```

|      Flag      |           Description            |
| :------------: | :------------------------------: |
| `-h`, `--help` | Show this help message and exit. |

### Usage

Run the program from the command line (from the project root) like this:

```bash
kinde-cli login
```

Manage your permissions

```bash
kinde-cli permission
```

Manage your roles

```bash
kinde-cli role
```

## Contributing

<!-- Remember to update the links in the `.github/CONTRIBUTING.md` file from `Cutwell/readme-template` to your own username and repository. -->

For information on how to use Kinde please consult their documentation

## License

MIT
