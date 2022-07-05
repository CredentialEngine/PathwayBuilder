import { RootState } from './types';

const initState: RootState = {
  isLogin: false,
};

export default (state = initState, action: { type: string }) => {
  switch (action.type) {
    case 'CHANGE_STATE':
      return {
        ...state,
        isLogin: true,
      };
    default:
      return {
        ...state,
      };
  }
};
