import { noop } from 'lodash';

import {
  BASE_URL,
  BASE_URL_PRODUCTION,
  BASE_USER_CREDS,
  SEARCH_FOR_LEST_RIGHT_OPERAND,
  SEARCH_FOR_PROGRESSION_MODAL,
} from '../apiConfig/endpoint';

const TEMP_BASE_URL =
  process.env.NODE_ENV !== 'production' ? BASE_URL : BASE_URL_PRODUCTION;

export default async function fetchProgressionList(data: any) {
  try {
    const res = await fetch(
      `${TEMP_BASE_URL}${SEARCH_FOR_PROGRESSION_MODAL}?userCreds=${BASE_USER_CREDS}`,
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
      `${TEMP_BASE_URL}${SEARCH_FOR_LEST_RIGHT_OPERAND}?userCreds=${BASE_USER_CREDS}`,
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
