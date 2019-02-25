import {
    Rule,
    chain,
    Tree,
    SchematicContext
} from '@angular-devkit/schematics';
import { getSchematicsData } from '../../ng-joint-schematics-data';
import { resolveOptionPaths } from '../shape/shape-utils';
import { Schema as ShapeSchema } from '../../schemas/ng-joint-shape-schema';
import { Schema } from '../../schemas/ng-joint-lib-schema';
import {
    ngJointElementSchematics,
    ngJointLinkSchematics
} from '../shape/index';

function buildShapeOptions(options: Schema): ShapeSchema {
    return {
        shapeType: '',
        project: options.project,
        generatePath: options.generatePath,
        shapesPath: options.shapesPath,
        name: ''
    }
}


/**
 * Joint Js Element Generation Schematics
 * @param options
 */
export function ngJointLibSchematics(options: Schema): Rule {
    return (host: Tree, context: SchematicContext) => {
        let shapeOptions = buildShapeOptions(options);
        resolveOptionPaths(host, shapeOptions);
        const schematicsData = getSchematicsData(shapeOptions);
        const shapes = schematicsData.shapes;
        let rules: Rule[] = [];

        for (const shapeType in shapes) {
            shapeOptions.shapeType = shapeType;

            options.implementation = 'element';
            const elements = shapes[shapeType].elements;

            for (const name in elements) {
                shapeOptions.name = name;
                rules.push(ngJointElementSchematics(shapeOptions));
            }
/*
            options.implementation = 'link';
            const links = shapes[shapeType].links;

            for (const name in links) {
                shapeOptions.name = name;
                rules.push(ngJointLinkSchematics(shapeOptions));
            }
        }
*/
        
        const rule = chain(rules);
        return rule(host, context);
    };
}
    