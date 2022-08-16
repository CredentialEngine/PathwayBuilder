import { call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../apiConfig/api';
import {
  BASE_URL,
  GET_ALL_ARRAY_OPERATION,
  GET_ALL_COMPARATORS,
  GET_ALL_LOGICAL_OPERATOR,
  GET_ALL_PATHWAY_COMPONENT,
  GET_DATA_FOR_CURRENT_USER,
  GET_DATA_FOR_PATHWAY,
} from '../apiConfig/endpoint';

import {
  getAllPathwayComponentSuccess,
  getAllPathwayComponentFailure,
  getLogicalOperatorsFailure,
  getLogicalOperatorsSuccess,
  getAllComparatorsFailure,
  getAllComparatorsSuccess,
  getAllArrayConceptsFailure,
  getAllArrayConceptsSuccess,
  getCurrentUserDataFailure,
  getCurrentUserDataSuccess,
  getDataForPathwayAndComponentsFailure,
  getDataForPathwayAndComponentsSuccess,
} from './actions';
import {
  GET_ALL_COMPARATORS_REQUEST,
  GET_ARRAY_CONCEPT_REQUEST,
  GET_CURRENT_USER_REQUEST,
  GET_DATA_FOR_PATHWAY_AND_COMPONENTS_REQUEST,
  GET_LOGICAL_OPERATOR_REQUEST,
  GET_PATHWAY_COMPONENT_REQUEST,
} from './actionTypes';

export function* getAllPathwayComponents(): Generator {
  try {
    const result: any = yield call(request, {
      url: `${BASE_URL}${GET_ALL_PATHWAY_COMPONENT}`,
      method: 'GET',
      params: {
        userCreds: 'tara.mueller@protiviti.com~ceI$Awesome',
      },
    });
    yield put(getAllPathwayComponentSuccess(result));
  } catch (error) {
    yield put(getAllPathwayComponentFailure(error));
  }
}

export function* getAllLogicalOperators(): Generator {
  try {
    const result: any = yield call(request, {
      url: `${BASE_URL}${GET_ALL_LOGICAL_OPERATOR}`,
      method: 'GET',
      params: {
        userCreds: 'tara.mueller@protiviti.com~ceI$Awesome',
      },
    });
    yield put(getLogicalOperatorsSuccess(result));
  } catch (error) {
    yield put(getLogicalOperatorsFailure(error));
  }
}

export function* getComparatorsData(): Generator {
  try {
    const result: any = yield call(request, {
      url: `${BASE_URL}${GET_ALL_COMPARATORS}`,
      method: 'GET',
      params: {
        userCreds: 'tara.mueller@protiviti.com~ceI$Awesome',
      },
    });
    yield put(getAllComparatorsSuccess(result));
  } catch (error) {
    yield put(getAllComparatorsFailure(error));
  }
}

export function* getArrayConceptData(): Generator {
  try {
    const result: any = yield call(request, {
      url: `${BASE_URL}${GET_ALL_ARRAY_OPERATION}`,
      method: 'GET',
      params: {
        userCreds: 'tara.mueller@protiviti.com~ceI$Awesome',
      },
    });
    yield put(getAllArrayConceptsSuccess(result));
  } catch (error) {
    yield put(getAllArrayConceptsFailure(error));
  }
}

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

function* saga() {
  yield takeLatest(GET_PATHWAY_COMPONENT_REQUEST, getAllPathwayComponents);
  yield takeLatest(GET_LOGICAL_OPERATOR_REQUEST, getAllLogicalOperators);
  yield takeLatest(GET_ALL_COMPARATORS_REQUEST, getComparatorsData);
  yield takeLatest(GET_ARRAY_CONCEPT_REQUEST, getArrayConceptData);
  yield takeLatest(GET_CURRENT_USER_REQUEST, getCurrentUserData);
  yield takeLatest(
    GET_DATA_FOR_PATHWAY_AND_COMPONENTS_REQUEST,
    getPathwayAndComponentData
  );
}

export default saga;
