import {
  GET_CURRENT_USER_FAILURE,
  GET_CURRENT_USER_REQUEST,
  GET_CURRENT_USER_SUCCESS,
  GET_DATA_FOR_PATHWAY_AND_COMPONENTS_FAILURE,
  GET_DATA_FOR_PATHWAY_AND_COMPONENTS_REQUEST,
  GET_DATA_FOR_PATHWAY_AND_COMPONENTS_SUCCESS,
} from './actionTypes';
import { RootState } from './types';

const initState: RootState = {
  currentUserData: {
    loading: false,
    data: null,
    valid: false,
  },
  pathwayComponentData: {
    loading: false,
    data: null,
    valid: false,
  },
};

export default (state = initState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case GET_CURRENT_USER_REQUEST:
      return {
        ...state,
        currentUserData: { ...state.currentUserData, loading: true },
      };
    case GET_CURRENT_USER_SUCCESS:
      return {
        ...state,
        currentUserData: {
          ...state.currentUserData,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case GET_CURRENT_USER_FAILURE:
      return {
        ...state,
        currentUserData: {
          ...state.currentUserData,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };

    case GET_DATA_FOR_PATHWAY_AND_COMPONENTS_REQUEST:
      return {
        ...state,
        pathwayComponentData: { ...state.pathwayComponentData, loading: true },
      };
    case GET_DATA_FOR_PATHWAY_AND_COMPONENTS_SUCCESS:
      return {
        ...state,
        pathwayComponentData: {
          ...state.pathwayComponentData,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case GET_DATA_FOR_PATHWAY_AND_COMPONENTS_FAILURE:
      return {
        ...state,
        pathwayComponentData: {
          ...state.pathwayComponentData,
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
