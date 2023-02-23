import execa = require('execa');
import { readdirSync } from 'fs';

export default async function (path: string) {
    try {
        const files = readdirSync(path);
        if (files.indexOf('composer.json') === -1) {
            return false;
        }
        const { stdout, stderr } = await execa(`composer`, ['-d', path, 'validate', '--no-ansi']);
        if (stderr !== undefined) {
            return stderr.indexOf('./composer.json is valid') !== -1;
        }
        return stdout.indexOf('./composer.json is valid') !== -1;
    } catch (e) {
        console.log(e);
        return false;
    }
}
