import {
  GET_CREDENTIAL_TYPES_REQUEST,
  GET_CREDENTIAL_TYPES_SUCCESS,
  GET_CREDENTIAL_TYPES_FAILURE,
  GET_CREDIT_UNIT_TYPES_REQUEST,
  GET_CREDIT_UNIT_TYPES_SUCCESS,
  GET_CREDIT_UNIT_TYPES_FAILURE,
  GET_CREDIT_LEVEL_TYPES_REQUEST,
  GET_CREDIT_LEVEL_TYPES_SUCCESS,
  GET_CREDIT_LEVEL_TYPES_FAILURE,
  SEARCH_FOR_LANGUAGE_FAILURE,
  SEARCH_FOR_LANGUAGE_REQUEST,
  SEARCH_FOR_LANGUAGE_SUCCESS,
} from './actionTypes';

export const getCredentialTypesRequest = () => ({
  type: GET_CREDENTIAL_TYPES_REQUEST,
});

export const getCredentialTypesSuccess = (payload: any) => ({
  type: GET_CREDENTIAL_TYPES_SUCCESS,
  payload,
});

export const getCredentialTypesFailure = (payload: any) => ({
  type: GET_CREDENTIAL_TYPES_FAILURE,
  payload,
});
export const getCreditUnitTypesRequest = () => ({
  type: GET_CREDIT_UNIT_TYPES_REQUEST,
});

export const getCreditUnitTypesSuccess = (payload: any) => ({
  type: GET_CREDIT_UNIT_TYPES_SUCCESS,
  payload,
});

export const getCreditUnitTypesFailure = (payload: any) => ({
  type: GET_CREDIT_UNIT_TYPES_FAILURE,
  payload,
});
export const getCreditLevelTypesRequest = () => ({
  type: GET_CREDIT_LEVEL_TYPES_REQUEST,
});

export const getCreditLevelTypesSuccess = (payload: any) => ({
  type: GET_CREDIT_LEVEL_TYPES_SUCCESS,
  payload,
});

export const getCreditLevelTypesFailure = (payload: any) => ({
  type: GET_CREDIT_LEVEL_TYPES_FAILURE,
  payload,
});
export const getLanguageRequest = (payload: any) => ({
  type: SEARCH_FOR_LANGUAGE_REQUEST,
  payload,
});

export const getDataForLanguageSuccess = (payload: any) => ({
  type: SEARCH_FOR_LANGUAGE_SUCCESS,
  payload,
});

export const getDataForLanguageFailure = (payload: any) => ({
  type: SEARCH_FOR_LANGUAGE_FAILURE,
  payload,
});
