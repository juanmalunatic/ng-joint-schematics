import {
  NgJointShapeProperties,
  NgJointDefaults
} from './ng-joint-schematics-data';
import { buildImportStatements } from './ng-joint-schematics/shape/shape-utils';

const _INPUT_SPACING_ = '  ';

function buildShapeProperty(
  shapeProperties: NgJointShapeProperties,
  key: string): string {
  return key + ': ' + shapeProperties.attrs[key] + ';\n';
}

/**
 * Build a string with parsed Shape Component Inputs from Shape Properties
 * @param shapeProperties 
 */
export function buildShapeComponentInputDecorators(
  shapeProperties: NgJointShapeProperties | undefined): string {

  let inputs = '';

  if (shapeProperties) {
    for (const property in shapeProperties) {

      switch (property) {
        case 'attrs': {
          for (const key in shapeProperties.attrs) {
            inputs += _INPUT_SPACING_ + '@Input() ' + 
              buildShapeProperty(shapeProperties, key);
          }  
          break;
        }
      }
    }
  }

  return inputs;
}

/**
 * Build a string with parsed Shape Interface Properties
 * @param shapeProperties
 */
export function buildShapeInterfaceProperties(
  shapeProperties: NgJointShapeProperties | undefined): string {

  let properties = '';

  if (shapeProperties) {
    for (const property in shapeProperties) {

      switch (property) {
        case 'attrs': {
          for (const key in shapeProperties.attrs) {
            properties += _INPUT_SPACING_ + buildShapeProperty(shapeProperties, key);
          }  
          break;
        }
      }
    }
  }  

  return properties;
}

/**
 * Build a string with required imports (namespaces, ..) fpr used properties
 * @param shapeProperties
 * @param imports 
 */
export function buildShapeInterfacePropertiesImportStatements(
  shapeProperties: NgJointShapeProperties | undefined,
  defaults: NgJointDefaults
): string {

  let imports = '';

  if (shapeProperties) {
    let importSymbols: string[] = [];

    for (const propKey in shapeProperties) {
      const nameSpace = propKey.split('.')[0];

      if (nameSpace !== propKey && !importSymbols.find(importSymbol => importSymbol === nameSpace)) {
        importSymbols.push(nameSpace);
      }

    }

    imports = buildImportStatements(importSymbols, defaults.importMappings);
  }

  return imports;
}