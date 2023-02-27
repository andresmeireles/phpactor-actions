import * as vscode from 'vscode';

export default class Copy implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
        if (this.isValidFile(document)) {
            return;
        }
    }

    private isValidFile(document: vscode.TextDocument): bool {
        const classDeclaration = [];
        const namespaceDeclaration = [];
        for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
            const line = document.lineAt(lineIndex);
            const text = line.text;
            const classTextPosition = line.text.indexOf('class');
            if (
                (classTextPosition - 1 === -1 || text.at(classTextPosition - 1) !== ' ') &&
                text.at(classTextPosition + 1) === ' '
            ) {
                classDeclaration.push(line);
            }
            const namespaceTextPosition = line.text.indexOf('namespace');
            if (
                (namespaceTextPosition - 1 === -1 || text.at(namespaceTextPosition - 1) !== ' ') &&
                text.at(namespaceTextPosition + 1) === ' '
            ) {
                namespaceDeclaration.push(line);
            }
        }
    }
}
