// @flow

import { takeEvery, call, put, select } from 'redux-saga/effects'

import { getIdSync, deleteUndefined } from '../utils'
import { updateAccount } from '../account'

const CARDS = {
    ENTITY: 'ENTITY',
    ACCOUNT: 'ACCOUNT',
    COUNTER: 'COUNTER'
}

type CardKind = $Keys<typeof CARDS>;

type Card = {
    kind: CardKind,
    entityId?: Id, // only if kind === CARDS.ENTITY
    id: Id
}

export type Shape = Card[];

const INITIAL = [{
    kind: CARDS.ENTITY,
    id: getIdSync('cards')
}];
export const sagas = [];

const A = ([actionType]: string[]) => 'COUNTER_' + actionType; // Action type prefixer

//
const ADD = A`ADD`;
type AddAction = { type:typeof ADD, data:$Shape<Card>, index?:number };
const addCard = (data, index): AddAction => ({ type:ADD, data:{ ...data, id:getIdSync('cards') }, index });

//
const REMOVE = A`REMOVE`;
type RemoveAction = { type:typeof REMOVE, id:Id };
const removeCard = (id): RemoveAction => ({ type:REMOVE, id });

//
const UPDATE = A`UPDATE`;
type UpdateAction = { type:typeof UPDATE, id:Id, data:$Shape<Card> };
const updateCard = (id, data): UpdateAction => ({ type:UPDATE, id, data });

//
const SORT = A`SORT`;
type SortAction = { type:typeof SORT, by:string };
const sortCards = (by): SortAction => ({ type:SORT, by });

const sortWorker = function* sortWorker(action: SortAction) {
    const { by } = action;

    const { account:{ by:byOld }} = yield select();

    if (byOld === by) return;

    // after sorting check if it changed order, if it didnt then dont do anything, simple shallowEqual will do the trick

}
const sortWatcher = function* sortWatcher() {
    yield takeEvery(SORT, sortWorker);
}
sagas.push(sortWatcher);

//
type Action =
  | AddAction
  | RemoveAction
  | UpdateAction;

export default function reducer(state: Shape = INITIAL, action:Action): Shape {
    switch(action.type) {
        case ADD: {
            const { data, index } = action;
            if (index === undefined) {
                return [ ...state, data ];
            } else {
                const stateNew = [ ...state ];
                stateNew.splice(index, 0, data);
                return stateNew;
            }
        }
        case REMOVE: return state.filter(entry => entry.id !== action.id);
        case UPDATE: {
            const { id, data } = action;
            return state.map( entry => entry.id !== id ? entry : deleteUndefined({ ...entry, ...data }) );
        }
        default: return state;
    }
}

export { CARDS, addCard, removeCard, updateCard, sortCards }
