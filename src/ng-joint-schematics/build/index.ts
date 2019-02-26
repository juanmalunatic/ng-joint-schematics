// To-Do
// Build commnand line exec: https://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js
import { resolve } from 'path';
// Angular Imports
import { strings } from '@angular-devkit/core';
import {
    Rule,
    SchematicContext,
    chain,
    Tree,
    SchematicsException,
    apply,
    url,
    filter,
    noop,
    applyTemplates,
    move,
    mergeWith,
    MergeStrategy
} from '@angular-devkit/schematics';
import { applyLintFix } from '@schematics/angular/utility/lint-fix';
import { parseName } from '@schematics/angular/utility/parse-name';

// Dgwnu Imports
import { _QUOTE_, _DOUBLE_QUOTE } from '../../ng-joint-config';
import { resolveOptionPaths } from '../../ng-joint-paths';
import { getSchematicsData } from '../../ng-joint-schematics-data';
import { Schema } from '../../schemas/ng-joint-build-schema';

/**
 * Joint Js Build Schematics
 * @param options
 */
export function ngJointBuildSchematics(options: Schema): Rule {
    return (host: Tree, context: SchematicContext) => {
        resolveOptionPaths(host, options);

        if (!options.path) {
            throw new SchematicsException('Option (path) is not resolved and required.');
        }

        const rootPath = '.' + resolve(options.path, '..');
        const buildLocation = parseName(rootPath, options.name);
        options.path = buildLocation.path;

        const schematicsData = getSchematicsData(options);
        const shapes = schematicsData.shapes;
        let cmdChain: string[][] = [];
        
        for (const shapeType in shapes) {
            const elements = shapes[shapeType].elements;

            for (const element in elements) {
                cmdChain.push(['g', 'ng-joint-schematics:element', shapeType, element, '--project=ng-joint']);
            }

            const links = shapes[shapeType].links;
            for (const link in links) {
                cmdChain.push(['g', 'ng-joint-schematics:element', shapeType, link, '--project=ng-joint'])
            }
        }

        let ngCliCmdChain = JSON.stringify(cmdChain);
        options.ngCliCmdChain = ngCliCmdChain.replace(_DOUBLE_QUOTE, _QUOTE_);

        const templateBuildSource = apply(url('./files'), [
            options.skipTests ? filter(path => !path.endsWith('.spec.ts.template')) : noop(),
            applyTemplates({
              ...strings,
              ...options,
            }),
            move(options.path)
          ]);

        const rule = chain([
            mergeWith(templateBuildSource, MergeStrategy.Default),
            options.lintFix ? applyLintFix(options.path) : noop(),
        ]);
        return rule(host, context);
    };
}
