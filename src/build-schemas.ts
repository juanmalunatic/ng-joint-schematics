// Build schema.ts files from schema.json files with typescript interfaces
import { compileFromFile } from 'json-schema-to-typescript';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import * as Collection from '../node_modules/@angular-devkit/schematics/collection-schema';

const schematics = 'ng-joint-schematics';
const jsonCollectionFile = join(__dirname, 'collection.json');
const data = readFileSync(jsonCollectionFile, 'utf-8');
const collection: Collection.Schema = JSON.parse(data);

for (const schematic in collection.schematics) {
        const jsonSchemaPath = join(__dirname, schematics, schematic);
        const jsonSchemaFile = join(jsonSchemaPath, 'schema.json');
        const srcSchemaFile = join(jsonSchemaPath, 'schema.d.ts');
        compileFromFile(jsonSchemaFile)
                .then(tsSchemaInterface => {
                        writeFileSync(srcSchemaFile, tsSchemaInterface);
                });
}
