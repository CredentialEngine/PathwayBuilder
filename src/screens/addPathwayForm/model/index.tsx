import { pathway, ResourceSummary } from './pathwayWrapper';

export class PathwayWrapperEntity implements pathway {
  id = 0;
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
