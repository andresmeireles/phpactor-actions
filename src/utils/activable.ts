import * as vscode from 'vscode';
import { ConfigInterface } from '../interfaces';

export function canExecute(): boolean {
    const langId = vscode.window.activeTextEditor?.document.languageId ?? undefined;
    const { enabled } = vscode.workspace.getConfiguration().get('phpactor-action') as ConfigInterface;
    return enabled && langId !== undefined && langId === 'php';
}
