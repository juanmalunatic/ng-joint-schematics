/**
 * @dgwnu/ngschematics shape utils to create and update shape dependencies
 * 
 * Based on @angular/cli/schematics/angular/component:
 * 
 * https://github.com/angular/angular-cli/blob/master/packages/schematics/angular/component/index.ts
 */
import { join } from 'path';
import * as ts from 'typescript';
import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';

import {
  insertImport,
  findNodes,
  insertAfterLastOccurrence,
  addImportToModule
} from '@schematics/angular/utility/ast-utils';
import { InsertChange, Change } from '@schematics/angular/utility/change';

/**
 * Shape type options Interface
 */
interface ShapeOptions {
    path?: string;
    shapesPath?: string;
    shapeType?: string;
    name: string;
}

/**
 * Build path where the shape type files are located
 * @param options 
 */
export function buildShapeTypePath(options: ShapeOptions): string | undefined {
    if (!options.path || !options.shapeType) {
      return undefined;
    }

    return join(options.path, strings.dasherize(options.shapeType));
  }

/**
 * Build shape type file name prefix
 * @param options
 */  
function buildShapeTypeFileNamePrefix(options: ShapeOptions): string | undefined {
  if (!options.shapesPath || !options.shapeType) {
    return undefined;
  }

  return strings.dasherize(options.shapesPath)  + '-' + strings.dasherize(options.shapeType);
}

/**
 * Build shape type component file name
 * @param options
 */  
export function buildShapeTypeComponentFileName(options: ShapeOptions): string | undefined {
    const shapeFileNamePrefix = buildShapeTypeFileNamePrefix(options);

    if (!shapeFileNamePrefix) {
      return undefined;
    }

    return shapeFileNamePrefix + '.component.ts';
}

/**
 * Build shape type module file name
 * @param options
 */  
export function buildShapeTypeModuleFileName(options: ShapeOptions): string | undefined {
  const shapeFileNamePrefix = buildShapeTypeFileNamePrefix(options);

  if (!shapeFileNamePrefix) {
    return undefined;
  }

  return shapeFileNamePrefix + '.module.ts';
}

/**
 * Build file path to shape type component
 * @param options 
 */
export function buildShapeTypeComponentFilePath(options: ShapeOptions): string | undefined {
    const shapeTypePath = buildShapeTypePath(options);
    const componentName = buildShapeTypeComponentFileName(options)
  
    if (!shapeTypePath || !componentName) {
      return undefined;
    }
  
    return join(shapeTypePath, componentName);
}

/**
 * Build file path to shape type module
 * @param options 
 */
export function buildShapeTypeModuleFilePath(options: ShapeOptions): string | undefined {
  const shapeTypePath = buildShapeTypePath(options);
  const moduleName = buildShapeTypeModuleFileName(options)

  if (!shapeTypePath || !moduleName) {
    return undefined;
  }

  return join(shapeTypePath, moduleName);
}

function commitChanges(host: Tree, changes: Change[], path: string) {
  const recorder = host.beginUpdate(path);
  for (const change of changes) {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(recorder);  
}

/**
 * update shape references (imports, exports, @ContentChildren) in shape type files (odule and component)
 * @param options 
 */
function updateShapeTypeComponent(options: ShapeOptions, host: Tree) {
  
  const shapeTypeComponentPath = buildShapeTypeComponentFilePath(options);
  
  if (shapeTypeComponentPath && options.shapeType) {
    // Initialize Update (shapeType).component file
    const text = host.read(shapeTypeComponentPath);
  
    if (text === null) {
      throw new SchematicsException(`File ${shapeTypeComponentPath} does not exist.`);
    }
  
    const sourceText = text.toString('utf-8');
    const source = ts.createSourceFile(shapeTypeComponentPath, sourceText, ts.ScriptTarget.Latest, true);
    const shapeClass = strings.classify(options.shapeType) + strings.classify(options.name);
    const shapeClassFilePath = './' + strings.dasherize(options.name) + '/' + strings.dasherize(options.shapeType) + '-' + strings.dasherize(options.name);

    // Shape Import Changes
    const shapeComponent = shapeClass + 'Component';
    const shapeComponentFilePath = shapeClassFilePath + '.component';
    let changes = [
      insertImport(
        source, 
        shapeTypeComponentPath, 
        shapeComponent, 
        shapeComponentFilePath
      )
    ];

        // Shape (at)ContentChildren Decorator Changes
        const atNodes = findNodes(source, ts.SyntaxKind.AtToken);
        const shapeContentChildrenNode = atNodes.find(
          node => node.parent.getText() === '@ContentChildren(' + shapeComponent + ')');
        
        if (!shapeContentChildrenNode) {
          const commentNodes = findNodes(source, ts.SyntaxKind.JSDocComment);

          const contentChildsNode = commentNodes.find(
            commentNode => commentNode.getText() === '/** Generetated ContentChildrens */');

          if (!contentChildsNode) {
            throw new SchematicsException(`Comment to  position ContentChildrens is not found in ${shapeTypeComponentPath}.`);
          }

          const fallbackPos = contentChildsNode.getStart();
          changes.push(insertAfterLastOccurrence(
            commentNodes, 
            '\n  @ContentChildren(' + shapeComponent + ')' + 
              strings.dasherize(options.shapeType) + strings.classify(options.name) + 's' +
              ': QueryList<GenericStandardElementShapeComponent>;', 
            shapeTypeComponentPath, 
            fallbackPos)
          );
    
        }

    commitChanges(host, changes, shapeTypeComponentPath);

  }

}

/**
 * update shape references (imports, exports, @ContentChildren) in shape type files (odule and component)
 * @param options 
 */
function updateShapeTypeModule(options: ShapeOptions, host: Tree) {

  const shapeTypeModuleFilePath = buildShapeTypeModuleFilePath(options);
  
  if (shapeTypeModuleFilePath && options.shapeType) {
    // Initialize Update (shapeType).module file
    const text = host.read(shapeTypeModuleFilePath);
  
    if (text === null) {
      throw new SchematicsException(`File ${shapeTypeModuleFilePath} does not exist.`);
    }

    const sourceText = text.toString('utf-8');
    const source = ts.createSourceFile(shapeTypeModuleFilePath, sourceText, ts.ScriptTarget.Latest, true);
    const shapeClass = strings.classify(options.shapeType) + strings.classify(options.name);
    const shapeClassFilePath = './' + strings.dasherize(options.name) + '/' + strings.dasherize(options.shapeType) + '-' + strings.dasherize(options.name);

    // Shape Import Changes
    const shapeModule = shapeClass + 'Module';
    const shapeModuleFilePath = shapeClassFilePath + '.module';
    let changes = 
      addImportToModule(
        source,
        shapeTypeModuleFilePath,
        shapeModule,
        shapeModuleFilePath
      );

    commitChanges(host, changes, shapeTypeModuleFilePath);

  }

}

/**
 * Update Element references (imports, exports, @ContentChildren) in shared shape type code
 * @param options 
 */
export function updateElementType(options: ShapeOptions): Rule {
  return (host: Tree) => {
    updateShapeTypeComponent(options, host);
    updateShapeTypeModule(options, host);
  }
}
