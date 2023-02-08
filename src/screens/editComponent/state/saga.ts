import { call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../../../apiConfig/api';

import {
  GET_ALL_CREDENTIALTYPES,
  GET_ALL_CREDIT_LEVEL_TYPES,
  GET_ALL_CREDIT_UNIT_TYPES,
} from '../../../apiConfig/endpoint';
import { TEMP_BASE_URL, IS_LOCALHOST } from '../../../apiConfig/setting';
import TokenManager from '../../../services/tokenManager';

import {
  getCredentialTypesFailure,
  getCredentialTypesSuccess,
  getCreditUnitTypesFailure,
  getCreditUnitTypesSuccess,
  getCreditLevelTypesFailure,
  getCreditLevelTypesSuccess,
} from './actions';
import {
  GET_CREDENTIAL_TYPES_REQUEST,
  GET_CREDIT_UNIT_TYPES_REQUEST,
  GET_CREDIT_LEVEL_TYPES_REQUEST,
} from './actionTypes';

export function* getAllCredentialTypes(): Generator {
  try {
    const userCreds = IS_LOCALHOST ? TokenManager.getToken() : null;
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${GET_ALL_CREDENTIALTYPES}`,
      method: 'GET',
      params: {
        userCreds,
      },
    });
    yield put(getCredentialTypesSuccess(result));
  } catch (error) {
    yield put(getCredentialTypesFailure(error));
  }
}
export function* getAllCreditUnitypes(): Generator {
  try {
    const userCreds = IS_LOCALHOST ? TokenManager.getToken() : null;
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${GET_ALL_CREDIT_UNIT_TYPES}`,
      method: 'GET',
      params: {
        userCreds,
      },
    });
    yield put(getCreditUnitTypesSuccess(result));
  } catch (error) {
    yield put(getCreditUnitTypesFailure(error));
  }
}
export function* getAllCreditLevelTypes(): Generator {
  try {
    const userCreds = IS_LOCALHOST ? TokenManager.getToken() : null;
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${GET_ALL_CREDIT_LEVEL_TYPES}`,
      method: 'GET',
      params: {
        userCreds,
      },
    });
    yield put(getCreditLevelTypesSuccess(result));
  } catch (error) {
    yield put(getCreditLevelTypesFailure(error));
  }
}

function* addConditionalComponentSaga() {
  yield takeLatest(GET_CREDENTIAL_TYPES_REQUEST, getAllCredentialTypes);
  yield takeLatest(GET_CREDIT_UNIT_TYPES_REQUEST, getAllCreditUnitypes);
  yield takeLatest(GET_CREDIT_LEVEL_TYPES_REQUEST, getAllCreditLevelTypes);
}

export default addConditionalComponentSaga;
