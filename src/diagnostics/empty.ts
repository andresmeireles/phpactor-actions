import * as vscode from 'vscode';
import { ConfigInterface } from '../interfaces';
import { canExecute } from '../utils/activable';

/** Code that is used to associate diagnostic entries with code actions. */
export const PHPACTOR_ACTIONS_EMPTY_FILE = 'phpactor_actions_empty_file';

/**
 * Analyzes the text document for problems.
 * This demo diagnostic problem provider finds all mentions of 'emoji'.
 * @param doc text document to analyze
 * @param phpActorDiagnostics diagnostic collection
 */
export function refreshDiagnostics(doc: vscode.TextDocument, phpActorDiagnostics: vscode.DiagnosticCollection): void {
    const diagnostics: vscode.Diagnostic[] = [];
    if (canExecute() && doc.lineCount === 1 && doc.lineAt(0).text.trim.length === 0) {
        diagnostics.push(createDiagnostic());
    }

    phpActorDiagnostics.set(doc.uri, diagnostics);
}

function createDiagnostic(): vscode.Diagnostic {
    // create range that represents, where in the document the word is
    const range = new vscode.Range(0, 0, 0, 0);

    const diagnostic = new vscode.Diagnostic(
        range,
        'File is empty, you must generate a type of class',
        vscode.DiagnosticSeverity.Information
    );
    diagnostic.code = PHPACTOR_ACTIONS_EMPTY_FILE;
    return diagnostic;
}

export function subscribeToDocumentChanges(
    context: vscode.ExtensionContext,
    phpActorDiagnostics: vscode.DiagnosticCollection
): void {
    if (!canExecute()) return;
    if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.languageId === 'php') {
        refreshDiagnostics(vscode.window.activeTextEditor.document, phpActorDiagnostics);
    }
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                refreshDiagnostics(editor.document, phpActorDiagnostics);
            }
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument((e) => refreshDiagnostics(e.document, phpActorDiagnostics))
    );

    context.subscriptions.push(vscode.workspace.onDidCloseTextDocument((doc) => phpActorDiagnostics.delete(doc.uri)));
}
