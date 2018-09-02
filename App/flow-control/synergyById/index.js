// @flow

import { delay } from 'redux-saga'
import produce from 'immer'
import { takeEvery, call, put } from 'redux-saga/effects'

import type { EntityId } from '../entitys/types'

type Synergy = {
    id: number,
    name: string,
    desc: string,
    combo: Array< // each line is a requirement to be met
        EntityId |
        {
            requiredCount: number,
            entityIds: EntityId[]
        }
    >
}

type SynergyId = $PropertyType<Synergy, 'id'>

export type Shape = {
    [SynergyId]: Synergy
};

const INITIAL = {};
export const sagas = [];

const A = ([actionType]: string[]) => 'SYNERGY_BY_ID_' + actionType; // Action type prefixer

//
const OVERWRITE = A`OVERWRITE`;
type OverwriteAction = {| type:typeof OVERWRITE, synergyById: Shape |};
const overwrite = (synergyById): OverwriteAction => ({ type:OVERWRITE, synergyById });

//
type Action =
  | OverwriteAction;

export default function reducer(state: Shape = INITIAL, action:Action): Shape {
    switch(action.type) {
        case OVERWRITE: return action.synergyById;
        default: return state;
    }
}

export { overwrite as overwriteSynergyById }
