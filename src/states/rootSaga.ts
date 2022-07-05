import { all, fork } from 'redux-saga/effects';
import saga from './saga';

export function* rootSaga() {
  yield all([fork(saga)]);
}
