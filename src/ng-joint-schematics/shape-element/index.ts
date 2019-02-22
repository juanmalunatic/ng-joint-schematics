// Node Imports
import { join } from 'path';

// Angular Imports
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

// Dgwnu Imports
import { getElementProperties } from '../../ng-joint-schematics-data';
import {
  buildShapeComponentInputs,
  buildShapeInterfaceProperties,
  buildJointjsImports
} from '../../ng-joint-shape-properties';
import { Schema } from '../../schemas/ng-joint-shape-schema';
import { 
  buildShapeTypeComponentFilePath,
  buildShapeTypeComponentFileName,
  updateShapeTypeComponent,
  updateShapeTypeModule,
  updateShapeTypeIndex
} from '../shape-utils';

/**
 * Update Element references (imports, exports, @ContentChildren) in shared shape type code
 * @param options 
 */
function updateElementType(options: Schema): Rule {
  return (host: Tree) => {
    updateShapeTypeComponent(options, host);
    updateShapeTypeModule(options, host);
    updateShapeTypeIndex(options, host);
  }
}

export function ngJointShapeElementSchematics(options: Schema): Rule {
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
    if (!options.generatePath) {
      throw new SchematicsException('Option (generatePath) is required.');
    }

    const project = getProject(host, options.project);

    if (options.path === undefined) {
      options.path = buildDefaultPath(project);
    }

    const elementProperties = getElementProperties(options);
    options.shapeComponentInputs = buildShapeComponentInputs(elementProperties);
    options.shapeInterfaceProperties = buildShapeInterfaceProperties(elementProperties);
    options.jointjsImports = buildJointjsImports(elementProperties);

    options.type = !!options.type ? `.${options.type}` : '';

    const rootPath = join(options.path, options.generatePath);
    const parsedPath = parseName(rootPath, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const shapeTypeComponentFilePath = buildShapeTypeComponentFilePath(options) || '';
        
    const templateSource = apply(url('./files'), [
      options.skipTests ? filter(path => !path.endsWith('.spec.ts.template')) : noop(),
      host.exists(shapeTypeComponentFilePath) ? filter(path => path === buildShapeTypeComponentFileName(options)) : noop(),
      applyTemplates({
        ...strings,
        ...options,
      }),
      move(options.path)
    ]);

    const rule = chain([
      mergeWith(templateSource, MergeStrategy.Default),
      options.lintFix ? applyLintFix(options.path) : noop(),
      updateElementType(options),
    ]);
    return rule(host, context);
  };
}
