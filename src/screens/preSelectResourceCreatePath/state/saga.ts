import { call, debounce, put } from 'redux-saga/effects';

import {
  PATHWAY_COMPONENT_PROXY_FOR,
  GET_ORGANIZATION,
} from '../../../apiConfig/endpoint';
import { IS_LOCALHOST, TEMP_BASE_URL } from '../../../apiConfig/setting';
import TokenManager from '../../../services/tokenManager';

import {
  getAllProxyForResourcesFailure,
  getAllProxyForResourcesSuccess,
  getorganizationFailure,
  getorganizationSuccess,
} from './actions';
import {
  GET_ALL_PROXY_FOR_RESCOURCES_REQUEST,
  GET_ALL_ORGANIZATIONS_REQUEST,
} from './actionTypes';

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
export function* fetchPostsApiforOrgs(value: any): Generator {
  const userCreds = IS_LOCALHOST ? TokenManager.getToken() : null;
  const url = new URL(`${TEMP_BASE_URL}${GET_ORGANIZATION}`),
    params: any = { userCreds };
  url.search = new URLSearchParams(params).toString();
  const orgresults = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  })
    .then((response) => response.json())
    .then((json) => json);
  return orgresults;
}
export function* getAllOrganizationslist(payload: any): Generator {
  try {
    const orgresults = yield call(fetchPostsApiforOrgs, payload.payload);
    yield put(getorganizationSuccess(orgresults));
  } catch (error) {
    yield put(getorganizationFailure(error));
  }
}

function* PreSelectResourceSaga() {
  yield debounce(
    400,
    GET_ALL_PROXY_FOR_RESCOURCES_REQUEST,
    getAllProxyForResources
  );
  yield debounce(400, GET_ALL_ORGANIZATIONS_REQUEST, getAllOrganizationslist);
}

export default PreSelectResourceSaga;
