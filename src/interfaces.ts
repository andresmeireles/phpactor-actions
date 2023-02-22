export interface ConfigInterface {
    phpactorBinPath: string;
    enabled: boolean;
} 

type fn = (param: string) => void | Promise<void>

export interface ActionInterface {
    name: string;
    action: fn;
}