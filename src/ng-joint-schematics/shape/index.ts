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

// Dgwnu Imports
import {
    getElementProperties,
    getLinkProperties,
    getDefaults,
    getShapeTypeDefaults,
    NgJointClassDefinition
} from '../../ng-joint-schematics-data';
import {
  buildShapeComponentInputDecorators,
  buildShapeInterfaceProperties,
  buildShapeInterfacePropertiesImportStatements
} from '../../ng-joint-shape-properties';
import { Schema } from '../../schemas/ng-joint-shape-schema';
import { resolveOptionPaths } from '../../ng-joint-paths';
import {
  buildShapeTypeComponentFilePath,
  buildShapeTypeComponentFileName,
  updateShapeTypeComponent,
  updateShapeTypeModule,
  updateShapeTypeIndex,
  parseOptions,
  buildImportStatements
} from '../shape/shape-utils';
import { buildShapeClass } from '../../ng-joint-shape-classes';

/**
 * Update Shape Type References (imports, exports, @ContentChildren)
 * @param options 
 */
function updateShapeType(options: Schema): Rule {
  return (host: Tree) => {
    updateShapeTypeComponent(options, host);
    updateShapeTypeModule(options, host);
    updateShapeTypeIndex(options, host);
  }
}

/**
 * Joint Js Element Generation Schematics
 * @param options
 */
export function ngJointElementSchematics(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.implementation = 'element';
    const rule = ngJointShapeSchematics(options);
    return rule(host, context);
  };
}

/**
 * Joint Js Link Generation Schematics
 * @param options
 */
export function ngJointLinkSchematics(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.implementation = 'link';
    const rule = ngJointShapeSchematics(options);
    return rule(host, context);
  };
}

/**
 * Generic Joint Js Shape Generation Schematics
 * @param options
 */
export function ngJointShapeSchematics(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    resolveOptionPaths(host, options);

    if (!options.path) {
      throw new SchematicsException('Option (path) is not resolved and required.');
    }

    if (!options.shapeType) {
      throw new SchematicsException('Option (shapeType) is required.');
    }

    if (!options.shapesPath) {
      throw new SchematicsException('Option (shapesPath) is required.');
    }
  
    const defaults = getDefaults(options);
    const shapeTypeDefaults = getShapeTypeDefaults(options);

    if (!shapeTypeDefaults) {
      throw new SchematicsException('Shape type defaults are required.');
    }

    let shapeProperties = undefined;
    let shapeObjectClassDef: NgJointClassDefinition;
    let shapeOptionsClassDef: NgJointClassDefinition;

    switch (options.implementation) {
      case 'element': {
        shapeProperties = getElementProperties(options);
        shapeObjectClassDef = shapeTypeDefaults.elements.shapeObjectClass;
        shapeOptionsClassDef = shapeTypeDefaults.elements.shapeOptionsClass;
        options.ngElementRef = shapeTypeDefaults.elements.ngElementRef;
        break;
      }
      case 'link': {
        shapeProperties = getLinkProperties(options);
        shapeObjectClassDef = shapeTypeDefaults.links.shapeObjectClass;
        shapeOptionsClassDef = shapeTypeDefaults.links.shapeOptionsClass;
        options.ngElementRef = shapeTypeDefaults.links.ngElementRef;
        break;
      }
      default: {
        throw new SchematicsException('Option.implementation ${options.implementation} is not defined here.');
      }
    }

    options.shapeComponentInputDecorators = buildShapeComponentInputDecorators(shapeProperties);
    options.shapeInterfaceProperties = buildShapeInterfaceProperties(shapeProperties);
    options.shapeInterfacePropertiesImportStatements = buildShapeInterfacePropertiesImportStatements(shapeProperties, defaults.importMappings);
    options.shapeObjectClass = parseOptions(buildShapeClass(shapeObjectClassDef), options);
    options.shapeOptionsClass = parseOptions(buildShapeClass(shapeOptionsClassDef), options);

    let nameSpaces: string[] = []

    if (shapeObjectClassDef.nameSpace) { 
      nameSpaces.push(shapeObjectClassDef.nameSpace); 
    }

    if (shapeOptionsClassDef.nameSpace && shapeOptionsClassDef.nameSpace !== shapeObjectClassDef.nameSpace) {
      nameSpaces.push(shapeOptionsClassDef.nameSpace);
    }

    options.shapeClassImportStatements = buildImportStatements(nameSpaces, defaults.importMappings);
    
    const shapeTypeComponentFilePath = buildShapeTypeComponentFilePath(options) || '';
       
    const templateShapeTypeSource = apply(url('./files/shape-type'), [
      options.skipTests ? filter(path => !path.endsWith('.spec.ts.template')) : noop(),
      host.exists(shapeTypeComponentFilePath) ? filter(path => path === buildShapeTypeComponentFileName(options)) : noop(),
      applyTemplates({
        ...strings,
        ...options,
      }),
      move(options.path)
    ]);

    const templateShapeImplementationSource = apply(url('./files/shape-implementation'), [
      options.skipTests ? filter(path => !path.endsWith('.spec.ts.template')) : noop(),
      applyTemplates({
        ...strings,
        ...options,
      }),
      move(options.path)
    ]);

    const rule = chain([
      mergeWith(templateShapeTypeSource, MergeStrategy.Default),
      mergeWith(templateShapeImplementationSource, MergeStrategy.Default),
      options.lintFix ? applyLintFix(options.path) : noop(),
      updateShapeType(options),
    ]);
    return rule(host, context);
  };
}
