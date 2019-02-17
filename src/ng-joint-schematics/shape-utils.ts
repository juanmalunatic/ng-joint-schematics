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

import { insertImport, findNodes, insertAfterLastOccurrence } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';

/**
 * Sshape type options Interface
 */
interface ShapeOptions {
    name: string;
    shapeType?: string;
    path?: string;
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
 * Build shape type component file name
 * @param options
 */  
export function buildShapeTypeComponentName(options: ShapeOptions): string | undefined {
    if (!options.shapeType) {
      return undefined;
    }

    return 'shape-' + strings.dasherize(options.shapeType) + '.component.ts';
}

/**
 * Build file path to shape type component
 * @param options 
 */
export function buildShapeTypeComponentPath(options: ShapeOptions): string | undefined {
    const shapeTypePath = buildShapeTypePath(options);
    const componentName = buildShapeTypeComponentName(options)
  
    if (!shapeTypePath || !componentName) {
      return undefined;
    }
  
    return join(shapeTypePath, componentName);
}

/**
 * update shape references (imports, exports, @ContentChildren) in shape type files (odule and component)
 * @param options 
 */
export function updateShapeReferences(options: ShapeOptions): Rule {
    return (host: Tree) => {
  
      const shapeTypeComponentPath = buildShapeTypeComponentPath(options);
  
      if (shapeTypeComponentPath && options.shapeType) {
        const text = host.read(shapeTypeComponentPath);
  
        if (text === null) {
          throw new SchematicsException(`File ${shapeTypeComponentPath} does not exist.`);
        }
  
        const sourceText = text.toString('utf-8');
        const source = ts.createSourceFile(shapeTypeComponentPath, sourceText, ts.ScriptTarget.Latest, true);
        const shapeClass = strings.classify(options.shapeType) + strings.classify(options.name);
        const shapeClassFilePath = './' + strings.dasherize(options.name) + '/' + strings.dasherize(options.shapeType) + '-' + strings.dasherize(options.name);
        const shapeComponent = shapeClass + 'Component';
        const shapeComponentFilePath = shapeClassFilePath + '.component';
        const changes = [
          insertImport(
            source, 
            shapeTypeComponentPath, 
            shapeClass, 
            shapeClassFilePath
          ),
          insertImport(
            source, 
            shapeTypeComponentPath, 
            shapeComponent, 
            shapeComponentFilePath
          )
        ];

        const recorder = host.beginUpdate(shapeTypeComponentPath);
        for (const change of changes) {
          if (change instanceof InsertChange) {
            recorder.insertLeft(change.pos, change.toAdd);
          }
        }
        host.commitUpdate(recorder);


        const atNodes = findNodes(source, ts.SyntaxKind.AtToken);
        const shapeContentChildrenNode = atNodes.find(
          node => node.parent.getText() === '@ContentChildren(' + shapeComponent + ')');
        
        if (!shapeContentChildrenNode) {
          console.log('ContentChildren Not Found')
          const classNodes = findNodes(source, ts.SyntaxKind.Constructor);
          console.log(classNodes[0].getStart());
          const changeContent = insertAfterLastOccurrence(imports, '// TEST INSERT', fileToEdit, fallbackPos);
    

        }

      }

    }

}
  