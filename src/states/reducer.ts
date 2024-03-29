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
  SAVE_PATHWAY_SUCCESS,
  SAVE_PATHWAY_FAILURE,
  SAVE_RESOURCE_SUCCESS,
  SAVE_RESOURCE_FAILURE,
  ADD_COMPONENT_FROM_PATHWAY_MODAL,
  SELECT_DESTINATION_REQUEST,
  SAVE_SELECTED_ORGANISATION,
  GET_DATA_FOR_PATHWAY_ON_FIRST_LOAD,
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
  pathwayDataFromEdit: {
    loading: false,
    data: null,
    valid: true,
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
      InstructionalProgram: [
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
    PendingComponents: [],
    ProgressionLevels: [],
    ProgressionModels: [],
    DeletedComponentConditions: [],
    DeletedComponents: [],
  },
  approvePathway: {
    loading: false,
    data: null,
    valid: false,
  },
  savePathway: {
    loading: false,
    data: null,
    valid: false,
  },
  saveResource: {
    loading: false,
    data: null,
    valid: false,
  },
  isDestinationSelected: false,
  selectedOrganization: null,
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
        mappedData: action?.payload?.Data,
        pathwaDataFromEdit: { ...state.pathwayDataFromEdit, valid: true },
      };
    case GET_DATA_FOR_PATHWAY_AND_COMPONENTS_FAILURE:
      return {
        ...state,
        pathwayComponentData: {
          ...state.pathwayComponentData,
          loading: false,
          data: action.payload.Messages,
          valid: action?.payload?.Valid,
          error: true,
        },
      };
    case UPDATE_MAPPED_DATA_TO_SEND:
      return {
        ...state,
        mappedData: action.payload,
      };

    case ADD_COMPONENT_FROM_PATHWAY_MODAL:
      return {
        ...state,
        mappedData: {
          ...state?.mappedData,
          PendingComponents: [
            ...state?.mappedData?.PendingComponents,
            ...action?.payload,
          ],
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
          error: false,
        },
      };
    case PATHWAYBUILDERAPI_APPROVE_PATHWAY_FAILURE:
      return {
        ...state,
        approvePathway: {
          ...state.approvePathway,
          loading: false,
          data: action.payload.Data,
          valid: false,
          error: true,
        },
      };
    case SAVE_PATHWAY_SUCCESS:
      return {
        ...state,
        savePathway: {
          ...state.savePathway,
          loading: false,
          data: action.payload.Messages,
          PathwayId: action.payload.PathwayId,
          valid: action?.payload?.Valid,
          error: false,
        },
      };
    case SAVE_PATHWAY_FAILURE:
      return {
        ...state,
        savePathway: {
          ...state.savePathway,
          loading: false,
          data: action.payload.Messages,
          valid: false,
          error: true,
        },
      };
    case SAVE_RESOURCE_SUCCESS:
      return {
        ...state,
        saveResource: {
          ...state.saveResource,
          loading: false,
          data: action.payload.Messages,
          // PathwayId: action.payload.PathwayId,
          valid: action?.payload?.Valid,
          error: false,
        },
      };
    case SAVE_RESOURCE_FAILURE:
      return {
        ...state,
        saveResource: {
          ...state.saveResource,
          loading: false,
          data: action.payload.Messages,
          valid: action?.payload?.Valid,
          error: true,
        },
      };
    case SELECT_DESTINATION_REQUEST:
      return {
        ...state,
        isDestinationSelected: action.payload.payload,
      };

    case SAVE_SELECTED_ORGANISATION:
      return {
        ...state,
        selectedOrganization: action.payload,
      };

    case GET_DATA_FOR_PATHWAY_ON_FIRST_LOAD:
      return {
        ...state,
        pathwaDataFromEdit: { ...state.pathwayDataFromEdit, valid: true },
      };
    default:
      return {
        ...state,
      };
  }
};
