// Node Imports
import { resolve } from 'path';
// import * as rmdirRecursive from 'fs-rmdir-recursive';
import rmdirRecursive = require('fs-rmdir-recursive');

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
      buildPath = buildDefaultPath(project);
    }
  
    if (options.schematicsDataFile === '' || options.schematicsDataFile === undefined) {
      options.schematicsDataFile = '.' + resolve(buildPath, '..', 'ng-joint-schematics-data.json');
    }
  
    const location = parseName(buildPath, options.name);
    options.name = location.name;
    options.path = location.path;
  
  }

  export function removeDirPath(dirPath: string) {
    rmdirRecursive(dirPath);
  }
