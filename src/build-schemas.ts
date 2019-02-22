// Build schema.ts files from schema.json files with typescript interfaces
import { compileFromFile } from 'json-schema-to-typescript';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import * as Collection from '@angular-devkit/schematics/collection-schema';

const jsonCollectionFile = join(__dirname, 'collection.json');
const data = readFileSync(jsonCollectionFile, 'utf-8');
const collection: Collection.Schema = JSON.parse(data);

for (const schematic in collection.schematics) {
        if (collection.schematics[schematic].schema) {
                // schema exists
                const jsonSchemaFile = join(__dirname, collection.schematics[schematic].schema || '');
                const tsDefSchemaFile = jsonSchemaFile.split('.json')[0] + '.d.ts';

                compileFromFile(jsonSchemaFile)
                        .then(tsSchemaInterface => {
                                writeFileSync(tsDefSchemaFile, tsSchemaInterface);
                        });
        }
}