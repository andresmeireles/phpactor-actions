import execa = require('execa');
import { readdirSync } from 'fs';

export default async function (path: string) {
    try {
        const files = readdirSync(path);
        if (files.indexOf('composer.json') === -1) {
            return false;
        }
        const { stdout, stderr } = await execa(`composer`, ['-d', path, 'validate', '--no-ansi']);
        if (stderr.trim().length > 1) {
            return stderr.includes('composer.json is valid');
        }
        return stdout.includes('composer.json is valid');
    } catch (e) {
        console.warn(e);
        return false;
    }
}
