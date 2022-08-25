import { call, debounce, put } from 'redux-saga/effects';

import {
  BASE_URL,
  PATHWAY_COMPONENT_PROXY_FOR,
} from '../../../apiConfig/endpoint';

import {
  getAllProxyForResourcesFailure,
  getAllProxyForResourcesSuccess,
} from './actions';
import { GET_ALL_PROXY_FOR_RESCOURCES_REQUEST } from './actionTypes';

export function fetchPostsApi(value: any) {
  const url = new URL(`${BASE_URL}${PATHWAY_COMPONENT_PROXY_FOR}`),
    params = { userCreds: 'tara.mueller@protiviti.com~ceI$Awesome' };

  url.search = new URLSearchParams(params).toString();
  const fetchedProxyResources = fetch(url, {
    method: 'POST',
    body: JSON.stringify(value),
  })
    .then((response) => response.json())
    .then((json) => json);

  return fetchedProxyResources;
}

export function* getAllProxyForResources(payload: any): Generator {
  try {
    const fetchedProxyResources = yield call(fetchPostsApi, payload.payload);

    // const result: any = yield call(request, {
    //   url: `${BASE_URL}${PATHWAY_COMPONENT_PROXY_FOR}`,
    //   method: 'post',
    //   params: {
    //     userCreds: 'tara.mueller@protiviti.com~ceI$Awesome',
    //   },
    //   // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   data: payload.payload,
    // });
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
