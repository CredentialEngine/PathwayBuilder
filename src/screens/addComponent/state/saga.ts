import { call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../../../apiConfig/api';

import {
  GET_ALL_ARRAY_OPERATION,
  GET_ALL_COMPARATORS,
  GET_ALL_LOGICAL_OPERATOR,
  SEARCH_FOR_LEFT_AND_RIGHT_OPERAND,
} from '../../../apiConfig/endpoint';
import { TEMP_BASE_URL, IS_LOCALHOST } from '../../../apiConfig/setting';
import TokenManager from '../../../services/tokenManager';

import {
  getAllArrayConceptsFailure,
  getAllArrayConceptsSuccess,
  getAllComparatorsFailure,
  getAllComparatorsSuccess,
  getLogicalOperatorsFailure,
  getLogicalOperatorsSuccess,
} from './actions';
import {
  GET_ALL_COMPARATORS_REQUEST,
  GET_ARRAY_CONCEPT_REQUEST,
  GET_CONSTRAINT_OPERAND_REQUEST,
  GET_LOGICAL_OPERATOR_REQUEST,
} from './actionTypes';

export function* getAllLogicalOperators(): Generator {
  try {
    const userCreds = IS_LOCALHOST ? TokenManager.getToken() : null;
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${GET_ALL_LOGICAL_OPERATOR}`,
      method: 'GET',
      params: {
        userCreds,
      },
    });
    yield put(getLogicalOperatorsSuccess(result));
  } catch (error) {
    yield put(getLogicalOperatorsFailure(error));
  }
}

export function* getComparatorsData(): Generator {
  try {
    const userCreds = IS_LOCALHOST ? TokenManager.getToken() : null;
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${GET_ALL_COMPARATORS}`,
      method: 'GET',
      params: {
        userCreds,
      },
    });
    yield put(getAllComparatorsSuccess(result));
  } catch (error) {
    yield put(getAllComparatorsFailure(error));
  }
}

export function* getArrayConceptData(): Generator {
  try {
    const userCreds = IS_LOCALHOST ? TokenManager.getToken() : null;
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${GET_ALL_ARRAY_OPERATION}`,
      method: 'GET',
      params: {
        userCreds,
      },
    });
    yield put(getAllArrayConceptsSuccess(result));
  } catch (error) {
    yield put(getAllArrayConceptsFailure(error));
  }
}

export function* getAllConstraintOperand(data: any): Generator {
  try {
    const userCreds = IS_LOCALHOST ? TokenManager.getToken() : null;
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${SEARCH_FOR_LEFT_AND_RIGHT_OPERAND}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        userCreds,
      },

      body: JSON.stringify(data),
    });
    yield put(getLogicalOperatorsSuccess(result));
  } catch (error) {
    yield put(getLogicalOperatorsFailure(error));
  }
}

function* addConditionalComponentSaga() {
  yield takeLatest(GET_LOGICAL_OPERATOR_REQUEST, getAllLogicalOperators);
  yield takeLatest(GET_ALL_COMPARATORS_REQUEST, getComparatorsData);
  yield takeLatest(GET_ARRAY_CONCEPT_REQUEST, getArrayConceptData);
  yield takeLatest(GET_CONSTRAINT_OPERAND_REQUEST, getAllConstraintOperand);
}

export default addConditionalComponentSaga;
