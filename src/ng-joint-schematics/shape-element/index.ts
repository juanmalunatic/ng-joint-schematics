import { join } from 'path';
import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  applyTemplates,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  url,
} from '@angular-devkit/schematics';
import { applyLintFix } from '@schematics/angular/utility/lint-fix';

import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath, getProject } from '@schematics/angular/utility/project';

import { getShapeProperties } from '../../ng-joint-schematics-data';
import { buildShapeComponentInputs } from '../../ng-joint-shape-properties';
import { Schema as ShapeElementOptions } from './schema';

export function ngJointShapeElementSchematics(options: ShapeElementOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    if (!options.shapeType) {
      throw new SchematicsException('Option (shapeType) is required.');
    }
    if (!options.shapesPath) {
      throw new SchematicsException('Option (shapePath) is required.');
    }

    const project = getProject(host, options.project);

    if (options.path === undefined) {
      options.path = buildDefaultPath(project);
    }

    const shapeProperties = getShapeProperties(options);
    options.shapeComponentInputs = buildShapeComponentInputs(shapeProperties);

    options.type = !!options.type ? `.${options.type}` : '';

    const elementPath = join(options.path, options.shapesPath, options.shapeType, options.name);
    const parsedPath = parseName(elementPath, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;
    
    // todo remove these when we remove the deprecations
    options.skipTests = options.skipTests || !options.spec;

    const templateSource = apply(url('./files'), [
      options.skipTests ? filter(path => !path.endsWith('.spec.ts.template')) : noop(),
      applyTemplates({
        ...strings,
        ...options,
      }),
      move(parsedPath.path),
    ]);

    const rule = chain([
      branchAndMerge(mergeWith(templateSource)),
      options.lintFix ? applyLintFix(options.path) : noop(),
    ]);
    return rule(host, context);
  };
}