// Build schema.ts files from schema.json files with typescript interfaces
import { compileFromFile } from 'json-schema-to-typescript';
import { writeFileSync } from 'fs';
import { join } from 'path';

const collection = 'ng-joint-schematics';
const schematics = ['shape'];

for (const schematic of schematics) {
        const jsonSchemaPath = join(__dirname, collection, schematic);
        const jsonSchemaFile = join(jsonSchemaPath, 'schema.json');
        const srcSchemaFile = join(jsonSchemaPath, 'schema.d.ts');
        compileFromFile(jsonSchemaFile)
                .then(tsSchemaInterface => {
                        writeFileSync(srcSchemaFile, tsSchemaInterface);
                });
}
