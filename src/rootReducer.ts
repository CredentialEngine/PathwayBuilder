import { combineReducers } from 'redux';

import leftPanelReducer from './components/leftPanel/state/reducer';
import addConditionalComponent from './screens/addComponent/state/reducer';
import addPathwayFormReducer from './screens/addPathwayForm/state/reducer';
import preSelectProxyResources from './screens/preSelectResourceCreatePath/state/reducer';
import initalReducer from './states/reducer';

const rootReducer = combineReducers({
  initalReducer,
  addPathwayFormReducer,
  leftPanelReducer,
  addConditionalComponent,

  preSelectProxyResources,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
