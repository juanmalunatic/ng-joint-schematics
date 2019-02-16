import { join } from 'path';
import * as ts from 'typescript';
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
import { insertImport } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';

import { getShapeProperties } from '../../ng-joint-schematics-data';
import {
  buildShapeComponentInputs,
  buildShapeInterfaceProperties,
  buildJointjsImports
} from '../../ng-joint-shape-properties';
import { Schema as ShapeElementOptions } from '../../schemas/shape-element-schema';

export function buildShapeTypePath(options: ShapeElementOptions): string | undefined {
  if (!options.path) {
    return undefined;
  }

  return join(options.path, strings.dasherize(options.shapeType));
}

export function buildShapeTypeComponentName(options: ShapeElementOptions): string {
  return 'shape-' + strings.dasherize(options.shapeType) + '.component.ts';
}

export function buildShapeTypeComponentPath(options: ShapeElementOptions): string | undefined {
  const shapeTypePath = buildShapeTypePath(options);

  if (!shapeTypePath) {
    return undefined;
  }

  return join(shapeTypePath, buildShapeTypeComponentName(options));
}

export function addShapes(options: ShapeElementOptions): Rule {
  return (host: Tree) => {

    const shapeTypeComponentPath = buildShapeTypeComponentPath(options);

    if (shapeTypeComponentPath) {
      const text = host.read(shapeTypeComponentPath);

      if (text === null) {
        throw new SchematicsException(`File ${shapeTypeComponentPath} does not exist.`);
      }

      const sourceText = text.toString('utf-8');
      const source = ts.createSourceFile(shapeTypeComponentPath, sourceText, ts.ScriptTarget.Latest, true);
      const change = insertImport(
        source, 
        shapeTypeComponentPath, 
        strings.classify(options.shapeType) + strings.classify(options.name), 
        './' + strings.dasherize(options.name) + '/' +
        strings.dasherize(options.shapeType) + '-' + strings.dasherize(options.name));

      const recorder = host.beginUpdate(shapeTypeComponentPath);
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
      host.commitUpdate(recorder);
    }
  }
}

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
      addShapes(options),
      options.lintFix ? applyLintFix(options.path) : noop(),
    ]);
    return rule(host, context);
  };
}
