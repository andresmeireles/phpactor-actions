import path = require('path');
import * as vscode from 'vscode';

export default function (): string | 'none' {
    const workspaces = vscode.workspace.workspaceFolders;
    if (workspaces === null || workspaces?.length === 0) {
        return 'none';
    }
    const activeEditorPath = vscode.window.activeTextEditor?.document.uri.path ?? 'none';
    if (activeEditorPath === 'none') return 'none';

    const matchingWorkspace = workspaces?.find((wsFolder) => {
        const relative = path.relative(wsFolder.uri.fsPath, activeEditorPath);
        return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
    });

    if (matchingWorkspace === undefined) return 'none';

    return matchingWorkspace.uri.fsPath;
}
