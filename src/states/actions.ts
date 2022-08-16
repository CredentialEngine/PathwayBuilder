import {
  FIRST_CALL_FAILURE,
  FIRST_CALL_REQUEST,
  FIRST_CALL_SUCCESS,
} from './actionTypes';

export const firstCallRequest = () => ({
  type: FIRST_CALL_REQUEST,
});

export const firstCallSuccess = (payload: any) => ({
  type: FIRST_CALL_SUCCESS,
  payload,
});

export const firstCallFailure = (payload: any) => ({
  type: FIRST_CALL_FAILURE,
  payload,
});
