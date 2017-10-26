// @flow

import { applyMiddleware, combineReducers, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import createSagaMiddleware from 'redux-saga'
import { fork, all } from 'redux-saga/effects'

import counter, { sagas as counterSagas } from './counter'

import type { Shape as CounterShape } from './counter'

export type Shape = {
    _persist: { version:number, rehydrated:boolean },
    counter: CounterShape
}

console.log('process.env.NODE_ENV:', process.env.NODE_ENV, process.env.NODE_ENV !== 'production');
const persistConfig = {
    key: 'primary',
    debug: process.env.NODE_ENV !== 'production',
    whitelist: ['counter'],
    storage
}

const sagaMiddleware = createSagaMiddleware();
let enhancers = applyMiddleware(sagaMiddleware);
if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) enhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(enhancers);

const reducers = persistReducer(persistConfig, combineReducers({ counter }));
const sagas = [ ...counterSagas ];

const store = createStore(reducers, enhancers);

export const persistor = persistStore(store);

const rootSaga = function* rootSaga() {
    yield all(sagas.map(saga => fork(saga)));
}
sagaMiddleware.run(rootSaga);

// store.subscribe(function() {
//     console.log('store updated:', store.getState());
// })

export default store
