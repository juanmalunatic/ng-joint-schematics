import { resolve, sep } from 'path';
import { readFileSync } from 'fs';

import { SchematicsException } from '@angular-devkit/schematics';

export interface NgJointSchematicDataOptions { 
    path?: string,
    schematicsDataFile?: string
    name?: string;
    shapeType?: string;
}

export interface NgJointSchematicData {
    defaults: NgJointDefaults;
    shapes: NgJointShapeTypes;
}

export interface NgJointDefaults {
    importMappings: NgJointImportMapping[];
}

export interface NgJointImportMapping {
    importSymbols: string[];
    fromPath: string;
}

export interface NgJointShapeTypes {
    [shapeType: string]: NgJointShapeType;
}

export interface NgJointShapeType {
    defaults?: NgJointShape;
    elements?: NgJointShape;
    links?: NgJointShape;
}

export interface NgJointShape {
    [shapeName: string]: {
        properties: NgJointShapeProperties;
    };
}

export interface NgJointShapeProperties {
    attrs: {
        [propName: string]: NgJointClassDefinition;
    };
}

export interface NgJointClassDefinition {
    nameSpace?: string;
    class: string;
    type?: string;
}

/**
 * Read Ng Joint Schematics File defined in options and return JSON Data 
 * @param options 
 */
export function getSchematicsData(
    options: NgJointSchematicDataOptions
    ): NgJointSchematicData {

    if (!options.path) {
        throw new SchematicsException('getSchematicsData() Option (path) is required.');
    }

    if (options.schematicsDataFile === '' || options.schematicsDataFile === undefined) {
        options.schematicsDataFile = '.' + sep + resolve(options.path, '..', 'ng-joint-schematics-data.json');
    }

    const data = readFileSync(options.schematicsDataFile, 'utf-8');
    return JSON.parse(data);

}

/**
 * Get the Data for the Ng Joint Defaults (imports-mapping etc.)
 * @param options
 */
export function getDefaults( 
    options: NgJointSchematicDataOptions): NgJointDefaults {

    return getSchematicsData(options).defaults;
}

/**
 * Get the Data for the Ng Joint Shape Type (standard, uml, angular, ...)
 * @param options
 */
export function getShapeType( 
    options: NgJointSchematicDataOptions): NgJointShapeType {

    if (!options.shapeType) {
            throw new SchematicsException('getShapeType() Option (shapeType) is required.');
    }

    return getSchematicsData(options).shapes[options.shapeType];
}

/**
 * Get the Elements for the Shape Type (standard, uml, angular, ...)
 * @param options 
 */
export function getShapeTypeElements(
    options: NgJointSchematicDataOptions): NgJointShape | undefined {
    return getShapeType(options).elements;
}

/**
 * Get the Elements for the Shape Type (standard, uml, angular, ...)
 * @param options 
 */
export function getShapeTypeLinks(
    options: NgJointSchematicDataOptions): NgJointShape | undefined {
    return getShapeType(options).links;
}

/**
 * Get Input Properties for a specific Element (Reactangle, ....)
 * @param options 
 */
export function getElementProperties(
    options: NgJointSchematicDataOptions): NgJointShapeProperties | undefined {
        
    if (!options.name) {
        throw new SchematicsException('getElementProperties() Option (name) is required.');
    }

    const shapeTypeElements = getShapeTypeElements(options);

    if (shapeTypeElements) {
        // shapetype has elements
        if (shapeTypeElements[options.name]) {
            // element has properties
            return shapeTypeElements[options.name].properties;
        }
    }

    // no elements or properties defined
    return undefined;
}

/**
 * Get Input Properties for a specific Link (Link, DoubleLink, ....)
 * @param options 
 */
export function getLinkProperties(
    options: NgJointSchematicDataOptions): NgJointShapeProperties | undefined {
        
    if (!options.name) {
        throw new SchematicsException('getLinkProperties() Option (name) is required.');
    }

    const shapeTypeLinks = getShapeTypeLinks(options);

    if (shapeTypeLinks) {
        // shapetype has elements
        if (shapeTypeLinks[options.name]) {
            // element has properties
            return shapeTypeLinks[options.name].properties;
        }
    }

    // no elements or properties defined
    return undefined;
}
