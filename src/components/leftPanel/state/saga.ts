import { call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../../../apiConfig/api';
import {
  BASE_USER_CREDS,
  GET_ALL_PATHWAY_COMPONENT,
} from '../../../apiConfig/endpoint';
import { IS_LOCALHOST, TEMP_BASE_URL } from '../../../apiConfig/setting';

import {
  getLeftPanelPathwayComponentFailure,
  getLeftPanelPathwayComponentSuccess,
} from './actions';

import { GET_LEFT_PANEL_PATHWAY_COMPONENTS_REQUEST } from './actionTypes';

export function* getAllLeftPathwayComponents(): Generator {
  try {
    const userCreds = IS_LOCALHOST ? BASE_USER_CREDS : null;
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${GET_ALL_PATHWAY_COMPONENT}`,
      method: 'GET',
      params: {
        userCreds,
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
