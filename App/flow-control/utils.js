// @flow

import qs from 'qs'
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

const NEXT_ID_SYNC = {}
export function getIdSync(reducer: string) {
    if (!(reducer in NEXT_ID_SYNC)) {
        NEXT_ID_SYNC[reducer] = 0;
    }
    return NEXT_ID_SYNC[reducer]++;
}

export const waitRehydrate = function* waitRehydrate() {
    // wait for redux-persit rehydration

    let {_persist:{ rehydrated }} = yield select();

    while (!rehydrated) {
        yield take(REHYDRATE);
        ({_persist:{ rehydrated }} = yield select());
    }
}

export function fetchApi(input:string, init={}) {
    // adds the default headers in but doesnt overwrite if it already has those keys
    // if init.body is object, then it JSON.stringify's it
    // if input is string, and doesnt start with http, then `https://${fetchApi.DOMAIN}/api/` is prefixed to it

    // currently only supports string `input`

    // const DOMAIN = 'https://gunbook.sundayschoolonline.org';
    const DOMAIN = 'http://localhost:8000';

    init.headers = Object.assign({
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }, init.headers);

    if (init.body) init.body = JSON.stringify(init.body);

    if (!input.startsWith('http')) input = `${DOMAIN}/api/${input}`;
    if (init.qs) {
        input += '?' + qs.stringify(init.qs);
        delete init.qs;
    }

    return fetch(input, init);
}
