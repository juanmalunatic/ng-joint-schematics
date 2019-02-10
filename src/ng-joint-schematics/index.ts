import { normalize } from 'path';
import { strings } from '@angular-devkit/core';
import {
  Rule, SchematicContext, SchematicsException, Tree, apply, mergeWith, template, 
  url, move, noop, filter, MergeStrategy
} from '@angular-devkit/schematics';

import { setupOptions } from './setup';

export function ngJointShapeSchematics(options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        if (!options.name) {
            throw new SchematicsException('Option (name) is required.');
        }

        setupOptions(tree, options);

        const movePath = (options.flat) ?
            normalize(options.path) :
            normalize(options.path + '/' + strings.dasherize(options.name));

        const templateSource = apply(url('./files'), [
            options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
            template({
                ...strings,
                ...options,
            }),
            move(movePath),
        ]);

        const rule = mergeWith(templateSource, MergeStrategy.Default);
        return rule(tree, _context);
    };
}