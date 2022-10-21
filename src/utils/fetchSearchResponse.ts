import { noop } from 'lodash';

import { productionSetting, sanboxSetting } from '../apiConfig/setting';

export default async function fetchProgressionList(data: any) {
  try {
    const res = await fetch(
      `${
        process.env.NODE_ENV !== 'production'
          ? sanboxSetting.api.url
          : productionSetting.api.url
      }PathwayBuilderApi/Search/Codes/InstructionalProgramTypePathwayBuilderApi/Search/Resource/Pathway_HasProgressionModel?userCreds=tara.mueller%40protiviti.com~ceI$Awesome`,
      {
        method: 'post', // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify(data), // body data type must match "Content-Type" header
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then(async (response) => {
      const json = await response.json();
      return json;
    });
    if (res?.Valid) {
      const updatedProgressionModel = res?.Data.Results.map((dta: any) => ({
        Name: dta.Name,
        Description: dta.Description,
        Id: dta.Id,
        CTID: dta.CTID,
        RowId: dta.RowId,
        label: dta.Name,
        value: dta.Name,
        created: dta.created,
        lastUpdated: dta.lastUpdated,
        LastUpdatedById: dta.LastUpdatedById,
        HasTopConcept: dta.HasTopConcept,
      }));

      const updatedProgressionLevel = res.Data.RelatedResources.map(
        (dta: any) => ({
          Name: dta.Name,
          Description: dta.Description,
          Id: dta.Id,
          RowId: dta.RowId,
          label: dta.Name,
          value: dta.Name,
          created: dta.created,
          lastUpdated: dta.lastUpdated,
          LastUpdatedById: dta.LastUpdatedById,
          CTID: dta.CTID,
          InProgressionModel: dta.InProgressionModel,
          hasChild: dta.hasChild,
          Narrower: dta.Narrower,
        })
      );
      return { updatedProgressionModel, updatedProgressionLevel };
    }
  } catch (error: any) {
    noop;
  }
}
export async function getAllConstraintOperand(data: any) {
  try {
    const res = await fetch(
      `${
        process.env.NODE_ENV !== 'production'
          ? sanboxSetting.api.url
          : productionSetting.api.url
      }PathwayBuilderApi/Search/Resource/Constraint_Operand?userCreds=tara.mueller%40protiviti.com~ceI$Awesome`,
      {
        method: 'post', // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify(data), // body data type must match "Content-Type" header
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then(async (response) => {
      const json = await response.json();
      return json;
    });
    return res;
  } catch (error: any) {
    noop;
  }
}
