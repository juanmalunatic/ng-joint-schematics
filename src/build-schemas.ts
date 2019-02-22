// Build schema.ts files from schema.json files with typescript interfaces
import { compileFromFile } from 'json-schema-to-typescript';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import * as Collection from '@angular-devkit/schematics/collection-schema';

// read schematics collection
const jsonCollectionFile = join(__dirname, 'collection.json');
const data = readFileSync(jsonCollectionFile, 'utf-8');
const collection: Collection.Schema = JSON.parse(data);

for (const schematic in collection.schematics) {
        // loop through defined schematics and create typescript definitions files
        if (collection.schematics[schematic].schema) {
                // schema is defined
                const jsonSchemaFile = join(__dirname, collection.schematics[schematic].schema || '');
                const tsDefSchemaFile = jsonSchemaFile.split('.json')[0] + '.d.ts';
                // create new typescript definition file with interface from json-schema
                compileFromFile(jsonSchemaFile)
                        .then(tsSchemaInterface => {
                                writeFileSync(tsDefSchemaFile, tsSchemaInterface);
                        });
        }
}