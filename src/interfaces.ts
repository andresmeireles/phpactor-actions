import * as vscode from 'vscode';

export interface ConfigInterface {
    phpactorBinPath: string;
    enabled: boolean;
}

export interface ActionInterface {
    name: string;
    action: (param: string) => void | Promise<void>;
}
