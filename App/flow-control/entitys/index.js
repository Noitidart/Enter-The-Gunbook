// @flow

import { call, put, race, select, take, takeEvery } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { isObject, omit } from 'cmn/lib/all'

import { deleteUndefined } from '../utils'

import type { EntityKind, Entity } from './types'

const ENTITYS: {[key: EntityKind]: EntityKind} = {
    ITEM: 'ITEM',
    GUN: 'GUN'
}

export type Shape = {
    [EntityKind]: { [Id]:Entity }
}

const INITIAL = {
    [ENTITYS.ITEM]: {},
    [ENTITYS.GUN]: {}
}

// export const sagas = [];

const A = ([actionType]: string[]) => 'ENTITYS_' + actionType;

//
const OVERWRITE_ENTITYS = A`OVERWRITE_ENTITYS`;
// bulk overwrite entitys
type OverwriteEntitysAction = { type:typeof OVERWRITE_ENTITYS, data:$Shape<Shape> };
const overwriteEntitys = (data): OverwriteEntitysAction => ({ type:OVERWRITE_ENTITYS, data });

//
const UPDATE_ENTITY = A`UPDATE_ENTITY`;
// my defintion of update - undefined keys after merge are deleted
// can use this to change id, if entity.id does not equal old id it is changed
// data can be an object of "shape of Entity" OR a function which accepts old(well current) entity value and returns "shape of Entity"
type UpdateEntityAction = { type:typeof UPDATE_ENTITY, kind:EntityKind, id:EntityId, data:$Shape<Entity> | Entity=>$Shape<Entity> };
const updateEntity = (kind, id, data): UpdateEntityAction => ({ type:UPDATE_ENTITY, kind, id, data });

//
const DELETE_ENTITY = A`DELETE_ENTITY`;
type DeleteEntityAction = { type:typeof DELETE_ENTITY, kind:EntityKind, id:EntityId };
const deleteEntity = (kind, id): DeleteEntityAction => ({ type:DELETE_ENTITY, kind, id });

//
const ADD_ENTITY = A`ADD_ENTITY`;
type AddEntityAction = { type:typeof ADD_ENTITY, kind:EntityKind, id:EntityId, entity:Entity };
const addEntity = (kind, id, entity): AddEntityAction => ({ type:ADD_ENTITY, kind, id, entity });

//
type Action =
  | AddEntityAction
  | OverwriteEntitysAction
  | UpdateEntityAction
  | DeleteEntityAction;

export default function reducer(state: Shape = INITIAL, action:Action): Shape {
    switch(action.type) {
        case OVERWRITE_ENTITYS: {
            const stateNew = { ...state };
            const ENTITY_KIND_KEYS = Object.values(ENTITYS);
            for (const [kind, entitys] of Object.entries(action.data)) {
                if (ENTITY_KIND_KEYS.includes(kind)) stateNew[kind] = deleteUndefined({ ...entitys });
            }
            return stateNew;
        }
        case UPDATE_ENTITY: {
            const { kind, id, data } = action;
            // data is object or function, a function that returns `data` based on old entity (well it is current, its not old until update happens)

            const entity = state[kind][id];
            const entityNew = { ...entity };
            if (isObject(data)) Object.assign(entityNew, data);
            else Object.assign(entityNew, data(entity)); // assume its a function
            deleteUndefined(entityNew);

            const entitys = state[kind];
            const entitysNew = { ...entitys, [entityNew.id]:entityNew }; // use entityNew.id in case id has changed
            if (entityNew.id !== entity.id) delete entitysNew[id]; // if id has changed, use entity.id compare to entitynew.id due to tripple equality (!==) thats why i dont use `id`, but i do use [id] as its shorter and it will stringify itself

            const stateNew = { ...state, [kind]:entitysNew };
            return stateNew;
        }
        case ADD_ENTITY: {
            const { kind, id, entity } = action;

            const entitys = state[kind];
            const entitysNew = { ...entitys, [id]:entity };

            const stateNew = { ...state, [kind]:entitysNew };
            return stateNew;
        }
        case DELETE_ENTITY: {
            const { kind, id } = action;

            const entitys = state[kind];
            const entitysNew = omit({ ...entitys }, id);

            const stateNew = { ...state, [kind]:entitysNew };
            return stateNew;
        }
        default: return state;
    }
}

export { ENTITYS, overwriteEntitys }
