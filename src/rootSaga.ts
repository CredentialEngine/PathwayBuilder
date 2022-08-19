import { all, fork } from 'redux-saga/effects';

import leftPanelSaga from './components/leftPanel/state/saga';
import pathwayFormSaga from './screens/addPathwayForm/state/saga';
import PreSelectResourceSaga from './screens/preSelectResourceCreatePath/state/saga';

import saga from './states/saga';

export function* rootSaga() {
  yield all([
    fork(saga),
    fork(pathwayFormSaga),
    fork(leftPanelSaga),
    fork(PreSelectResourceSaga),
  ]);
}
