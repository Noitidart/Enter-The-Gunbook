// @flow

import { delay } from 'redux-saga'
import { takeEvery, take, call, put, race, select } from 'redux-saga/effects'
import './normalizers'
import { pickDotpath } from 'cmn/lib/all'

import { ENTITYS } from '../entitys'
import { waitRehydrate } from '../utils'

import type { SocialEntity, SocialEntityKind } from './types'

type EntityName = $PropertyType<Entity, 'name'>;

export type Shape = {
    [Id]: SocialEntity
}

const INITIAL = {}
export const sagas = [];

const A = ([actionType]: string[]) => 'SOCIAL_' + actionType;

//
// the entity is not overriden, if "new data" has value and is undefined, then this value is deleted from actual data. if "new data" is missing a field, then the value for this entry in "state data" is unchanged
// can use to change id
const PATCH = A`PATCH`;
type PatchAction = { type:typeof PATCH, id:Id, data:$Shape<Entity> };
const patchEntity = (id:Id, data:$Shape<Entity>): PatchAction => ({ type:PATCH, id, data });

//
// the entity is completely overriden with data, therefore data must be a complete "Entity" id is extracted from it
const PUT = A`PUT`;
type PutAction = { type:typeof PATCH, entity:Entity };
const putEntity = (entity: Entity): PutAction => ({ type:PUT, entity });

//
const DELETE = A`DELETE`;
type DeleteAction = { type:typeof DELETE, id:Id };
const deleteEntity = (id: Id): DeleteAction => ({ type:DELETE, id });

//
const PUT_MANY = A`PUT_MANY`;
type PutManyAction = { type:typeof PUT_MANY, many:EntitysMany };
const putEntitys = (many: EntitysMany): PutManyAction => ({ type:PUT_MANY, many });

//
const DELETE_MANY = A`DELETE_MANY`;
type DeleteManyAction = { type:typeof DELETE_MANY, ids:Id[] };
const deleteEntitys = (ids: Id[]): DeleteManyAction => ({ type:DELETE_MANY, ids });

//
// responsible for manual/autorefresh, comment/like if social, deleting up entity
const WATCH = A`WATCH`;
type WatchAction = { type:typeof WATCH, id:Id };
const watchSocialEntity = (id: Id): WatchAction => ({ type:WATCH, id });
const watchWorker = function* watchWorker(action) {
    const { id } = action;

    REFCNT[id] = REFCNT[id] ? REFCNT[id] + 1 : 1;
    // const isDupe = REFCNT[id] > 1;
    // if (isDupe) return;

    yield put(refreshEntity(id));
    // const {entitys:{ [id]:entity }} = yield select();

    // if (entity) {

    // }

    const isDupe = REFCNT[id] > 1;
    if (isDupe) return;


}
const watchWatcher = function* watchWatcher(action) {
    yield takeEvery(WATCH, watchWorker);
}
sagas.push(watchWatcher);

//
const UNWATCH = A`UNWATCH`;
type UnwatchAction = { type:typeof UNWATCH, id:Id };
const unwatchSocialEntity = (id: Id): UnwatchAction => ({ type:UNWATCH, id });
const unwatchWorker = function* unwatchWorker(action) {
    const { id } = action;

    if (REFCNT[id] === 1) {
        delete REFCNT[id];
        // yield put(deleteEntity(id));
    } else {
        REFCNT[id]--;
    }
}
const unwatchWatcher = function* unwatchWatcher(action) {
    yield takeEvery(UNWATCH, unwatchWorker);
}
sagas.push(unwatchWatcher);

//
type Action =
  | PatchAction
  | PutAction
  | DeleteAction
  | PutManyAction
  | DeleteManyAction;

export default function reducer(state: Shape = INITIAL, action:Action): Shape {
    switch(action.type) {
        case PUT: {
            const { entity } = action;
            return { ...state, [entity.id]:entity };
        }
        case PATCH: {
            const { id, data } = action;

            if (!(id in state)) console.warn('no such entity so cannot patch, id:', id); // DEBUG:
            if (!(id in state)) return state;

            const entityOld = state[id];
            const entity = deleteUndefined({ ...entityOld, ...data });

            const hasId = 'id' in data;
            const idOld = entityOld.id;
            const idNew = hasId ? data.id : idOld;

            const stateNew = { ...state, [idNew]:entity };

            if (idNew !== idOld) delete stateNew[idOld];

            return stateNew;
        }
        case DELETE: return omit({ ...state }, action.id);
        case DELETE_MANY: return omit({ ...state }, ...action.ids);
        case PUT_MANY: {
            const { many } = action;

            const isEntitys = Array.isArray(many);
            // const isEntities = !isEntitys && isObject(many) && getFirstKey(many) in ENTITY_KIND;
            const isEntities = !isEntitys && isObject(many) && Object.keys(many).some( key => key in ENTITY_KIND);
            const isEntitysObject = !isEntitys && !isEntities && isObject(many);

            if (isEntitys) {
                const stateNew = { ...state };
                const entitys = many;
                for (const entity of entitys) {
                    stateNew[entity.id] = entity;
                }
                return stateNew;
            } else if (isEntitysObject) {
                return { ...state, ...many };
            } else if (isEntities) {
                const stateNew = { ...state };
                for (const [kind, entitys] of Object.entries(many)) {
                    if (kind in ENTITY_KIND) {
                        Object.assign(stateNew, entitys);
                    }
                }
                return stateNew;
            }
            else { // DEBUG:
                console.warn('many is of improper type'); // DEBUG:
                return state; // DEBUG:
            } // DEBUG:
        }
        default: return state;
    }
}

export { watchSocialEntity, unwatchSocialEntity }
