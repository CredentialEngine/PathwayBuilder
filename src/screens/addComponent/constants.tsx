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

export interface Contraint {
  ParentIdentifier: string;
  Id: number;
  RowId: string;
  Name: string;
  Description: string;
  LeftAction: string;
  LeftSource: [ResourceSummary];
  Comparator: string;
  RightAction: string;
  RightSource: [ResourceSummary];
}

export class ContraintComponent implements Contraint {
  ParentIdentifier: string;
  Id: number;
  RowId: string;
  Name: string;
  Description: string;
  LeftAction: string;
  LeftSource: [ResourceSummary];
  Comparator: string;
  RightAction: string;
  RightSource: [ResourceSummary];
}
