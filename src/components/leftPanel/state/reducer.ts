import {
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
