import { call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../apiConfig/api';
import {
  BASE_USER_CREDS,
  GET_DATA_FOR_CURRENT_USER,
  GET_DATA_FOR_PATHWAY,
  PATHWAYBUILDERAPI_APPROVE_PATHWAY,
  SAVE_DATA_FOR_PATHWAY,
} from '../apiConfig/endpoint';
import { TEMP_BASE_URL } from '../apiConfig/setting';

import {
  approvePathwayFailure,
  approvePathwaySuccess,
  getCurrentUserDataFailure,
  getCurrentUserDataSuccess,
  getDataForPathwayAndComponentsFailure,
  getDataForPathwayAndComponentsSuccess,
  savePathwayFailure,
  savePathwaySuccess,
} from './actions';
import {
  GET_CURRENT_USER_REQUEST,
  GET_DATA_FOR_PATHWAY_AND_COMPONENTS_REQUEST,
  PATHWAYBUILDERAPI_APPROVE_PATHWAY_REQUEST,
  SAVE_PATHWAY_DATA_REQUEST,
} from './actionTypes';

export function* getCurrentUserData(): Generator {
  try {
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${GET_DATA_FOR_CURRENT_USER}`,

      method: 'GET',

      headers: {
        'Content-Type': 'application/json',
      },

      params: {
        userCreds: `${BASE_USER_CREDS}`,
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
      url: `${TEMP_BASE_URL}${GET_DATA_FOR_PATHWAY}${payload?.id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        userCreds: `${BASE_USER_CREDS}`,
      },
    });
    if (result.Valid) {
      yield put(getDataForPathwayAndComponentsSuccess(result));
    } else if (!result.Valid && result?.Messages?.length > 0) {
      yield put(getDataForPathwayAndComponentsFailure(result));
    }
  } catch (error) {
    yield put(getDataForPathwayAndComponentsFailure(error));
  }
}
export function* approvePathway(payload: any): Generator {
  try {
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${PATHWAYBUILDERAPI_APPROVE_PATHWAY}${payload?.id}`,
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
      params: {
        userCreds: `${BASE_USER_CREDS}`,
      },
    });
    if (result.Data.Messages.length === 0) {
      yield put(approvePathwaySuccess(result));
    } else if (!result.Data.Valid && result.Data.Messages.length > 0) {
      yield put(approvePathwayFailure(result));
    }
  } catch (error) {
    yield put(approvePathwayFailure(error));
  }
}
// export async function savePathwayWrapper(data: any) {
//   try {
//     const res = await fetch(
//       'https://sandbox.credentialengine.org/publisher/PathwayBuilderApi/PathwayBuilderApi/Save/Pathway',
//       {
//         method: 'post', // *GET, POST, PUT, DELETE, etc.
//         body: JSON.stringify(data), // body data type must match "Content-Type" header
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     ).then(async (response) => {
//       const json = await response.json();
//       return json;
//     });
//     return res;
//   } catch (error: any) {
//     noop;
//   }
// }
export function* getSavePathwayWrapper(payload: any): Generator {
  try {
    const result: any = yield call(request, {
      url: `${TEMP_BASE_URL}${SAVE_DATA_FOR_PATHWAY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        userCreds: `${BASE_USER_CREDS}`,
      },
      data: JSON.stringify(payload.payload),
    });
    if (result.Valid) {
      yield put(savePathwaySuccess(result));
    } else if (!result.Valid && result?.Messages?.length > 0) {
      yield put(savePathwayFailure(result));
    }
  } catch (error) {
    yield put(getDataForPathwayAndComponentsFailure(error));
  }
}

function* saga() {
  yield takeLatest(GET_CURRENT_USER_REQUEST, getCurrentUserData);
  yield takeLatest(
    GET_DATA_FOR_PATHWAY_AND_COMPONENTS_REQUEST,
    getPathwayAndComponentData
  );
  yield takeLatest(PATHWAYBUILDERAPI_APPROVE_PATHWAY_REQUEST, approvePathway);
  yield takeLatest(SAVE_PATHWAY_DATA_REQUEST, getSavePathwayWrapper);
}

export default saga;
