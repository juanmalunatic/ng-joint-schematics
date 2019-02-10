// Build schema.ts files from schema.json files with typescript interfaces
import { compileFromFile } from 'json-schema-to-typescript';
import { writeFileSync } from 'fs';
import { join } from 'path';
import * as npm from 'npm';

const schematics = ['shape'];

for (const schematic of schematics) {
    compileFromFile(join(schematic, 'schema.json'))
        .then(ts => writeFileSync('schema.d.ts', ts));
        npm.config
}
