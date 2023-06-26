import {
  GET_ALL_PROXY_FOR_RESCOURCES_FAILURE,
  GET_ALL_PROXY_FOR_RESCOURCES_REQUEST,
  GET_ALL_PROXY_FOR_RESCOURCES_SUCCESS,
  GET_ALL_ORGANIZATIONS_FAILURE,
  GET_ALL_ORGANIZATIONS_REQUEST,
  GET_ALL_ORGANIZATIONS_SUCCESS,
} from './actionTypes';

export const getAllProxyForResourcesRequest = (payload: any) => ({
  type: GET_ALL_PROXY_FOR_RESCOURCES_REQUEST,
  payload,
});

export const getAllProxyForResourcesSuccess = (payload: any) => ({
  type: GET_ALL_PROXY_FOR_RESCOURCES_SUCCESS,
  payload,
});

export const getAllProxyForResourcesFailure = (payload: any) => ({
  type: GET_ALL_PROXY_FOR_RESCOURCES_FAILURE,
  payload,
});
export const getorganizationRequest = (payload: any) => ({
  type: GET_ALL_ORGANIZATIONS_REQUEST,
  payload,
});

export const getorganizationSuccess = (payload: any) => ({
  type: GET_ALL_ORGANIZATIONS_SUCCESS,
  payload,
});

export const getorganizationFailure = (payload: any) => ({
  type: GET_ALL_ORGANIZATIONS_FAILURE,
  payload,
});
