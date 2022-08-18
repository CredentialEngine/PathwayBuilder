import { call, put, debounce, takeLatest } from 'redux-saga/effects';

import { request } from '../../../apiConfig/api';
import {
  BASE_URL,
  SEARCH_FOR_INDUSTRY_TYPE,
  SEARCH_FOR_OCCUPATION_TYPE,
  SEARCH_FOR_PROGRESSION_MODAL,
} from '../../../apiConfig/endpoint';

import {
  getDataForProgressionModelSuccess,
  getDataForProgressionModelFailure,
  getDataForIndustryTypeCodeSuccess,
  getDataForIndustryTypeCodeFailure,
  getDataForOccupationTypeCodeSuccess,
  getDataForOccupationTypeCodeFailure,
} from './actions';
import {
  SEARCH_FOR_INDUSTRY_TYPE_CODE_REQUEST,
  SEARCH_FOR_OCCUPATION_TYPE_CODE_REQUEST,
  SEARCH_FOR_PROGRESSION_MODAL_REQUEST,
} from './actionTypes';

export function* getAllProgressionModelData(payload: any): Generator {
  try {
    const result: any = yield call(request, {
      url: `${BASE_URL}${SEARCH_FOR_PROGRESSION_MODAL}`,
      method: 'POST',
      params: {
        search: payload.payload,
      },
    });
    yield put(getDataForProgressionModelSuccess(result));
  } catch (error) {
    yield put(getDataForProgressionModelFailure(error));
  }
}

export function* getAllIndustryTypeCodeData(payload: any): Generator {
  try {
    const result: any = yield call(request, {
      url: `${BASE_URL}${SEARCH_FOR_INDUSTRY_TYPE}`,
      method: 'POST',
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
    const result: any = yield call(request, {
      url: `${BASE_URL}${SEARCH_FOR_OCCUPATION_TYPE}`,
      method: 'POST',
      params: {
        search: payload.payload,
      },
    });

    yield put(getDataForOccupationTypeCodeSuccess(result));
  } catch (error) {
    yield put(getDataForOccupationTypeCodeFailure(error));
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
}

export default pathwayFormsaga;
