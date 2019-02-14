import { NgJointShapeProperties } from './ng-joint-schematics-data';

const inputSpacing = '  ';
const attrsNamespace = 'attributes';


function buildShapeProperty(
  shapeProperties: NgJointShapeProperties,
  key: string): string {
  return key + ': ' + attrsNamespace + '.' + shapeProperties.attrs[key] + ';\n';
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
            inputs += inputSpacing + '@Input() ' + 
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
            properties += inputSpacing + buildShapeProperty(shapeProperties, key);
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
      imports += attrsNamespace;
    }
  }
  
  return imports;
}