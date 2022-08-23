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
  id: number;
  uri: string;
  name: string;
  organization: ResourceSummary;
  description: string;
  cTID: string;
  hasDestinationComponent: [];
  hasProgressionModel: [];
  industryType: [ResourceSummary];
  occupationType: [ResourceSummary];
  subjectWebpage: 'test';
  keyword: [];
  subject: [];
  lastUpdated: '22-02-2022';
}

export class PathwayWrapperEntity
  extends PathwayEntity
  implements PathwayWrapper
{
  pathway: PathwayEntity = new PathwayEntity();
  pathwayComponents?: PathwayComponent[] = [];
  progressionModels?: ProgressionModels[] = [];
  progressionLevels: ProgressionLevels[] = [];
  componentConditions: ComponentConditions[] = [];
  constraints: Constraints[] = [];
  pendingComponent: PathwayComponent[] = [];
}
