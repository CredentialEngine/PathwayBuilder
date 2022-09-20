import {
  GET_ALL_COMPARATORS_FAILURE,
  GET_ALL_COMPARATORS_REQUEST,
  GET_ALL_COMPARATORS_SUCCESS,
  GET_ARRAY_CONCEPT_FAILURE,
  GET_ARRAY_CONCEPT_REQUEST,
  GET_ARRAY_CONCEPT_SUCCESS,
  GET_LOGICAL_OPERATOR_FAILURE,
  GET_LOGICAL_OPERATOR_REQUEST,
  GET_LOGICAL_OPERATOR_SUCCESS,
  GET_CONSTRAINT_OPERAND_REQUEST,
  GET_CONSTRAINT_OPERAND_SUCCESS,
  GET_CONSTRAINT_OPERAND_FAILURE,
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
  constraintOperantData: {
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
    case GET_CONSTRAINT_OPERAND_REQUEST:
      return {
        ...state,
        constraintOperantData: {
          ...state.constraintOperantData,
          loading: true,
        },
      };
    case GET_CONSTRAINT_OPERAND_SUCCESS:
      return {
        ...state,
        constraintOperantData: {
          ...state.constraintOperantData,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case GET_CONSTRAINT_OPERAND_FAILURE:
      return {
        ...state,
        constraintOperantData: {
          ...state.constraintOperantData,
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
