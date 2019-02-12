export interface NgJointSchematicsData {
    shapes? : NgJointShapeType;
}

interface NgJointShapeType {
    [shapeType: string]: {
        generic?: NgJointShape;
        elements?: NgJointShape[];
        links?: NgJointShape[];
    };
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
