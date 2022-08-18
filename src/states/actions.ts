import {
  GET_ALL_COMPARATORS_FAILURE,
  GET_ALL_COMPARATORS_REQUEST,
  GET_ALL_COMPARATORS_SUCCESS,
  GET_ARRAY_CONCEPT_FAILURE,
  GET_ARRAY_CONCEPT_REQUEST,
  GET_ARRAY_CONCEPT_SUCCESS,
  GET_CURRENT_USER_FAILURE,
  GET_CURRENT_USER_REQUEST,
  GET_CURRENT_USER_SUCCESS,
  GET_DATA_FOR_PATHWAY_AND_COMPONENTS_FAILURE,
  GET_DATA_FOR_PATHWAY_AND_COMPONENTS_REQUEST,
  GET_DATA_FOR_PATHWAY_AND_COMPONENTS_SUCCESS,
  GET_LOGICAL_OPERATOR_FAILURE,
  GET_LOGICAL_OPERATOR_REQUEST,
  GET_LOGICAL_OPERATOR_SUCCESS,
  SAVE_PATHWAY_DATA_FAILURE,
  SAVE_PATHWAY_DATA_REQUEST,
  SAVE_PATHWAY_DATA_SUCCESS,
} from './actionTypes';

export const getLogicalOperatorsRequest = () => ({
  type: GET_LOGICAL_OPERATOR_REQUEST,
});

export const getLogicalOperatorsSuccess = (payload: any) => ({
  type: GET_LOGICAL_OPERATOR_SUCCESS,
  payload,
});

export const getLogicalOperatorsFailure = (payload: any) => ({
  type: GET_LOGICAL_OPERATOR_FAILURE,
  payload,
});

export const getAllComparatorsRequest = () => ({
  type: GET_ALL_COMPARATORS_REQUEST,
});

export const getAllComparatorsSuccess = (payload: any) => ({
  type: GET_ALL_COMPARATORS_SUCCESS,
  payload,
});

export const getAllComparatorsFailure = (payload: any) => ({
  type: GET_ALL_COMPARATORS_FAILURE,
  payload,
});

export const getAllArrayConceptsRequest = () => ({
  type: GET_ARRAY_CONCEPT_REQUEST,
});

export const getAllArrayConceptsSuccess = (payload: any) => ({
  type: GET_ARRAY_CONCEPT_SUCCESS,
  payload,
});

export const getAllArrayConceptsFailure = (payload: any) => ({
  type: GET_ARRAY_CONCEPT_FAILURE,
  payload,
});

export const getCurrentUserDataRequest = () => ({
  type: GET_CURRENT_USER_REQUEST,
});

export const getCurrentUserDataSuccess = (payload: any) => ({
  type: GET_CURRENT_USER_SUCCESS,
  payload,
});

export const getCurrentUserDataFailure = (payload: any) => ({
  type: GET_CURRENT_USER_FAILURE,
  payload,
});

export const getDataForPathwayAndComponentsRequest = (id: number) => ({
  type: GET_DATA_FOR_PATHWAY_AND_COMPONENTS_REQUEST,
  id,
});

export const getDataForPathwayAndComponentsSuccess = (payload: any) => ({
  type: GET_DATA_FOR_PATHWAY_AND_COMPONENTS_SUCCESS,
  payload,
});

export const getDataForPathwayAndComponentsFailure = (payload: any) => ({
  type: GET_DATA_FOR_PATHWAY_AND_COMPONENTS_FAILURE,
  payload,
});

export const saveDataForPathwayRequest = (payload: any) => ({
  type: SAVE_PATHWAY_DATA_REQUEST,
  payload,
});

export const saveDataForPathwaySuccess = (payload: any) => ({
  type: SAVE_PATHWAY_DATA_SUCCESS,
  payload,
});

export const saveDataForPathwayFailure = (payload: any) => ({
  type: SAVE_PATHWAY_DATA_FAILURE,
  payload,
});
