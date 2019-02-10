// Build schema.ts files from schema.json files with typescript interfaces
import { compileFromFile } from 'json-schema-to-typescript';
import { writeFileSync } from 'fs';
import { join } from 'path';

const collection = 'ng-joint-schematics';
const schematics = ['shape'];

for (const schematic of schematics) {
        const jsonSchemaFilePath = join(__dirname, collection, schematic, 'schema');
        console.log('jsonSchemaFilePath', jsonSchemaFilePath);
        compileFromFile(jsonSchemaFilePath + '.json')
                .then(tsSchemaInterface => {
                        writeFileSync(jsonSchemaFilePath + '.d.ts', tsSchemaInterface);
                });
}
