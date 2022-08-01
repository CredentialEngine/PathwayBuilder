export interface data {
  name?: string;
  age?: number;
}

export interface PathwayWrapper {
  pathway: pathway;
  pathwayComponents?: PathwayComponent[];
  progressionModels?: ProgressionModels[];
  progressionLevels: [progressionLevels];
  componentConditions: [ComponentConditions];
  constraints: [Constraints];
  pendingComponent: [PathwayComponent];
}

export interface pathway {
  id: number;
  uri: string;
  name: string;
  organization: ResourceSummary;
  description: string;
  cTID: string;
  hasDestinationComponent: []; //URI for Pathway Component
  hasProgressionModel: []; //URI for Progression Model
  industryType: [ResourceSummary];
  occupationType: [ResourceSummary];
  subjectWebpage: 'test';
  keyword: [];
  subject: [];
  lastUpdated: '22-02-2022';
}
export interface Constraints {
  id: number;
  rowId: string;
  name: string;
  description: string;
  leftAction: string; //URI for concepy
  leftSource: ['a', 'b', 'c'];
  comparator: string; // URI for concept
  rightAction: string; // URI for concept
  rightSource: ['x', 'y', 'z'];
}
export interface ComponentConditions {
  parentIdentifier: string;
  id: number;
  rowId: string;
  name: string;
  description: string;
  requiredNumber: number;
  logicalOperator: string; //URI for Conecept
  hasCondition: ['1', '2', '3', '4'];
  hasConstraint: ['a', 'b', 'c', 'd'];
  lastUpdated: string;
  targetComponent: ['x', 'y', 'z'];
}

export interface progressionLevels {
  id: number;
  rowId: number;
  name: string;
  description: string;
  codedNotation: string;
}
export interface ProgressionModels {
  id: number;
  rowId: number;
  name: string;
  description: string;
  cTID: string;
}

export interface PathwayComponent {
  id: number;
  rowId: string; //GUID
  type: string;
  name: string;
  componentcategory: string;
  componentDesignation: ['a', 'b', 'c'];
  creditValue: [QuantitativeValue];
  credentialType: string;
  ctid: string;
  description: string;
  hasChild: ['1', '2'];
  hasCondition: ['abc', 'xyz'];
  hasProgressionLevel: string;
  industryType: [ResourceSummary];
  occupationType: [ResourceSummary];
  pointValue: QuantitativeValue;
  precededBy: string;
  precedes: string;
  programTerm: string;
  proxyFor: string;
  proxyForLabel: string;
  subjectWebpage: string;
  lastUpdated: string;
  ceterms: [
    {
      identifierTypeName: string;
      identifierType: string;
      identifierValueCode: string;
    }
  ];
}

export interface ResourceSummary {
  id: number;
  name: string;
  cTID: string;
  codedNotation: string;
  rowId: string;
  description: string;
  uri: string;
  type: string;
}
export interface QuantitativeValue {
  unitText: string;
  description: string;
  percentage: number;
  minValue: number;
  maxValue: number;
  value: number;
}
