import { NgJointShapeProperties } from './ng-joint-schematics-data';

const inputSpacing = '  ';
const attrsNamespace = 'attributes';

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
          for (const attr in shapeProperties.attrs) {
            inputs += inputSpacing + '@Input() ' + attr + ': ' + 
              attrsNamespace + '.' + shapeProperties.attrs[attr] + ';\n';
          }  
          break;
        }
      }
    }
  }

  return inputs;
}

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