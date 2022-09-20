import {
  ComponentConditions,
  Constraints,
  pathway,
  PathwayComponent,
  PathwayWrapper,
  ProgressionLevels,
  ProgressionModels,
  ResourceSummary,
} from './pathwayWrapper';

export class PathwayEntity implements pathway {
  Id = 0;
  Uri: string;
  Name: string;
  Organization: ResourceSummary;
  Description: string;
  CTID: string;
  HasDestinationComponent: string[];
  HasProgressionModel: string[];
  IndustryType: [ResourceSummary];
  OccupationType: [ResourceSummary];
  SubjectWebpage: '';
  Keyword: string[];
  Subject: string[];
  LastUpdated: '';
}

export class PathwayWrapperEntity implements PathwayWrapper {
  Pathway: pathway;
  PathwayComponents: PathwayComponent[];
  ProgressionModels: ProgressionModels[];
  ProgressionLevels: ProgressionLevels[];
  ComponentConditions: ComponentConditions[];
  Constraints: Constraints[];
  PendingComponent: PathwayComponent[];
  DeletedComponents: [];
  DeletedComponentConditions: [];
}
