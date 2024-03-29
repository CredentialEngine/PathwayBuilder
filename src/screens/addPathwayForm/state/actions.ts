import {
  SAVE_ADD_PATH_WAY_FORM_FIELDS,
  SEARCH_FOR_INDUSTRY_TYPE_CODE_FAILURE,
  SEARCH_FOR_INDUSTRY_TYPE_CODE_REQUEST,
  SEARCH_FOR_INDUSTRY_TYPE_CODE_SUCCESS,
  SEARCH_FOR_OCCUPATION_TYPE_CODE_FAILURE,
  SEARCH_FOR_OCCUPATION_TYPE_CODE_REQUEST,
  SEARCH_FOR_OCCUPATION_TYPE_CODE_SUCCESS,
  SEARCH_FOR_PROGRESSION_LEVEL_SUCCESS,
  SEARCH_FOR_PROGRESSION_MODAL_FAILURE,
  SEARCH_FOR_PROGRESSION_MODAL_REQUEST,
  SEARCH_FOR_PROGRESSION_MODAL_SUCCESS,
  SEARCH_FOR_SUPPORT_SERVICES_REQUEST,
  SEARCH_FOR_SUPPORT_SERVICES_SUCCESS,
  SEARCH_FOR_SUPPORT_SERVICES_FAILURE,
} from './actionTypes';

export const getHasProgressionModel = (payload: any) => ({
  type: SEARCH_FOR_PROGRESSION_MODAL_REQUEST,
  payload,
});

export const getDataForProgressionModelSuccess = (payload: any) => ({
  type: SEARCH_FOR_PROGRESSION_MODAL_SUCCESS,
  payload,
});

export const getDataForProgressionLevelSuccess = (payload: any) => ({
  type: SEARCH_FOR_PROGRESSION_LEVEL_SUCCESS,
  payload,
});

export const getDataForProgressionModelFailure = (payload: any) => ({
  type: SEARCH_FOR_PROGRESSION_MODAL_FAILURE,
  payload,
});
export const getIndustryTypeCodeRequest = (payload: any) => ({
  type: SEARCH_FOR_INDUSTRY_TYPE_CODE_REQUEST,
  payload,
});

export const getDataForIndustryTypeCodeSuccess = (payload: any) => ({
  type: SEARCH_FOR_INDUSTRY_TYPE_CODE_SUCCESS,
  payload,
});

export const getDataForIndustryTypeCodeFailure = (payload: any) => ({
  type: SEARCH_FOR_INDUSTRY_TYPE_CODE_FAILURE,
  payload,
});

export const getOccupationTypeCodeRequest = (payload: any) => ({
  type: SEARCH_FOR_OCCUPATION_TYPE_CODE_REQUEST,
  payload,
});

export const getDataForOccupationTypeCodeSuccess = (payload: any) => ({
  type: SEARCH_FOR_OCCUPATION_TYPE_CODE_SUCCESS,
  payload,
});

export const getDataForOccupationTypeCodeFailure = (payload: any) => ({
  type: SEARCH_FOR_OCCUPATION_TYPE_CODE_FAILURE,
  payload,
});
// Need to remove this method
export const saveAddPAthWayFormFields = (payload: any) => ({
  type: SAVE_ADD_PATH_WAY_FORM_FIELDS,
  payload,
});

export const getDataForSupportServicesFailure = (payload: any) => ({
  type: SEARCH_FOR_SUPPORT_SERVICES_FAILURE,
  payload,
});
export const getDataForSupportServicesRequest = (payload: any) => ({
  type: SEARCH_FOR_SUPPORT_SERVICES_REQUEST,
  payload,
});

export const getDataForSupportServicesSuccess = (payload: any) => ({
  type: SEARCH_FOR_SUPPORT_SERVICES_SUCCESS,
  payload,
});
