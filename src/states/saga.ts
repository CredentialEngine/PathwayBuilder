import { all, takeLatest } from 'redux-saga/effects';

const abc = () => {
  // do something
};

function* saga() {
  yield all([takeLatest('ABC', abc)]);
}

export default saga;
