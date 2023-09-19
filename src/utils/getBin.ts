import * as vscode from 'vscode';
import { ConfigInterface } from '../interfaces';
import phpActorBinIsValid from './phpActorBinIsValid';

export default function (workspace: typeof vscode.workspace): string {
    const { phpactorBinPath } = vscode.workspace.getConfiguration().get('phpactor-action') as ConfigInterface;

    const bin = `${phpactorBinPath.trim().length === 0 ? '' : phpactorBinPath + '/'}phpactor`;

    const binIsValid = phpActorBinIsValid(bin);

    if (binIsValid) {
        return bin;
    }

    return __dirname + '/../../bin/phpactor';
}
