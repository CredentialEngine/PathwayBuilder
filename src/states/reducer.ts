import {
  FIRST_CALL_FAILURE,
  FIRST_CALL_REQUEST,
  FIRST_CALL_SUCCESS,
} from './actionTypes';
import { RootState } from './types';

const initState: RootState = {
  isLogin: false,
  firstCallResponse: [],
};

export default (state = initState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case FIRST_CALL_REQUEST:
      return {
        ...state,
        firstCallResponse: [],
      };
    case FIRST_CALL_SUCCESS:
      return {
        ...state,
        firstCallResponse: action.payload,
      };
    case FIRST_CALL_FAILURE:
      return {
        ...state,
        firstCallResponse: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};
