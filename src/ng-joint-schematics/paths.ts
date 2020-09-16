// Node Imports
import { resolve } from 'path';

// Angular Imports
import {
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import { buildDefaultPath, getProject } from '@schematics/angular/utility/project';
import { parseName } from '@schematics/angular/utility/parse-name';

/**
 * Resolve Options with Paths
 * @param host
 * @param options
 */
export function resolveOptionPaths(
    host: Tree,
    options: {
        name: string,
        project: string,
        path?: string,
        schematicsDataFile?: string
    }
) {

    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }

    let buildPath = options.path;

    if (buildPath === undefined) {
      const project = getProject(host, options.project);

      try {
        // This errors in the sibling configuration
        buildPath = buildDefaultPath(project);
      } catch (e) {
        // Execution ignores this and jumps to finally.
      } finally {
        const burntPath = 'projects/ng-joint/src/';
        options.schematicsDataFile = burntPath + 'ng-joint-schematics-data.json';
        buildPath = burntPath + 'lib/'; // This is the location of schematic-generated
      }
    }

    if (options.schematicsDataFile === '' || options.schematicsDataFile === undefined) {
      options.schematicsDataFile = '.' + resolve(buildPath, '..', 'ng-joint-schematics-data.json');
    }

    const location = parseName(buildPath, options.name);
    options.name = location.name;
    options.path = location.path;

}
