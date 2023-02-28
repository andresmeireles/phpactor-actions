import * as vscode from 'vscode';

export default class Copy implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
        if (!this.isValidFile(document)) {
            console.log('this file is not valid!');
            return;
        }
        const isAt = this.atToken(document, range);
        switch (isAt) {
            case undefined:
                return;
            default:
                return [this.createCopyCommand()];
        }
    }

    private createCopyCommand(): vscode.CodeAction {
        const action = new vscode.CodeAction('Copy', vscode.CodeActionKind.Empty);
        action.command = { command: 'phpactor-action.copy', title: 'Copy class' };
        return action;
    }

    private atToken(
        document: vscode.TextDocument,
        range: vscode.Range
    ): 'class' | 'trait' | 'interface' | 'enum' | undefined {
        const start = range.start;
        const line = document.lineAt(start.line);
        if (line.text.includes('class') && !line.text.includes('stdClass')) return 'class';
        if (line.text.includes('interface')) return 'interface';
        if (line.text.includes('trait')) return 'trait';
        if (line.text.includes('enum')) return 'enum';
        return undefined;
    }

    private isValidFile(document: vscode.TextDocument): boolean {
        let tokens = 0;
        for (let line = 0; line < document.lineCount; line++) {
            const { text } = document.lineAt(line);
            if (
                this.containsExactString(text, 'namespace') ||
                this.containsExactString(text, 'class') ||
                this.containsExactString(text, 'enum') ||
                this.containsExactString(text, 'trait')
            ) {
                tokens++;
            }
        }
        return tokens > 0 && tokens < 3;
    }

    private containsExactString(str: string, match: string): boolean {
        const escapeRegExpMatch = function (s: string) {
            return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        };
        return new RegExp(`\\b${escapeRegExpMatch(match)}\\b`).test(str);
    }
}
