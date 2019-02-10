// index.ts
 
import { strings } from '@angular-devkit/core';
import {
  Rule, SchematicContext, SchematicsException, Tree,
  apply, branchAndMerge, mergeWith, template, url,
} from '@angular-devkit/schematics';
// import { Schema as ClassOptions } from './schema.json';
 
export function ngJointSchematics(_options: any /* ClassOptions */): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (!_options.name) {
      throw new SchematicsException('Option (name) is required.');
    }
 
    const templateSource = apply(
      url('./files'),
      [
        template({
          ...strings,
          ..._options,
        }),
      ]
    );
 
    const testing = tree;
    console.log(testing);
    return branchAndMerge(mergeWith(templateSource));
  };
}