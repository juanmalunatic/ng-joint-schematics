import { readFileSync } from 'fs';

import { SchematicsException } from '@angular-devkit/schematics';

import { NgJointSchematicDataOptions } from './data-options-schema';

/**
 * Format JSON Escapes @see {https://www.freeformatter.com/json-escape.html}
 */


/**
 * "nameSpace"."class"<"type">
 */
export interface NgJointClassDefinition {
    nameSpace?: string;
    class: string;
    type?: string;
}

export interface NgJointShapeTypeDefaults {
    elements: {
        shapeObjectClass: NgJointClassDefinition;
        shapeOptionsClass: NgJointClassDefinition;
        ngElementRef?: boolean;
    },
    links: {
        shapeObjectClass: NgJointClassDefinition;
        shapeOptionsClass: NgJointClassDefinition;
        ngElementRef?: boolean;
    }
}

/**
 * "attrs": {
 *  "propName": { NgJointClassDefinition },
 *  .....
 * }
 */
export interface NgJointShapeProperties {
    attrs?: {
        [propName: string]: NgJointClassDefinition;
    };
    extra?: {
        [propName: string]: NgJointClassDefinition;
    };
}

/**
 * "shapeName(1)": { "properties": { NgJointShapeProperties }},
 * 
 * ...,
 * 
 * "shapeName(n)": { "properties": { NgJointShapeProperties }},
 */
export interface NgJointShape {
    [shapeName: string]: {
        properties: NgJointShapeProperties;
        template?: string;
        style?: string;
    };
}

/**
 * "importSymbols": ["sym1", ..., "sym(n)"],
 * 
 * "fromPath": "../(example) "
 */
export interface NgJointImportMapping {
    importSymbols: string[];
    fromPath: string;
}

/**
 * importMappings: NgJointImportMapping[]
 */
export interface NgJointDefaults {
    importMappings: NgJointImportMapping[];
}

/**
 * "defaults": { NgJointShapeTypeDefaults },
 * 
 * "elements": { NgJointShape },
 * 
 * "links": { NgJointShape }
 */
export interface NgJointShapeType {
    defaults: NgJointShapeTypeDefaults;
    elements?: NgJointShape;
    links?: NgJointShape;
}

export interface NgJointShapeTypes {
    [shapeType: string]: NgJointShapeType;
}

/**
 * "default": { NgJointDefaults },
 * 
 * "shapes": { NgJointShapeTypes }
 */
export interface NgJointSchematicData {
    defaults: NgJointDefaults;
    shapes: NgJointShapeTypes;
}

/**
 * Read Ng Joint Schematics File defined in options and return JSON Data 
 * @param options 
 */
export function getSchematicsData(
    options: NgJointSchematicDataOptions
    ): NgJointSchematicData {

    if (!options.schematicsDataFile) {
        throw new SchematicsException('Option (schematicsDataFile) is required.');
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
 * Get the Defaults for the Shape Type (standard, uml, angular, ...)
 * @param options 
 */
export function getShapeTypeDefaults(
    options: NgJointSchematicDataOptions): NgJointShapeTypeDefaults | undefined {
    return getShapeType(options).defaults;
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
            // element is defined
            return shapeTypeElements[options.name].properties;
        }
    }

    // no element defined
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
            // element is defined
            return shapeTypeLinks[options.name].properties;
        }
    }

    // no link defined
    return undefined;
}

/**
 * Get Angular Component HTML-template for a specific Element (Angular, ....)
 * @param options 
 */
export function getElementTemplate(
    options: NgJointSchematicDataOptions): string | undefined {
        
    if (!options.name) {
        throw new SchematicsException('getElementTemplate() Option (name) is required.');
    }

    const shapeTypeElements = getShapeTypeElements(options);

    if (shapeTypeElements) {
        // shapetype has elements
        if (shapeTypeElements[options.name]) {
            // element is defined
            return shapeTypeElements[options.name].template;
        }
    }

    // no element defined
    return undefined;
}

/**
 * Get Angular Component HTML-template for a specific Link (Angular, ....)
 * @param options 
 */
export function getLinkTemplate(
    options: NgJointSchematicDataOptions): string | undefined {
        
    if (!options.name) {
        throw new SchematicsException('getLinkTemplate() Option (name) is required.');
    }

    const shapeTypeLinks = getShapeTypeLinks(options);

    if (shapeTypeLinks) {
        // shapetype has links
        if (shapeTypeLinks[options.name]) {
            // link is defined
            return shapeTypeLinks[options.name].template;
        }
    }

    // no link defined
    return undefined;
}

/**
 * Get Angular Component Style for a specific Element (Angular, ....)
 * @param options 
 */
export function getElementStyle(
    options: NgJointSchematicDataOptions): string | undefined {
        
    if (!options.name) {
        throw new SchematicsException('getElementStyle() Option (name) is required.');
    }

    const shapeTypeElements = getShapeTypeElements(options);

    if (shapeTypeElements) {
        // shapetype has elements
        if (shapeTypeElements[options.name]) {
            // element is defined
            return shapeTypeElements[options.name].style;
        }
    }

    // no element defined
    return undefined;
}

/**
 * Get Angular Component Style for a specific Link (Angular, ....)
 * @param options 
 */
export function getLinkStyle(
    options: NgJointSchematicDataOptions): string | undefined {
        
    if (!options.name) {
        throw new SchematicsException('getLinkStyle() Option (name) is required.');
    }

    const shapeTypeLinks = getShapeTypeLinks(options);

    if (shapeTypeLinks) {
        // shapetype has links
        if (shapeTypeLinks[options.name]) {
            // link is defined
            return shapeTypeLinks[options.name].style;
        }
    }

    // no link defined
    return undefined;
}