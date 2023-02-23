# PhpActor Action

<p align="center">
<img src="images/PA.jpg" alt="MarineGEO circle logo" style="height: 250px; width:250px;"/>
</p>

A simple plugin to implement some [PhpActor](https://phpactor.readthedocs.io/en/master/) refactors.

**This plugins only use some refactor actions, its is not an LSP!**

**Currently, this plugin may not work on windows**

## Requirements

The `phpactor` command must be set globally or a path to command must be placed on config `phpactor-action.phpactorBinPath`.

## How use

Open command prompt `ctrl+shift+p` or `cmd+shift+p` and use commands under `Phpactor Actions` section.

## Available commands

### Generate commands
* Generate class scaffold (and override existing)
* Generate enum scaffold (and override existing)
* Generate trait scaffold (and override existing)
* Generate interface scaffold (and override existing)
* Copy a class and change its namespace (must have composer on project root to change namespace automatically)

## To be done
* Command to install phpactor

