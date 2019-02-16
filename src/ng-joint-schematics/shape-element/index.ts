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
  url
} from '@angular-devkit/schematics';
import { applyLintFix } from '@schematics/angular/utility/lint-fix';

import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath, getProject } from '@schematics/angular/utility/project';
import { /* buildRelativePath, */ findModuleFromOptions } from '@schematics/angular/utility/find-module';

import { getShapeProperties } from '../../ng-joint-schematics-data';
import {
  buildShapeComponentInputs,
  buildShapeInterfaceProperties,
  buildJointjsImports
} from '../../ng-joint-shape-properties';
import { Schema as ShapeElementOptions } from '../../schemas/shape-element-schema';

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

    options.module = findModuleFromOptions(host, options);
    console.log('options.module', options.module);

    const shapeProperties = getShapeProperties(options);
    options.shapeComponentInputs = buildShapeComponentInputs(shapeProperties);
    options.shapeInterfaceProperties = buildShapeInterfaceProperties(shapeProperties);
    options.jointjsImports = buildJointjsImports(shapeProperties);

    options.type = !!options.type ? `.${options.type}` : '';

    const rootPath = join(options.path, options.generatePath);
    const parsedPath = parseName(rootPath, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;
    
    const templateSource = apply(url('./files'), [
      options.skipTests ? filter(path => !path.endsWith('.spec.ts.template')) : noop(),
      applyTemplates({
        ...strings,
        ...options,
      }),
      move(options.path),
    ]);

    const rule = chain([
      branchAndMerge(mergeWith(templateSource)),
      options.lintFix ? applyLintFix(options.path) : noop(),
    ]);
    return rule(host, context);
  };
}