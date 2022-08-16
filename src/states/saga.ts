import { call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../apiConfig/api';
import { BASE_URL, ENDPOINT } from '../apiConfig/endpoint';

import { firstCallFailure, firstCallSuccess } from './actions';
import { FIRST_CALL_REQUEST } from './actionTypes';

export function* doFirstCall(): Generator {
  try {
    const result: any = yield call(request, {
      url: `${BASE_URL}${ENDPOINT}`,
      method: 'GET',
      params: {
        userCreds: 'tara.mueller@protiviti.com~ceI$Awesome',
      },
    });
    yield put(firstCallSuccess(result));
  } catch (error) {
    yield put(firstCallFailure(error));
  }
}

function* saga() {
  yield takeLatest(FIRST_CALL_REQUEST, doFirstCall);
}

export default saga;
