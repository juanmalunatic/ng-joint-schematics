// Build schema.ts files from schema.json files with typescript interfaces
import { compileFromFile } from 'json-schema-to-typescript';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import * as Collection from '@angular-devkit/schematics/collection-schema';

const jsonCollectionFile = join(__dirname, 'collection.json');
const data = readFileSync(jsonCollectionFile, 'utf-8');
const collection: Collection.Schema = JSON.parse(data);
console.log(collection);

for (const schematic in collection.schematics) {
        const jsonSchemaPath = join(__dirname, 'schemas');
        const jsonSchemaFile = join(jsonSchemaPath, schematic + '-schema.json');
        const srcSchemaFile = join(jsonSchemaPath, schematic + '-schema.d.ts');
        compileFromFile(jsonSchemaFile)
                .then(tsSchemaInterface => {
                        writeFileSync(srcSchemaFile, tsSchemaInterface);
                });
}