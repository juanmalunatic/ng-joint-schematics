import { resolve, sep } from 'path';
import { readFileSync } from 'fs';

import { SchematicsException } from '@angular-devkit/schematics';

export class NgJointSchematicsData {

    constructor(options: NgJointSchematicDataOptions, ) {

        if (!options.path) {
            throw new SchematicsException('Option (path) is required.');
        }

        if (options.schematicsDataFile === '' || options.schematicsDataFile === undefined) {
            options.schematicsDataFile = '.' + sep + resolve(options.path, '..', 'ng-joint-schematics-data.json');
        }

        const textData = readFileSync(options.schematicsDataFile, 'utf-8');
        this._jsonData = JSON.parse(textData);

    }

    private _jsonData: { shapes: NgJointShapeTypes };

    get shapeTypes(): string[] {
        return Object.keys(this._jsonData.shapes);
    }

    getShapeType(shapeType: string): NgJointShapeType {
        return this._jsonData.shapes[shapeType];
    }

    getShapeTypeElements(shapeType: string): NgJointShape | undefined {
        return this.getShapeType(shapeType).elements;
    }

    getElementProperties(shapeType: string, element: string): NgJointShapeProperties | undefined {
        const shapeTypeElements = this.getShapeTypeElements(shapeType);
        if (shapeTypeElements) {
            return shapeTypeElements[element].properties;
        } 
        return undefined;
    }
}

interface NgJointSchematicDataOptions { 
    path?: string,
    schematicsDataFile?: string
}

interface NgJointShapeTypes {
    [shapeType: string]: NgJointShapeType;
}

interface NgJointShapeType {
    generic?: NgJointShape;
    elements?: NgJointShape;
    links?: NgJointShape;
}

interface NgJointShape {
    [shapeName: string]: {
        properties: NgJointShapeProperties;
    };
}

interface NgJointShapeProperties {
    attrs: {
        [propName: string]: string;
    };
}
