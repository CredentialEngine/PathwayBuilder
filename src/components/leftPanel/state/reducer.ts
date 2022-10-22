import {
  ADD_COMPONENT_TO_LEFT_PANEL,
  GET_LEFT_PANEL_PATHWAY_COMPONENTS_FAILURE,
  GET_LEFT_PANEL_PATHWAY_COMPONENTS_REQUEST,
  GET_LEFT_PANEL_PATHWAY_COMPONENTS_SUCCESS,
} from './actionTypes';
import { RootState } from './types';

const initState: RootState = {
  allLeftPathwayComponent: {
    loading: false,
    data: null,
    valid: false,
  },
};

export default (state = initState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case GET_LEFT_PANEL_PATHWAY_COMPONENTS_REQUEST:
      return {
        ...state,
        allLeftPathwayComponent: {
          ...state.allLeftPathwayComponent,
          loading: true,
        },
      };
    case GET_LEFT_PANEL_PATHWAY_COMPONENTS_SUCCESS:
      return {
        ...state,
        allLeftPathwayComponent: {
          ...state.allLeftPathwayComponent,
          loading: false,
          data: action.payload.Data,
          valid: action?.payload?.Valid,
        },
      };
    case GET_LEFT_PANEL_PATHWAY_COMPONENTS_FAILURE:
      return {
        ...state,
        allLeftPathwayComponent: {
          ...state.allLeftPathwayComponent,
          loading: false,
          data: action.payload.Data, // Need to add data as an empty array on error.
          valid: action?.payload?.Valid,
        },
      };

    case ADD_COMPONENT_TO_LEFT_PANEL:
      console.log('payload', action);
      return {
        ...state,
        allLeftPathwayComponent: {
          ...state.allLeftPathwayComponent,
          data: [...state?.allLeftPathwayComponent?.data, ...action?.payload],
        },
      };

    default:
      return {
        ...state,
      };
  }
};
