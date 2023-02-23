import execa = require('execa');
import { readdirSync } from 'fs';

export default async function (path: string) {
    try {
        const files = readdirSync(path);
        if (files.indexOf('composer.json') === -1) {
            return false;
        }
        const { stdout } = await execa(`composer`, ['-d', path, 'validate', '--no-ansi']);
        return stdout.indexOf('./composer.json is valid') !== -1;
    } catch (e) {
        console.log(e);
        return false;
    }
}
