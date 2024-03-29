import { call, put, debounce, takeLatest } from 'redux-saga/effects';

import { request } from '../../../apiConfig/api';
import {
  SEARCH_FOR_INDUSTRY_TYPE,
  SEARCH_FOR_OCCUPATION_TYPE,
  SEARCH_FOR_PROGRESSION_MODAL,
  SEARCH_FOR_HAS_SUPPORT_SERVICE,
} from '../../../apiConfig/endpoint';
import { IS_LOCALHOST, TEMP_BASE_URL } from '../../../apiConfig/setting';

import TokenManager from '../../../services/tokenManager';

import {
  getDataForProgressionModelSuccess,
  getDataForProgressionModelFailure,
  getDataForIndustryTypeCodeSuccess,
  getDataForIndustryTypeCodeFailure,
  getDataForOccupationTypeCodeSuccess,
  getDataForOccupationTypeCodeFailure,
  getDataForSupportServicesSuccess,
  getDataForSupportServicesFailure,
} from './actions';
import {
  SEARCH_FOR_INDUSTRY_TYPE_CODE_REQUEST,
  SEARCH_FOR_OCCUPATION_TYPE_CODE_REQUEST,
  SEARCH_FOR_PROGRESSION_MODAL_REQUEST,
  SEARCH_FOR_SUPPORT_SERVICES_REQUEST,
} from './actionTypes';

export function* getAllProgressionModelData(payload: any): Generator {
  try {
    const userCreds = IS_LOCALHOST ? TokenManager.getToken() : null;
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${SEARCH_FOR_PROGRESSION_MODAL}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        userCreds,
      },
      data: payload.payload,
    });
    yield put(getDataForProgressionModelSuccess(result));
  } catch (error) {
    yield put(getDataForProgressionModelFailure(error));
  }
}

export function* getAllIndustryTypeCodeData(payload: any): Generator {
  try {
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${SEARCH_FOR_INDUSTRY_TYPE}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        search: payload.payload,
      },
    });

    yield put(getDataForIndustryTypeCodeSuccess(result));
  } catch (error) {
    yield put(getDataForIndustryTypeCodeFailure(error));
  }
}

export function* getAllOccupationTypeCodeData(payload: any): Generator {
  try {
    const userCreds = IS_LOCALHOST ? TokenManager.getToken() : null;
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${SEARCH_FOR_OCCUPATION_TYPE}`,
      method: 'POST',
      params: {
        userCreds,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(payload.payload),
    });
    yield put(getDataForOccupationTypeCodeSuccess(result));
  } catch (error) {
    yield put(getDataForOccupationTypeCodeFailure(error));
  }
}

export function* getAllSupportServicesData(payload: any): Generator {
  try {
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${SEARCH_FOR_HAS_SUPPORT_SERVICE}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        search: payload.payload,
      },
    });

    yield put(getDataForSupportServicesSuccess(result));
  } catch (error) {
    yield put(getDataForSupportServicesFailure(error));
  }
}
function* pathwayFormsaga() {
  yield debounce(
    400,
    SEARCH_FOR_PROGRESSION_MODAL_REQUEST,
    getAllProgressionModelData
  );
  yield debounce(
    400,
    SEARCH_FOR_INDUSTRY_TYPE_CODE_REQUEST,
    getAllIndustryTypeCodeData
  );
  yield takeLatest(
    SEARCH_FOR_OCCUPATION_TYPE_CODE_REQUEST,
    getAllOccupationTypeCodeData
  );
  yield takeLatest(
    SEARCH_FOR_SUPPORT_SERVICES_REQUEST,
    getAllSupportServicesData
  );
}

export default pathwayFormsaga;
