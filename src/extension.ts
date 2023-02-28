import * as vscode from 'vscode';
import Copy from './actions/Copy';
import GenerateFiles from './actions/GenerateFiles';
import { copy, makeClass, makeEnum, makeInterface, makeTrait } from './commands/commands';
import { subscribeToDocumentChanges } from './diagnostics/empty';
import { ActionInterface, ConfigInterface } from './interfaces';
import { canExecute } from './utils/activable';
import hasValidComposerFile from './utils/hasValidComposerFile';
import phpActorBinIsValid from './utils/phpActorBinIsValid';
import projectDir from './utils/projectDir';

export const generates: ActionInterface[] = [
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

const actions: ActionInterface[] = [
    ...generates,
    {
        name: 'copy',
        action: copy,
    },
];

export function activate(context: vscode.ExtensionContext) {
    if (!canExecute()) return;

    console.log('Congratulations, your extension "phpactor-action" is now active!');

    const phpactorDiagnostics = vscode.languages.createDiagnosticCollection('phpactor-action');
    context.subscriptions.push(phpactorDiagnostics);

    subscribeToDocumentChanges(context, phpactorDiagnostics);

    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('php', new GenerateFiles(), {
            providedCodeActionKinds: GenerateFiles.providedCodeActionKinds,
        })
    );
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('php', new Copy(), {
            providedCodeActionKinds: Copy.providedCodeActionKinds,
        })
    );

    for (const act of actions) {
        context.subscriptions.push(
            vscode.commands.registerCommand(`phpactor-action.${act.name}`, async () => {
                const { phpactorBinPath } = vscode.workspace
                    .getConfiguration()
                    .get('phpactor-action') as ConfigInterface;
                const bin = `${phpactorBinPath.trim().length === 0 ? '' : phpactorBinPath + '/'}phpactor`;
                if (!phpActorBinIsValid(bin)) {
                    vscode.window.showErrorMessage(`Path ${bin} not exists or is invalid`);
                    return;
                }
                const projectRoot = projectDir();
                if (projectRoot === 'none') {
                    vscode.window.showErrorMessage(`File has no workspace`);
                    return;
                }
                console.log(await hasValidComposerFile(projectRoot));
                if (!(await hasValidComposerFile(projectRoot))) {
                    vscode.window.showErrorMessage(`Workspace has no valid composer.json file`);
                    return;
                }
                act.action(bin);
            })
        );
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}
