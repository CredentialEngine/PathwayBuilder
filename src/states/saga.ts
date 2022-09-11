import { call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../apiConfig/api';
import {
  BASE_URL,
  GET_DATA_FOR_CURRENT_USER,
  GET_DATA_FOR_PATHWAY,
  PATHWAYBUILDERAPI_APPROVE_PATHWAY,
  SAVE_DATA_FOR_PATHWAY,
} from '../apiConfig/endpoint';

import {
  getCurrentUserDataFailure,
  getCurrentUserDataSuccess,
  getDataForPathwayAndComponentsFailure,
  getDataForPathwayAndComponentsSuccess,
} from './actions';
import {
  GET_CURRENT_USER_REQUEST,
  GET_DATA_FOR_PATHWAY_AND_COMPONENTS_REQUEST,
  PATHWAYBUILDERAPI_APPROVE_PATHWAY_REQUEST,
  SAVE_PATHWAY_DATA_REQUEST,
} from './actionTypes';

export function* getCurrentUserData(): Generator {
  try {
    const result: any = yield call(request, {
      url: `${BASE_URL}${GET_DATA_FOR_CURRENT_USER}`,
      method: 'GET',
      params: {
        userCreds: 'tara.mueller@protiviti.com~ceI$Awesome',
      },
    });
    yield put(getCurrentUserDataSuccess(result));
  } catch (error) {
    yield put(getCurrentUserDataFailure(error));
  }
}

export function* getPathwayAndComponentData(payload: any): Generator {
  try {
    const result: any = yield call(request, {
      url: `${BASE_URL}${GET_DATA_FOR_PATHWAY}${payload?.id}`,
      method: 'GET',
      params: {
        userCreds: 'tara.mueller@protiviti.com~ceI$Awesome',
      },
    });
    yield put(getDataForPathwayAndComponentsSuccess(result));
  } catch (error) {
    yield put(getDataForPathwayAndComponentsFailure(error));
  }
}
export function* approvePathway(payload: any): Generator {
  try {
    const result: any = yield call(request, {
      url: `${BASE_URL}${PATHWAYBUILDERAPI_APPROVE_PATHWAY}${payload?.id}`,
      method: 'POST',
      params: {
        userCreds: 'tara.mueller@protiviti.com~ceI$Awesome',
      },
    });
    yield put(getDataForPathwayAndComponentsSuccess(result));
  } catch (error) {
    yield put(getDataForPathwayAndComponentsFailure(error));
  }
}

export function* getSavePathwayWrapper(payload: any): Generator {
  try {
    const result: any = yield call(request, {
      url: `${BASE_URL}${SAVE_DATA_FOR_PATHWAY}`,
      method: 'POST',
      params: {
        userCreds: 'tara.mueller@protiviti.com~ceI$Awesome',
      },
      // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: payload.payload,
    });
    yield put(getDataForPathwayAndComponentsSuccess(result));
  } catch (error) {
    yield put(getDataForPathwayAndComponentsFailure(error));
  }
}

function* saga() {
  yield takeLatest(GET_CURRENT_USER_REQUEST, getCurrentUserData);
  yield takeLatest(
    GET_DATA_FOR_PATHWAY_AND_COMPONENTS_REQUEST,
    getPathwayAndComponentData
  );
  yield takeLatest(PATHWAYBUILDERAPI_APPROVE_PATHWAY_REQUEST, approvePathway);
  yield takeLatest(SAVE_PATHWAY_DATA_REQUEST, getSavePathwayWrapper);
}

export default saga;
