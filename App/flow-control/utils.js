// @flow

import { select } from 'redux-saga/effects'

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
