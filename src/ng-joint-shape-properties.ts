import { _SPACES_ } from './ng-joint-config';
import {
  NgJointShapeProperties,
  NgJointImportMapping,
  NgJointClassDefinition
} from './ng-joint-schematics-data';
import { buildImportStatements } from './ng-joint-schematics/shape/shape-utils';


function buildShapeAttrProperty(key: string, property: NgJointClassDefinition): string {
  let attrClass = property.class;

  if (property.nameSpace) {
    attrClass = property.nameSpace + '.' + attrClass;
  }

  return key + ': ' + attrClass + ';\n';
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
      const property = shapeProperties.attrs[key] as NgJointClassDefinition;
      inputs += _SPACES_ + '@Input() ' + buildShapeAttrProperty(key, property);
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
      const property = shapeProperties.attrs[key] as NgJointClassDefinition;
      properties += _SPACES_ + buildShapeAttrProperty(key, property);
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