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
import { RootState } from './types';

const initState: RootState = {
  credentialTypeData: {
    loading: false,
    data: null,
    valid: false,
  },
  creditUnitTypeData: {
    loading: false,
    data: null,
    valid: false,
  },
  creditLevelTypeData: {
    loading: false,
    data: null,
    valid: false,
  },
  allLanguages: {
    loading: false,
    data: null,
    valid: false,
  },
};

export default (state = initState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case GET_CREDENTIAL_TYPES_REQUEST:
      return {
        ...state,
        credentialTypeData: { ...state.credentialTypeData, loading: true },
      };
    case GET_CREDENTIAL_TYPES_SUCCESS:
      return {
        ...state,
        credentialTypeData: {
          ...state.credentialTypeData,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case GET_CREDENTIAL_TYPES_FAILURE:
      return {
        ...state,
        credentialTypeData: {
          ...state.credentialTypeData,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case GET_CREDIT_UNIT_TYPES_REQUEST:
      return {
        ...state,
        creditUnitTypeData: { ...state.creditUnitTypeData, loading: true },
      };
    case GET_CREDIT_UNIT_TYPES_SUCCESS:
      return {
        ...state,
        creditUnitTypeData: {
          ...state.creditUnitTypeData,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case GET_CREDIT_UNIT_TYPES_FAILURE:
      return {
        ...state,
        creditUnitTypeData: {
          ...state.creditUnitTypeData,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case GET_CREDIT_LEVEL_TYPES_REQUEST:
      return {
        ...state,
        creditValueTypeData: { ...state.creditLevelTypeData, loading: true },
      };
    case GET_CREDIT_LEVEL_TYPES_SUCCESS:
      return {
        ...state,
        creditValueTypeData: {
          ...state.creditLevelTypeData,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case GET_CREDIT_LEVEL_TYPES_FAILURE:
      return {
        ...state,
        creditValueTypeData: {
          ...state.creditLevelTypeData,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case SEARCH_FOR_LANGUAGE_REQUEST:
      return {
        ...state,
        allLanguages: {
          ...state.allLanguages,
          loading: true,
        },
      };
    case SEARCH_FOR_LANGUAGE_SUCCESS:
      return {
        ...state,
        allLanguages: {
          ...state.allLanguages,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case SEARCH_FOR_LANGUAGE_FAILURE:
      return {
        ...state,
        allLanguages: {
          ...state.allLanguages,
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
