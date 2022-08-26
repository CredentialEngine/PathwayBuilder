import {
  GET_CURRENT_USER_FAILURE,
  GET_CURRENT_USER_REQUEST,
  GET_CURRENT_USER_SUCCESS,
  GET_DATA_FOR_PATHWAY_AND_COMPONENTS_FAILURE,
  GET_DATA_FOR_PATHWAY_AND_COMPONENTS_REQUEST,
  GET_DATA_FOR_PATHWAY_AND_COMPONENTS_SUCCESS,
  SAVE_PATHWAY_DATA_FAILURE,
  SAVE_PATHWAY_DATA_REQUEST,
  SAVE_PATHWAY_DATA_SUCCESS,
  UPDATE_MAPPED_DATA_TO_SEND,
} from './actionTypes';

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

export const updateMappedDataRequest = (payload: any) => ({
  type: UPDATE_MAPPED_DATA_TO_SEND,
  payload,
});
