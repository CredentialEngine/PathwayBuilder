import {
  GET_LEFT_PANEL_PATHWAY_COMPONENTS_FAILURE,
  GET_LEFT_PANEL_PATHWAY_COMPONENTS_REQUEST,
  GET_LEFT_PANEL_PATHWAY_COMPONENTS_SUCCESS,
} from './actionTypes';

export const getLeftPanelPathwayComponentRequest = () => ({
  type: GET_LEFT_PANEL_PATHWAY_COMPONENTS_REQUEST,
});

export const getLeftPanelPathwayComponentSuccess = (payload: any) => ({
  type: GET_LEFT_PANEL_PATHWAY_COMPONENTS_SUCCESS,
  payload,
});

export const getLeftPanelPathwayComponentFailure = (payload: any) => ({
  type: GET_LEFT_PANEL_PATHWAY_COMPONENTS_FAILURE,
  payload,
});
