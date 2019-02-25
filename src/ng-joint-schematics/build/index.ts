// Angular Imports
import { resolve } from 'path';
// import { strings } from '@angular-devkit/core';
import {
    Rule,
    SchematicContext,
    chain,
    Tree,
    SchematicsException
} from '@angular-devkit/schematics';
import { buildDefaultPath, getProject } from '@schematics/angular/utility/project';
import { parseName } from '@schematics/angular/utility/parse-name';

// Dgwnu Imports
import { getSchematicsData } from '../../ng-joint-schematics-data';
import { Schema } from '../../schemas/ng-joint-build-schema';

/**
 * Joint Js Build Schematics
 * @param options
 */
export function ngJointBuildSchematics(options: Schema): Rule {
    return (host: Tree, context: SchematicContext) => {
        if (!options.project) {
            throw new SchematicsException('Option (project) is required.');
        }

        let buildPath = options.path;

        if (buildPath === undefined) {
            const project = getProject(host, options.project);
            buildPath = buildDefaultPath(project);
        }

        const rootPath = '.' + resolve(buildPath, '..');

        if (options.schematicsDataFile === '' || options.schematicsDataFile === undefined) {
            options.schematicsDataFile = resolve(rootPath, 'ng-joint-schematics-data.json');
        }

        const location = parseName(rootPath, options.name);
        options.path = location.path;

        console.log(options);

        const schematicsData = getSchematicsData(options);

        console.log(schematicsData);

        const rule = chain([]);
        return rule(host, context);
    };
}
