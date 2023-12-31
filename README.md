<!-- Update this link with your own project logo -->

# <img src="https://avatars.githubusercontent.com/u/105711507?s=300&v=4" style="width:70px;padding-right:20px;margin-bottom:-8px;"> Kinde CLI

Kinde is a

<!-- Find new badges at https://shields.io/badges -->

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PyPI](https://img.shields.io/pypi/v/readme-template-cli)](https://pypi.org/project/readme-template-cli/)

- This project contains templates you can use to write your own `README`, `CONTRIBUTING` and `PULL_REQUEST_TEMPLATE` files.
- It also includes a CLI tool for using these files in your own projects.
- Supports `pip` or `poetry` for dependency management.

[![Demo of the Read Me template command line app. It shows the user inputting their GitHub username and a repository name to generate a set of customised files useful for sharing GitHub projects.](demo.gif)](https://raw.githubusercontent.com/Cutwell/readme-template/main/demo.gif)

## Install

```sh
pip install readme-template-cli
```

## Usage

```sh
readme [-h] [--test] [--force]
```

|      Flag      |                                                      Description                                                      |
| :------------: | :-------------------------------------------------------------------------------------------------------------------: |
| `-h`, `--help` |                                           Show this help message and exit.                                            |
|    `--test`    | Run in test mode - files created have .test extension. This does not update filename references inside the templates. |
|   `--force`    |                                            Force overwrite existing files.                                            |

## Run locally

### Install dependencies

If using `pip`:

```sh
pip install -r requirements.txt
```

If using `poetry`:

```sh
poetry install --without dev
```

### Usage

Run the program from the command line (from the project root) like this:

If using `pip`:

```sh
python3 readme_generator/src/generator.py
```

If using `poetry`:

```sh
poetry run readme
```

## Contributing

<!-- Remember to update the links in the `.github/CONTRIBUTING.md` file from `Cutwell/readme-template` to your own username and repository. -->

For information on how to set up your dev environment and contribute, see [here](.github/CONTRIBUTING.md).

## License

MIT
