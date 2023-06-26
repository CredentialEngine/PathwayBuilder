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
  PATHWAYBUILDERAPI_APPROVE_PATHWAY_REQUEST,
  PATHWAYBUILDERAPI_APPROVE_PATHWAY_SUCCESS,
  PATHWAYBUILDERAPI_APPROVE_PATHWAY_FAILURE,
  SAVE_PATHWAY_SUCCESS,
  SAVE_PATHWAY_FAILURE,
  ADD_COMPONENT_FROM_PATHWAY_MODAL,
  SELECT_DESTINATION_REQUEST,
  SAVE_SELECTED_ORGANISATION,
  GET_DATA_FOR_PATHWAY_ON_FIRST_LOAD,
  SAVE_RESOURCE_FAILURE,
  SAVE_RESOURCE_REQUEST,
  SAVE_RESOURCE_SUCCESS,
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

export const getDataForPathwayAndComponentsRequest = (id: string) => ({
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
export const approvePathwayRequest = (id: any) => ({
  type: PATHWAYBUILDERAPI_APPROVE_PATHWAY_REQUEST,
  id,
});
export const approvePathwaySuccess = (payload: any) => ({
  type: PATHWAYBUILDERAPI_APPROVE_PATHWAY_SUCCESS,
  payload,
});
export const approvePathwayFailure = (payload: any) => ({
  type: PATHWAYBUILDERAPI_APPROVE_PATHWAY_FAILURE,
  payload,
});

export const updateMappedDataRequest = (payload: any) => ({
  type: UPDATE_MAPPED_DATA_TO_SEND,
  payload,
});

export const savePathwaySuccess = (payload: any) => ({
  type: SAVE_PATHWAY_SUCCESS,
  payload,
});

export const savePathwayFailure = (payload: any) => ({
  type: SAVE_PATHWAY_FAILURE,
  payload,
});
export const addComponentFromPathwayModal = (payload: any) => ({
  type: ADD_COMPONENT_FROM_PATHWAY_MODAL,
  payload,
});

export const selectDestination = (payload: boolean) => ({
  type: SELECT_DESTINATION_REQUEST,
  payload,
});

export const saveSelectedOrganization = (payload: any) => ({
  type: SAVE_SELECTED_ORGANISATION,
  payload,
});

export const onFirstLoad = () => ({
  type: GET_DATA_FOR_PATHWAY_ON_FIRST_LOAD,
});
export const saveResourceRequest = (payload: any) => ({
  type: SAVE_RESOURCE_REQUEST,
  payload,
});

export const saveResourceSuccess = (payload: any) => ({
  type: SAVE_RESOURCE_SUCCESS,
  payload,
});

export const saveResourceFailure = (payload: any) => ({
  type: SAVE_RESOURCE_FAILURE,
  payload,
});
