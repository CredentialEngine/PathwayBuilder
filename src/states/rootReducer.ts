import { combineReducers } from 'redux';
import initalReducer from './reducer';

const rootReducer = combineReducers({
  initalReducer: initalReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
