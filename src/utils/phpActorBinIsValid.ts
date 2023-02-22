import { statSync } from 'fs';

export default function (bin: string): boolean {
    try {
        statSync(bin);
        return true;
    } catch (e) {
        return false;
    }
}
