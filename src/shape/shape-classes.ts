import { NgJointClassDefinition } from '../data/shape-type-defaults';

export function buildShapeClass(shapeClass: NgJointClassDefinition): string {
    let classString = '';

    if (shapeClass.nameSpace) { 
        classString += shapeClass.nameSpace + '.'; 
    }

    classString += shapeClass.class;

    if (shapeClass.type) {
        classString += '<' + shapeClass.type + '>'
    }
    
    return classString
}
