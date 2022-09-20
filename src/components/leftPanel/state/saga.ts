import { call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../../../apiConfig/api';
import {
  BASE_URL,
  GET_ALL_PATHWAY_COMPONENT,
} from '../../../apiConfig/endpoint';

import {
  getLeftPanelPathwayComponentFailure,
  getLeftPanelPathwayComponentSuccess,
} from './actions';

import { GET_LEFT_PANEL_PATHWAY_COMPONENTS_REQUEST } from './actionTypes';

export function* getAllLeftPathwayComponents(): Generator {
  try {
    const result: any = yield call(request, {
      url: `${BASE_URL}${GET_ALL_PATHWAY_COMPONENT}`,
      method: 'GET',
      params: {
        userCreds: 'tara.mueller@protiviti.com~ceI$Awesome',
      },
    });
    yield put(getLeftPanelPathwayComponentSuccess(result));
  } catch (error) {
    yield put(getLeftPanelPathwayComponentFailure(error));
  }
}

function* leftPanelSaga() {
  yield takeLatest(
    GET_LEFT_PANEL_PATHWAY_COMPONENTS_REQUEST,
    getAllLeftPathwayComponents
  );
}

export default leftPanelSaga;
