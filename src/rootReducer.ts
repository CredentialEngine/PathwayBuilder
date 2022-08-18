import { combineReducers } from 'redux';

import leftPanelReducer from './components/leftPanel/state/reducer';
import addPathwayFormReducer from './screens/addPathwayForm/state/reducer';
import initalReducer from './states/reducer';

const rootReducer = combineReducers({
  initalReducer,
  addPathwayFormReducer,
  leftPanelReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
