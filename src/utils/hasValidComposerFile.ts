import execa = require('execa');
import { readdirSync } from 'fs';

export default async function (path: string) {
    try {
        const files = readdirSync(path);
        if (files.indexOf('composer.json') === -1) {
            return false;
        }
        const { stdout, stderr } = await execa(`composer`, ['-d', path, 'validate', '--no-ansi']);
        return stdout.includes('composer.json is valid') || stderr.includes('composer.json is valid');
    } catch (e: any) {
        if (typeof e !== 'object') return false;
        console.warn(e);
        const {stdout, stderr} = e;
        console.log(stdout, stderr);
        return stdout.includes('composer.json is valid') || stderr.includes('composer.json is valid');
    }
}