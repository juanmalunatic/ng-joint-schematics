import { NgJointShapeProperties } from './ng-joint-schematics-data';

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
export function buildShapeInterfacePropertiesImports(
shapeProperties: NgJointShapeProperties | undefined): string {
  let imports = '';

  if (shapeProperties) {
    for (const propKey in  shapeProperties) {
      const nameSpace = propKey.split('.')[0];

      if (nameSpace) {

      }

    }
  }
  
  return imports;
}