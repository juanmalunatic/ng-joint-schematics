import {
  NgJointShapeProperties,
  NgJointImportMapping
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

    for (const key in shapeProperties.attrs) {
      inputs += _INPUT_SPACING_ + '@Input() ' + buildShapeProperty(shapeProperties, key);
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

    for (const key in shapeProperties.attrs) {
      properties += _INPUT_SPACING_ + buildShapeProperty(shapeProperties, key);
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
  importMappings: NgJointImportMapping[]
): string {

  let imports = '';

  if (shapeProperties) {
    let importSymbols: string[] = [];

    for (const key in shapeProperties.attrs) {
      const attr = shapeProperties.attrs[key];
      let attrSymbol = attr.class;

      if (attr.nameSpace) {
        attrSymbol = attr.nameSpace;
      }

      if (!importSymbols.find(importSymbol => importSymbol === attrSymbol)) {
        importSymbols.push(attrSymbol);
      }

    }

    imports = buildImportStatements(importSymbols, importMappings);
  }

  return imports;
}