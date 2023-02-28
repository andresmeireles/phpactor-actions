import * as vscode from 'vscode';
import { PHPACTOR_ACTIONS_EMPTY_FILE } from '../diagnostics/empty';
import { generates } from '../extension';
import { ActionInterface, ConfigInterface } from '../interfaces';

/**
 * Provides code actions corresponding to diagnostic problems.
 */
export default class GenerateFiles implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.CodeAction[] {
        const { enabled } = vscode.workspace.getConfiguration().get('phpactor-action') as ConfigInterface;
        if (!enabled) return [];
        // for each diagnostic entry that has the matching `code`, create a code action command
        const diagnostic = context.diagnostics.find((diagnostic) => diagnostic.code === PHPACTOR_ACTIONS_EMPTY_FILE);
        if (diagnostic === undefined) {
            return [];
        }
        return generates.map((generate) => this.createCommandCodeAction(diagnostic, generate));
    }

    private createCommandCodeAction(diagnostic: vscode.Diagnostic, generate: ActionInterface): vscode.CodeAction {
        const { name } = generate;
        const action = new vscode.CodeAction(`Generate ${name}`, vscode.CodeActionKind.QuickFix);
        action.command = {
            command: `phpactor-action.${name}`,
            title: `Generate a ${name} file`,
        };
        action.diagnostics = [diagnostic];
        // action.isPreferred = true;
        return action;
    }
}
