import {
    Rule,
    chain
} from '@angular-devkit/schematics';
// import { getSchematicsData } from '../../ng-joint-schematics-data';
// import {
//    resolvePath
//} from '../shape/shape-utils';
import { Schema } from '../../schemas/ng-joint-lib-schema';

/**
 * Joint Js Element Generation Schematics
 * @param options
 */
export function ngJointLibSchematics(options: Schema): Rule {
    console.log('ngJointLibSchematics(options) = ', options);

    return chain([]);
}