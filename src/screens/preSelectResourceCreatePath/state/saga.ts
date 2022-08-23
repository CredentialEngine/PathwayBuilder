import { call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../../../apiConfig/api';
import {
  BASE_URL,
  PATHWAY_COMPONENT_PROXY_FOR,
} from '../../../apiConfig/endpoint';

import {
  getAllProxyForResourcesFailure,
  getAllProxyForResourcesSuccess,
} from './actions';
import { GET_ALL_PROXY_FOR_RESCOURCES_REQUEST } from './actionTypes';

export function* getAllProxyForResources(payload: any): Generator {
  try {
    const result: any = yield call(request, {
      url: `${BASE_URL}${PATHWAY_COMPONENT_PROXY_FOR}`,
      method: 'POST',
      params: {
        userCreds: 'tara.mueller@protiviti.com~ceI$Awesome',
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: payload.payload,
    });
    yield put(getAllProxyForResourcesSuccess(result));
  } catch (error) {
    yield put(getAllProxyForResourcesFailure(error));
  }
}

function* PreSelectResourceSaga() {
  yield takeLatest(
    GET_ALL_PROXY_FOR_RESCOURCES_REQUEST,
    getAllProxyForResources
  );
}

export default PreSelectResourceSaga;
