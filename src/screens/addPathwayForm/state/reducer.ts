import {
  SAVE_ADD_PATH_WAY_FORM_FIELDS,
  SEARCH_FOR_INDUSTRY_TYPE_CODE_FAILURE,
  SEARCH_FOR_INDUSTRY_TYPE_CODE_REQUEST,
  SEARCH_FOR_OCCUPATION_TYPE_CODE_FAILURE,
  SEARCH_FOR_OCCUPATION_TYPE_CODE_REQUEST,
  SEARCH_FOR_OCCUPATION_TYPE_CODE_SUCCESS,
  SEARCH_FOR_PROGRESSION_LEVEL_SUCCESS,
  SEARCH_FOR_PROGRESSION_MODAL_FAILURE,
  SEARCH_FOR_PROGRESSION_MODAL_REQUEST,
  SEARCH_FOR_PROGRESSION_MODAL_SUCCESS,
  SEARCH_FOR_SUPPORT_SERVICES_FAILURE,
  SEARCH_FOR_SUPPORT_SERVICES_REQUEST,
  SEARCH_FOR_SUPPORT_SERVICES_SUCCESS,
} from './actionTypes';
import { RootState } from './types';

const initState: RootState = {
  allHasProgressionModel: {
    loading: false,
    data: null,
    valid: false,
  },
  allIndustryTypeCode: {
    loading: false,
    data: null,
    valid: false,
  },
  allOccupationTypeCode: {
    loading: false,
    data: null,
    valid: false,
  },
  allHasProgressionLevel: {
    loading: false,
    data: null,
    valid: false,
  },
  allHasSupportService: {
    loading: false,
    data: null,
    valid: false,
  },
  allFormFields: null,
};

export default (state = initState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case SEARCH_FOR_PROGRESSION_MODAL_REQUEST:
      return {
        ...state,
        allHasProgressionModel: {
          ...state.allHasProgressionModel,
          loading: true,
        },
      };
    case SEARCH_FOR_PROGRESSION_MODAL_SUCCESS:
      return {
        ...state,
        allHasProgressionModel: {
          ...state.allHasProgressionModel,
          loading: false,
          data: action.payload,
          valid: action?.payload?.Valid,
        },
      };
    case SEARCH_FOR_PROGRESSION_MODAL_FAILURE:
      return {
        ...state,
        allHasProgressionModel: {
          ...state.allHasProgressionModel,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case SEARCH_FOR_INDUSTRY_TYPE_CODE_REQUEST:
      return {
        ...state,
        allIndustryTypeCode: {
          ...state.allIndustryTypeCode,
          loading: true,
        },
      };
    case SEARCH_FOR_INDUSTRY_TYPE_CODE_REQUEST:
      return {
        ...state,
        allIndustryTypeCode: {
          ...state.allIndustryTypeCode,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case SEARCH_FOR_INDUSTRY_TYPE_CODE_FAILURE:
      return {
        ...state,
        allIndustryTypeCode: {
          ...state.allIndustryTypeCode,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };

    case SEARCH_FOR_OCCUPATION_TYPE_CODE_REQUEST:
      return {
        ...state,
        allOccupationTypeCode: {
          ...state.allOccupationTypeCode,
          loading: true,
        },
      };
    case SEARCH_FOR_OCCUPATION_TYPE_CODE_SUCCESS:
      return {
        ...state,
        allOccupationTypeCode: {
          ...state.allOccupationTypeCode,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case SEARCH_FOR_OCCUPATION_TYPE_CODE_FAILURE:
      return {
        ...state,
        allOccupationTypeCode: {
          ...state.allOccupationTypeCode,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };

    case SEARCH_FOR_PROGRESSION_LEVEL_SUCCESS:
      return {
        ...state,
        allHasProgressionLevel: {
          ...state.allHasProgressionLevel,
          loading: false,
          data: action.payload,
          valid: action?.payload?.Valid,
        },
      };
    case SAVE_ADD_PATH_WAY_FORM_FIELDS:
      return {
        ...state,
        allFormFields: action.payload,
      };
    case SEARCH_FOR_SUPPORT_SERVICES_REQUEST:
      return {
        ...state,
        allHasSupportService: {
          ...state.allHasSupportService,
          loading: true,
        },
      };
    case SEARCH_FOR_SUPPORT_SERVICES_SUCCESS:
      return {
        ...state,
        allHasSupportService: {
          ...state.allHasSupportService,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case SEARCH_FOR_SUPPORT_SERVICES_FAILURE:
      return {
        ...state,
        allHasSupportService: {
          ...state.allHasSupportService,
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
