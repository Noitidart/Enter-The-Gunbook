// @flow

import { take, select } from 'redux-saga/effects'
import { REHYDRATE } from 'redux-persist/lib/constants'

export function deleteUndefined<T: {}>(obj: T): T {
    // mutates obj
    for (const [k, v] of Object.entries(obj)) {
        if (v === undefined) delete obj[k];
    }
    return obj;
}

const NEXT_ID = {}
export function* getId(reducer: string) {
    if (!(reducer in NEXT_ID)) {
        const { [reducer]:entrys } = yield select();
        const ids = Object.keys(entrys);
        NEXT_ID[reducer] = ids.length ? Math.max(...ids) : -1;
    }
    return ++NEXT_ID[reducer];
}

export const waitRehydrate = function* waitRehydrate() {
    // wait for redux-persit rehydration

    let {_persist:{ rehydrated }} = yield select();

    while (!rehydrated) {
        yield take(REHYDRATE);
        ({_persist:{ rehydrated }} = yield select());
    }
}
