import { call, put, takeLatest } from 'redux-saga/effects';

import Message from '../../src/components/message';
import { request } from '../apiConfig/api';
import {
  GET_DATA_FOR_CURRENT_USER,
  GET_DATA_FOR_PATHWAY,
  PATHWAYBUILDERAPI_APPROVE_PATHWAY,
  SAVE_DATA_FOR_PATHWAY,
  SAVE_DATA_FOR_RESOURCE,
} from '../apiConfig/endpoint';
import { IS_LOCALHOST, TEMP_BASE_URL } from '../apiConfig/setting';
import TokenManager from '../services/tokenManager';

import {
  approvePathwayFailure,
  approvePathwaySuccess,
  getCurrentUserDataFailure,
  getCurrentUserDataSuccess,
  getDataForPathwayAndComponentsFailure,
  getDataForPathwayAndComponentsSuccess,
  savePathwayFailure,
  savePathwaySuccess,
  saveResourceFailure,
  saveResourceSuccess,
} from './actions';
import {
  GET_CURRENT_USER_REQUEST,
  GET_DATA_FOR_PATHWAY_AND_COMPONENTS_REQUEST,
  PATHWAYBUILDERAPI_APPROVE_PATHWAY_REQUEST,
  SAVE_PATHWAY_DATA_REQUEST,
  SAVE_RESOURCE_REQUEST,
} from './actionTypes';

export function* getCurrentUserData(): Generator {
  try {
    const userCreds = IS_LOCALHOST ? TokenManager.getToken() : null;
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${GET_DATA_FOR_CURRENT_USER}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        userCreds,
      },
    });
    if (result.Valid) {
      yield put(getCurrentUserDataSuccess(result));
    } else if (!result.Valid && result?.Messages?.length > 0) {
      yield put(getCurrentUserDataFailure(result));
      result?.Messages?.map((message: any) =>
        Message({
          description: message,
          type: 'error',
        })
      );
    }
  } catch (error) {
    yield put(getCurrentUserDataFailure(error));
  }
}

export function* getPathwayAndComponentData(payload: any): Generator {
  try {
    const userCreds = IS_LOCALHOST ? TokenManager.getToken() : null;
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${GET_DATA_FOR_PATHWAY}${payload?.id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        userCreds,
      },
    });
    if (result.Valid) {
      yield put(getDataForPathwayAndComponentsSuccess(result));
    } else if (!result.Valid && result?.Messages?.length > 0) {
      yield put(getDataForPathwayAndComponentsFailure(result));
      result?.Messages?.map((message: any) =>
        Message({
          description: message,
          type: 'error',
        })
      );
    }
  } catch (error) {
    yield put(getDataForPathwayAndComponentsFailure(error));
  }
}
export function* approvePathway(payload: any): Generator {
  try {
    const userCreds = IS_LOCALHOST ? TokenManager.getToken() : null;
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${PATHWAYBUILDERAPI_APPROVE_PATHWAY}${payload?.id}`,
      method: 'POST',
      params: {
        userCreds,
      },
    });
    if (result.Data.Messages.length === 0) {
      yield put(approvePathwaySuccess(result));
    } else if (!result.Data.Valid && result.Data.Messages.length > 0) {
      yield put(approvePathwayFailure(result));
    }
  } catch (error) {
    yield put(approvePathwayFailure(error));
  }
}
export function* getSavePathwayWrapper(payload: any): Generator {
  try {
    const userCreds = IS_LOCALHOST ? TokenManager.getToken() : null;
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${SAVE_DATA_FOR_PATHWAY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        userCreds,
      },
      data: JSON.stringify(payload.payload),
    });
    if (result.Valid) {
      yield put(savePathwaySuccess(result));
    } else if (!result.Valid && result?.Messages?.length > 0) {
      yield put(savePathwayFailure(result));
    }
  } catch (error) {
    yield put(getDataForPathwayAndComponentsFailure(error));
  }
}

export function* getSaveResource(payload: any): Generator {
  try {
    const userCreds = IS_LOCALHOST ? TokenManager.getToken() : null;
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${SAVE_DATA_FOR_RESOURCE}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        userCreds,
      },
      data: JSON.stringify(payload.payload),
    });
    if (result.Valid) {
      yield put(saveResourceSuccess(result));
    } else if (!result.Valid && result?.Messages?.length > 0) {
      yield put(saveResourceFailure(result));
    }
  } catch (error) {
    yield put(saveResourceFailure(error));
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
  yield takeLatest(SAVE_RESOURCE_REQUEST, getSaveResource);
}

export default saga;
