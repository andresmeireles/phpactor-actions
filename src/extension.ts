import execa = require('execa');
import { readdirSync, statSync } from 'fs';
import path = require('path');
import * as vscode from 'vscode';
import { makeClass } from './commands/scaffoldClass';
import { makeEnum } from './commands/scaffoldEnum';
import { makeInterface } from './commands/scaffoldInterface';
import { makeTrait } from './commands/scaffoldTrait';
import { ActionInterface, ConfigInterface } from './interfaces';
import hasValidComposerFile from './utils/hasValidComposerFile';
import phpActorBinIsValid from './utils/phpActorBinIsValid';
import projectDir from './utils/projectDir';

const actions: ActionInterface[] = [
    {
        name: 'class',
        action: makeClass,
    },
    {
        name: 'interface',
        action: makeInterface,
    },
    {
        name: 'enum',
        action: makeEnum,
    },
    {
        name: 'trait',
        action: makeTrait,
    },
];

export function activate(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration().get('phpactor-action') as ConfigInterface;
    if (!config.enabled) return;

    console.log('Congratulations, your extension "phpactor-action" is now active!');

    for (const act of actions) {
        const disposable = vscode.commands.registerCommand(`phpactor-action.${act.name}`, async () => {
            const configPath = config.phpactorBinPath;
            const bin = `${configPath.trim().length === 0 ? '' : configPath + '/'}phpactor`;
            if (!phpActorBinIsValid(bin)) {
                vscode.window.showErrorMessage(`Path ${bin} not exists or is invalid`);
                return;
            }
            const projectRoot = projectDir();
            if (projectRoot === 'none') {
                vscode.window.showErrorMessage(`File has no workspace`);
                return;
            }
            if (!(await hasValidComposerFile(projectRoot))) {
                vscode.window.showErrorMessage(`Workspace has no valid composer.json file`);
                return;
            }
            act.action(bin);
        });
        context.subscriptions.push(disposable);
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}
