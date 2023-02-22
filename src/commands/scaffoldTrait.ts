import execa = require('execa');
import * as vscode from 'vscode';
import projectDir from '../utils/projectDir';

export async function makeTrait(bin: string) {
    const file = vscode.window.activeTextEditor!.document.uri.path;
    const { stdout } = await execa(bin, [
        'class:new',
        file,
        '-d',
        projectDir(),
        '--variant=trait',
        '--no-interaction',
        '--no-ansi',
        '--format=json',
    ]);
    const { exists } = JSON.parse(stdout);
    if (exists) {
        const option = await vscode.window.showQuickPick(
            [
                { label: 'Yes', description: 'Override file', value: true },
                { label: 'No', description: 'Not Override file', value: false },
            ],
            { placeHolder: 'Override file?' }
        );
        if (option === undefined) return;
        const { value } = option;
        if (!value) {
            return;
        }
        await execa(bin, [
            'class:new',
            file,
            '-d',
            projectDir(),
            '--variant=trait',
            '--no-interaction',
            '--no-ansi',
            '--format=json',
            '--force',
        ]);
    }
    vscode.window.showInformationMessage('class successfully created!');
}
