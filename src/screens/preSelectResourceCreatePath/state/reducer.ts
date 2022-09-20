import {
  GET_ALL_PROXY_FOR_RESCOURCES_FAILURE,
  GET_ALL_PROXY_FOR_RESCOURCES_REQUEST,
  GET_ALL_PROXY_FOR_RESCOURCES_SUCCESS,
} from './actionTypes';
import { RootState } from './types';

const initState: RootState = {
  allProxyForResourcesComponent: {
    loading: false,
    data: null,
    valid: false,
  },
};

export default (state = initState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case GET_ALL_PROXY_FOR_RESCOURCES_REQUEST:
      return {
        ...state,
        allProxyForResourcesComponent: {
          ...state.allProxyForResourcesComponent,
          loading: true,
        },
      };
    case GET_ALL_PROXY_FOR_RESCOURCES_SUCCESS:
      return {
        ...state,
        allProxyForResourcesComponent: {
          ...state.allProxyForResourcesComponent,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case GET_ALL_PROXY_FOR_RESCOURCES_FAILURE:
      return {
        ...state,
        allProxyForResourcesComponent: {
          ...state.allProxyForResourcesComponent,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };

    default:
      return {
        ...state,
      };
  }
};
