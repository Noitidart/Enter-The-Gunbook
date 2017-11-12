// @flow

import { applyMiddleware, combineReducers, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import createSagaMiddleware from 'redux-saga'
import { reducer as form } from 'redux-form'
import { fork, all } from 'redux-saga/effects'

import account, { sagas as accountSagas } from './account'
import api from './api'
import cards, { sagas as cardsSagas } from './cards'
import counter, { sagas as counterSagas } from './counter'
import entitys from './entitys'
import social, { sagas as socialSagas } from './social'

import type { Shape as AccountShape } from './account'
import type { Shape as ApiShape } from './api'
import type { Shape as CardsShape } from './cards'
import type { Shape as CounterShape } from './counter'
import type { Shape as EntitysShape } from './entitys'
import type { Shape as SocialShape } from './social'

export type Shape = {
    _persist: { version:number, rehydrated:boolean },
    account: AccountShape,
    api: ApiShape,
    cards: CardsShape,
    counter: CounterShape,
    entitys: EntitysShape,
    form: *,
    social: SocialShape
}

console.log('process.env.NODE_ENV:', process.env.NODE_ENV, process.env.NODE_ENV !== 'production');
const persistConfig = {
    key: 'primary',
    debug: process.env.NODE_ENV !== 'production',
    whitelist: ['account', 'counter', 'entitys'],
    storage
}

const sagaMiddleware = createSagaMiddleware();
let enhancers = applyMiddleware(sagaMiddleware);
if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) enhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(enhancers);

const reducers = persistReducer(persistConfig, combineReducers({ account, api, cards, counter, entitys, form, social }));
const sagas = [ ...accountSagas, ...cardsSagas, ...counterSagas ];

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
