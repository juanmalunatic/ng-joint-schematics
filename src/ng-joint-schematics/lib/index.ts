import {
    Rule,
    Tree,
    SchematicContext
} from '@angular-devkit/schematics';
import { getSchematicsData } from '../../ng-joint-schematics-data';
import { resolveOptionPaths } from '../shape/shape-utils';
import { Schema as ShapeSchema } from '../../schemas/ng-joint-shape-schema';
import { Schema } from '../../schemas/ng-joint-lib-schema';

function buildShapeOptions(options: Schema): ShapeSchema {
    return {
        shapeType: '',
        project: options.project,
        name: ''
    }
}


/**
 * Joint Js Element Generation Schematics
 * @param options
 */
export function ngJointLibSchematics(options: Schema): Rule {
    return (host: Tree, context: SchematicContext) => {
        const 
        resolveOptionPaths(host, options);
        options.implementation = 'element';
        const rule = ngJointShapeSchematics(options);
        return rule(host, context);
    };
}
    