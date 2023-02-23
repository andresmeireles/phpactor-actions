import { accessSync, constants, lstat, lstatSync } from 'fs';

export default function (bin: string): boolean {
    try {
        if (!lstatSync(bin).isFile()) return false;
        accessSync(bin, constants.X_OK);
        return true;
    } catch (e) {
        return false;
    }
}
