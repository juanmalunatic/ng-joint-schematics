import { NgJointShapeProperties } from './ng-joint-schematics-data';

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
                    inputs += '@Input() ' + attr + ': ' + 
                        attrsNamespace + '.' + shapeProperties.attrs[attr] + ';\n';
                }  
                break;
            }
          }
        }
    }

    return inputs;
}
