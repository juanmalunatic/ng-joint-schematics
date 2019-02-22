import { NgJointShapeProperties } from './ng-joint-schematics-data';

const _INPUT_SPACING_ = '  ';
const _ATTRS_NAME_SPACE_ = 'attributes';


function buildShapeProperty(
  shapeProperties: NgJointShapeProperties,
  key: string): string {
  return key + ': ' + _ATTRS_NAME_SPACE_ + '.' + shapeProperties.attrs[key] + ';\n';
}

/**
 * Build a string with parsed Shape Component Inputs from Shape Properties
 * @param shapeProperties 
 */
export function buildShapeComponentInputs(
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
 * Build a string with required jointjs imports (namespaces, ..)
 * @param shapeProperties
 * @param imports 
 */
export function buildJointjsImports(
  shapeProperties: NgJointShapeProperties | undefined,
  imports?: string): string {

  if (!imports) { imports = ''; };

  if (shapeProperties) {
    const attrs = Object.keys(shapeProperties).find(property => property === 'attrs');
    if (attrs) {
      if (imports !=='') { imports += ', '; }
      imports += _ATTRS_NAME_SPACE_;
    }
  }
  
  return imports;
}