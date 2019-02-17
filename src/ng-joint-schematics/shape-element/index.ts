import { join } from 'path';
import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  MergeStrategy,
  Tree,
  apply,
  applyTemplates,
  chain,
  filter,
  mergeWith, 
  move,
  noop,
  url
} from '@angular-devkit/schematics';
import { applyLintFix } from '@schematics/angular/utility/lint-fix';

import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath, getProject } from '@schematics/angular/utility/project';

import { getShapeProperties } from '../../ng-joint-schematics-data';
import {
  buildShapeComponentInputs,
  buildShapeInterfaceProperties,
  buildJointjsImports
} from '../../ng-joint-shape-properties';
import { Schema as ShapeElementOptions } from '../../schemas/shape-element-schema';
import { 
  buildShapeTypeComponentPath,
  buildShapeTypeComponentName,
  updateShapeReferences
} from '../shape-utils';

export function ngJointShapeElementSchematics(options: ShapeElementOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    console.log(options);
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    if (!options.shapeType) {
      throw new SchematicsException('Option (shapeType) is required.');
    }
    if (!options.shapesPath) {
      throw new SchematicsException('Option (shapePath) is required.');
    }
    if (!options.generatePath) {
      throw new SchematicsException('Option (generatePath) is required.');
    }

    const project = getProject(host, options.project);

    if (options.path === undefined) {
      options.path = buildDefaultPath(project);
    }

    const shapeProperties = getShapeProperties(options);
    options.shapeComponentInputs = buildShapeComponentInputs(shapeProperties);
    options.shapeInterfaceProperties = buildShapeInterfaceProperties(shapeProperties);
    options.jointjsImports = buildJointjsImports(shapeProperties);

    options.type = !!options.type ? `.${options.type}` : '';

    const rootPath = join(options.path, options.generatePath);
    const parsedPath = parseName(rootPath, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const shapeTypeComponentPath = buildShapeTypeComponentPath(options) || '';
        
    const templateSource = apply(url('./files'), [
      options.skipTests ? filter(path => !path.endsWith('.spec.ts.template')) : noop(),
      host.exists(shapeTypeComponentPath) ? filter(path => path === buildShapeTypeComponentName(options)) : noop(),
      applyTemplates({
        ...strings,
        ...options,
      }),
      move(options.path)
    ]);

    const rule = chain([
      mergeWith(templateSource, MergeStrategy.Default),
      options.lintFix ? applyLintFix(options.path) : noop(),
      updateShapeReferences(options),
    ]);
    return rule(host, context);
  };
}
