import {
  GET_ALL_PROXY_FOR_RESCOURCES_FAILURE,
  GET_ALL_PROXY_FOR_RESCOURCES_REQUEST,
  GET_ALL_PROXY_FOR_RESCOURCES_SUCCESS,
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
