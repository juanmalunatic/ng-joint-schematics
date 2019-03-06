// Build schema.ts files from schema.json files with typescript interfaces
import { compileFromFile } from 'json-schema-to-typescript';
import { writeFileSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import * as Collection from '@angular-devkit/schematics/collection-schema';

// Resolve source path
const srcPath = resolve(__dirname, '..', 'src');

// Compile schematic data schema's
const dataPath = join(srcPath, 'data');
compileSchemaToTypeDefinition(join(dataPath, 'data-options-schema.json'));
compileSchemaToTypeDefinition(join(dataPath, 'ng-joint-schematic-data-schema.json'));

// Compile all schema's defined in collection.json
const jsonCollectionFile = join(srcPath, 'collection.json');
const data = readFileSync(jsonCollectionFile, 'utf-8');
const collection: Collection.Schema = JSON.parse(data);

for (const schematic in collection.schematics) {
        // loop through defined schematics and create typescript definitions files
        if (collection.schematics[schematic].schema) {
                // schema is defined
                const jsonSchemaFile = join(srcPath, collection.schematics[schematic].schema || '');
                compileSchemaToTypeDefinition(jsonSchemaFile);
        }
}

/**
 * Compile json file to a d.ts file in the same path
 * @param jsonSchemaFile 
 */
function compileSchemaToTypeDefinition(jsonSchemaFile: string) {
        const tsDefSchemaFile = jsonSchemaFile.split('.json')[0] + '.d.ts';
        // create new typescript definition file with interface from json-schema
        compileFromFile(jsonSchemaFile)
                .then(tsSchemaInterface => {
                        writeFileSync(tsDefSchemaFile, tsSchemaInterface);
                        console.log(jsonSchemaFile + ' compiled to => ' + tsDefSchemaFile);
                });
}