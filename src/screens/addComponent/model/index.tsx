import { ResourceSummary } from '../constants';

export interface ComponentCondition {
  ParentIdentifier: string;
  Id: number;
  RowId: string;
  Name: string;
  Description: string;
  RequiredNumber: number;
  LogicalOperator: string; // URI
  HasCondition: [string];
  HasConstraint: [string];
  LastUpdated: string;
  TargetComponent: [string];
}
export class ComponentConditionEntity implements ComponentCondition {
  ParentIdentifier: string;
  Id: number;
  RowId: string;
  Name: string;
  Description: string;
  RequiredNumber: number;
  LogicalOperator: string; // URI
  HasCondition: [string];
  HasConstraint: [string];
  LastUpdated: string;
  TargetComponent: [string];
}

export interface Constraint {
  ParentIdentifier: string;
  Id: number;
  RowId: string;
  Name: string;
  Description: string;
  LeftAction: string; // URI
  LeftSource: [ResourceSummary];
  Comparator: string; // URI
  RightAction: string; // URI
  RightSource: [ResourceSummary];
}
export class ConstraintEntity implements Constraint {
  ParentIdentifier: string;
  Id: number;
  RowId: string;
  Name: string;
  Description: string;
  LeftAction: string; // URI
  LeftSource: [ResourceSummary];
  Comparator: string; // URI
  RightAction: string; // URI
  RightSource: [ResourceSummary];
}
