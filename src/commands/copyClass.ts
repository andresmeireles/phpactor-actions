import execa = require('execa');
import { existsSync } from 'fs';
import { basename } from 'path';
import * as vscode from 'vscode';
import projectDir from '../utils/projectDir';

export async function copy(bin: string) {
    try {
        const { fsPath, path } = vscode.window.activeTextEditor!.document.uri;
        const fileName = basename(fsPath);
        console.log(fileName);
        const folderPath = await vscode.window.showOpenDialog({
            canSelectMany: false,
            openLabel: 'Select',
            canSelectFiles: false,
            canSelectFolders: true,
            defaultUri: vscode.Uri.file(path),
        });
        if (folderPath === undefined || folderPath.at(0) === undefined) {
            return;
        }
        const newFilePath = folderPath.at(0)!.path + `/${fileName}`;
        if (existsSync(newFilePath)) {
            const option = await vscode.window.showQuickPick(
                [
                    { label: 'Yes', description: 'Override file', value: true },
                    { label: 'No', description: 'Not Override file', value: false },
                ],
                { placeHolder: 'File already exists on folder, you want overwrite it?' }
            );
            if (option === undefined || !option.value) {
                return;
            }
        }
        const { stdout } = await execa(bin, ['class:copy', fsPath, newFilePath, '-d', projectDir()]);
        console.log(stdout);
        vscode.window.showInformationMessage('class copy successfully');
    } catch (e) {
        console.log(e);
        vscode.window.showErrorMessage('error on class copy');
    }
}
