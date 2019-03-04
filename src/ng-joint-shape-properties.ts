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
      properties += _SPACES_ + buildShapeAttrProperty(key, shapeProperties.attrs[key]);
    }

    for (const key in shapeProperties.extra) {
      properties += _SPACES_ + buildShapeAttrProperty(key, shapeProperties.extra[key]);
    }

  }  

  return properties;
}

/**
 * Update importSymbols by adding Unique Symbol (Class or Namespace)
 * @param importSymbols
 * @param classDefinition 
 */
function updateImportSymbols(importSymbols: string[], classDefinition: NgJointClassDefinition) {

  let symbol = classDefinition.class;

  if (classDefinition.nameSpace) {
    symbol = classDefinition.nameSpace;
  }

  if (!importSymbols.find(importSymbol => importSymbol === symbol)) {
    importSymbols.push(symbol);
  }

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
      updateImportSymbols(importSymbols, shapeProperties.attrs[key])
    }

    for (const key in shapeProperties.extra) {
      updateImportSymbols(importSymbols, shapeProperties.extra[key])
    }

    imports = buildImportStatements(importSymbols, importMappings);
  }

  return imports;
}