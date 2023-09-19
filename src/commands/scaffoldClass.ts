import execa = require('execa');
import * as vscode from 'vscode';
import projectDir from '../utils/projectDir';

export async function makeClass(bin: string) {
    console.log(bin);

    const file = vscode.window.activeTextEditor!.document.uri.path;

    // execute command to create a file
    const { stdout } = await execa(bin, [
        'class:new',
        file,
        '-d',
        projectDir(),
        '--variant=default',
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
            '--variant=default',
            '--no-interaction',
            '--no-ansi',
            '--format=json',
            '--force',
        ]);
    }

    vscode.window.showInformationMessage('class successfully created!');
}
