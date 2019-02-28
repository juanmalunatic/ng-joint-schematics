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
import { _QUOTE_, _DOUBLE_QUOTE, _SPACES_, _COMMA_ } from '../../ng-joint-config';
import { resolveOptionPaths } from '../../ng-joint-paths';
import { getSchematicsData } from '../../ng-joint-schematics-data';
import { Schema } from '../../schemas/ng-joint-build-schema';
import { CliCmdChain } from './build-utils';

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
        const shapeTypes = schematicsData.shapes;
        const generateParm = 'g';
        const schematicsParm = 'ng-joint-schematics';
        const elementSchematicsParm = schematicsParm + ':' + 'element';
        const linkSchematicsParm = schematicsParm + ':' + 'link';
        const projectParm = '--project=' + options.project;
        let cmdChain: CliCmdChain = [];
        
        for (const shapeType in shapeTypes) {

            const elements = shapeTypes[shapeType].elements;
            for (const element in elements) {
                cmdChain.push(
                    [
                        generateParm, elementSchematicsParm, shapeType, element, projectParm
                    ]
                );
            }

            const links = shapeTypes[shapeType].links;
            for (const link in links) {
                cmdChain.push(
                    [
                        generateParm, linkSchematicsParm, shapeType, link, projectParm
                    ]
                );
            }

        }

        // convert JavaObject-array to String
        options.ngCliCmdChain = '[\n';
        for (const cmd of cmdChain) {
            options.ngCliCmdChain += _SPACES_ + JSON.stringify(cmd) + ',\n'
        }
        options.ngCliCmdChain += ']';

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
