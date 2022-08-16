import { combineReducers } from 'redux';

import initalReducer from './states/reducer';

const rootReducer = combineReducers({
  app: initalReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
