export interface Component {
  CTID: number;
  Name: string;
  Description: string;
  CredentialType: string;
  Identifier: [string];
  FinderLink: string;
  IndustryType: string;
  OccupationType: string;
  CreditValue: number;
  LastUpdated: Date;
  Webpage: string;
  ComponentType: string;
  Designation: [string];
}
export class ComponentEntity implements Component {
  CTID: number;
  Name: string;
  Description: string;
  CredentialType: string;
  Identifier: [string];
  FinderLink: string;
  IndustryType: string;
  OccupationType: string;
  CreditValue: number;
  LastUpdated: Date;
  Webpage: string;
  ComponentType: string;
  Designation: [string];
}
