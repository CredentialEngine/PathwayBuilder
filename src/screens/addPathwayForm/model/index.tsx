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
  Id: number;
  Uri: string;
  Name: string;
  Organization: ResourceSummary;
  Description: string;
  CTID: string;
  HasDestinationComponent: string[];
  HasProgressionModel: string[];
  IndustryType: [ResourceSummary];
  OccupationType: [ResourceSummary];
  SubjectWebpage: 'test';
  Keyword: string[];
  Subject: string[];
  LastUpdated: '22-02-2022';
}

export class PathwayWrapperEntity implements PathwayWrapper {
  PathwayComponents: PathwayComponent[] = [];
  ProgressionModels: ProgressionModels[] = [];
  ProgressionLevels: ProgressionLevels[] = [];
  ComponentConditions: ComponentConditions[] = [];
  Constraints: Constraints[] = [];
  PendingComponent: PathwayComponent[] = [];
  Pathway: PathwayEntity = new PathwayEntity();
}
