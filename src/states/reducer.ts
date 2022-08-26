import {
  GET_CURRENT_USER_FAILURE,
  GET_CURRENT_USER_REQUEST,
  GET_CURRENT_USER_SUCCESS,
  GET_DATA_FOR_PATHWAY_AND_COMPONENTS_FAILURE,
  GET_DATA_FOR_PATHWAY_AND_COMPONENTS_REQUEST,
  GET_DATA_FOR_PATHWAY_AND_COMPONENTS_SUCCESS,
  UPDATE_MAPPED_DATA_TO_SEND,
  PATHWAYBUILDERAPI_APPROVE_PATHWAY_REQUEST,
  PATHWAYBUILDERAPI_APPROVE_PATHWAY_SUCCESS,
  PATHWAYBUILDERAPI_APPROVE_PATHWAY_FAILURE,
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
  mappedData: {
    ComponentConditions: [],
    Constraints: [],
    Pathway: {
      Id: 0,
      Uri: '',
      Name: '',
      Organization: {
        id: 0,
        name: '',
        cTID: '',
        codedNotation: '',
        rowId: '',
        description: '',
        uri: '',
        type: '',
      },
      Description: '',
      CTID: '',
      HasDestinationComponent: [], //URI for Pathway Component
      HasProgressionModel: [], //URI for Progression Model
      IndustryType: [
        {
          id: 0,
          name: '',
          cTID: '',
          codedNotation: '',
          rowId: '',
          description: '',
          uri: '',
          type: '',
        },
      ],
      OccupationType: [
        {
          id: 0,
          name: '',
          cTID: '',
          codedNotation: '',
          rowId: '',
          description: '',
          uri: '',
          type: '',
        },
      ],
      SubjectWebpage: '',
      Keyword: [],
      Subject: [],
      LastUpdated: '',
    },
    PathwayComponents: [],
    PendingComponent: [],
    ProgressionLevels: [],
    ProgressionModels: [],
  },
  approvePathway: {
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
    case UPDATE_MAPPED_DATA_TO_SEND:
      return {
        ...state,
        mappedData: {
          ...action.payload,
        },
      };
    case PATHWAYBUILDERAPI_APPROVE_PATHWAY_REQUEST:
      return {
        ...state,
        approvePathway: {
          ...state.approvePathway,
          loading: true,
        },
      };
    case PATHWAYBUILDERAPI_APPROVE_PATHWAY_SUCCESS:
      return {
        ...state,
        approvePathway: {
          ...state.approvePathway,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case PATHWAYBUILDERAPI_APPROVE_PATHWAY_FAILURE:
      return {
        ...state,
        approvePathway: {
          ...state.approvePathway,
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
