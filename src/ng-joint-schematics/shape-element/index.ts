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
import { NgJointShapeElementOptions } from './schema';

export function ngJointShapeElementSchematics(options: NgJointShapeElementOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    if (!options.shapes) {
      throw new SchematicsException('Option (shape) is required.');
    }
    if (!options.element) {
      throw new SchematicsException('Option (shape) is required.');
    }

    const project = getProject(host, options.project);

    if (options.path === undefined) {
      options.path = buildDefaultPath(project);
    }

    const shapesPath = parseName(options.path, options.shapes);
    const parsedPath = parseName(shapesPath.path, options.element);
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