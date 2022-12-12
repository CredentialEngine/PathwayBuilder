import { call, debounce, put } from 'redux-saga/effects';

import { PATHWAY_COMPONENT_PROXY_FOR } from '../../../apiConfig/endpoint';
import { IS_LOCALHOST, TEMP_BASE_URL } from '../../../apiConfig/setting';
import TokenManager from '../../../services/tokenManager';

import {
  getAllProxyForResourcesFailure,
  getAllProxyForResourcesSuccess,
} from './actions';
import { GET_ALL_PROXY_FOR_RESCOURCES_REQUEST } from './actionTypes';

export function fetchPostsApi(value: any) {
  const userCreds = IS_LOCALHOST ? TokenManager.getToken() : null;
  const url = new URL(`${TEMP_BASE_URL}${PATHWAY_COMPONENT_PROXY_FOR}`),
    params: any = { userCreds };

  url.search = new URLSearchParams(params).toString();
  const fetchedProxyResources = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  })
    .then((response) => response.json())
    .then((json) => json);

  return fetchedProxyResources;
}

export function* getAllProxyForResources(payload: any): Generator {
  try {
    const fetchedProxyResources = yield call(fetchPostsApi, payload.payload);
    yield put(getAllProxyForResourcesSuccess(fetchedProxyResources));
  } catch (error) {
    yield put(getAllProxyForResourcesFailure(error));
  }
}

function* PreSelectResourceSaga() {
  yield debounce(
    400,
    GET_ALL_PROXY_FOR_RESCOURCES_REQUEST,
    getAllProxyForResources
  );
}

export default PreSelectResourceSaga;
