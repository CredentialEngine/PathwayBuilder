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
} from './actionTypes';
import { RootState } from './types';

const initState: RootState = {
  logicalOperatorData: {
    loading: false,
    data: null,
    valid: false,
  },
  comparatorsData: {
    loading: false,
    data: null,
    valid: false,
  },
  arrayOperationData: {
    loading: false,
    data: null,
    valid: false,
  },
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
    case GET_LOGICAL_OPERATOR_REQUEST:
      return {
        ...state,
        logicalOperatorData: { ...state.logicalOperatorData, loading: true },
      };
    case GET_LOGICAL_OPERATOR_SUCCESS:
      return {
        ...state,
        logicalOperatorData: {
          ...state.logicalOperatorData,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case GET_LOGICAL_OPERATOR_FAILURE:
      return {
        ...state,
        logicalOperatorData: {
          ...state.logicalOperatorData,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };

    case GET_ALL_COMPARATORS_REQUEST:
      return {
        ...state,
        comparatorsData: { ...state.comparatorsData, loading: true },
      };
    case GET_ALL_COMPARATORS_SUCCESS:
      return {
        ...state,
        comparatorsData: {
          ...state.comparatorsData,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case GET_ALL_COMPARATORS_FAILURE:
      return {
        ...state,
        comparatorsData: {
          ...state.comparatorsData,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };

    case GET_ARRAY_CONCEPT_REQUEST:
      return {
        ...state,
        arrayOperationData: { ...state.arrayOperationData, loading: true },
      };
    case GET_ARRAY_CONCEPT_SUCCESS:
      return {
        ...state,
        arrayOperationData: {
          ...state.arrayOperationData,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case GET_ARRAY_CONCEPT_FAILURE:
      return {
        ...state,
        arrayOperationData: {
          ...state.arrayOperationData,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };

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
