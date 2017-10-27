// @flow

import { delay } from 'redux-saga'
import { takeEvery } from 'redux-saga/effects'

export type Shape = {
    isDown: boolean,
    isOffline: boolean,
    isGithubDown: boolean,
    // pingOffline: {
    //     status: string,
    // },
    // pingDown: {
    //     status: string
    // },
    // pingGithubDown: {
    //     status: string
    // }
}

const INITIAL = {
    isDown: false,
    isOffline: false,
    isGithubDown: false
}
// export const sagas = [];

const A = ([actionType]: string[]) => 'API_' + actionType;

//
const UPDATE = A`UPDATE`;
type UpdateAction = { type:typeof UPDATE, data:$Shape<Shape> };
const update = (data): UpdateAction => ({ type:UPDATE, data });

//
type Action =
  | UpdateAction;

export default function reducer(state: Shape = INITIAL, action:Action): Shape {
    switch(action.type) {
        case UPDATE: return { ...state, ...action.data };
        default: return state;
    }
}
