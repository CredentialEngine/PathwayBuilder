import { call, debounce, put } from 'redux-saga/effects';

import { PATHWAY_COMPONENT_PROXY_FOR } from '../../../apiConfig/endpoint';
import { TEMP_BASE_URL } from '../../../apiConfig/setting';

import {
  getAllProxyForResourcesFailure,
  getAllProxyForResourcesSuccess,
} from './actions';
import { GET_ALL_PROXY_FOR_RESCOURCES_REQUEST } from './actionTypes';

export function fetchPostsApi(value: any) {
  const url = new URL(`${TEMP_BASE_URL}${PATHWAY_COMPONENT_PROXY_FOR}`),
    params = { userCreds: 'tara.mueller@protiviti.com~ceI$Awesome' };

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
