// @flow

// TODO: rename to entities maybe or entitas

import { delay } from 'redux-saga'
import { takeEvery, take, call, put, race, select } from 'redux-saga/effects'
import { pickDotpath, omit } from 'cmn/lib/all'

import { normalizeUniversal } from './normalizers'
import { K } from './types'
import { getSocialRefKey, hasId } from './utils'
import { waitRehydrate, fetchApi, promisifyAction, deleteUndefined } from '../utils'

import type { Entities, SocialEntity, SocialEntityId, SocialEntityKind, ThumbId } from './types'
import type { PromiseAction } from '../utils'

// type EntityName = $PropertyType<Entity, 'name'>;

export type Shape = Entities;

const INITIAL = {
    articles: {},
    thumbs: {},
    comments: {},
    displaynames: {},
    helpfuls: {}
}// Object.keys(K).reduce((entities, kind) => Object.assign(entities, { [kind]:{} }), {});
export const sagas = [];

const A = ([actionType]: string[]) => 'SOCIAL_' + actionType;

const REFCNT = {};

const UNREFRESHABLE_KINDS = [K.thumbs, K.comments, K.displaynames, K.helpfuls];
const MIN_MS_TILL_CAN_REFRESH_AGAIN = 1 * 1000; // 10s

//
// the entity is not overriden, if "new data" has value and is undefined, then this value is deleted from actual data. if "new data" is missing a field, then the value for this entry in "state data" is unchanged
// can use to change id
type PatchData = {
    kind: SocialEntityKind, // kind is required
    ...$Shape<SocialEntity>
}
const PATCH_ENTITY = A`PATCH`;
type PatchEntityAction = { type:typeof PATCH_ENTITY, id:SocialEntityId, data:PatchData };
const patchEntity = (id:SocialEntityId, data:PatchData): PatchEntityAction => ({ type:PATCH_ENTITY, id, data });

//
// the entity is completely overriden with data, therefore data must be a complete "Entity" id is extracted from it
const PUT_ENTITY = A`PUT_ENTITY`;
type PutEntityAction = { type:typeof PATCH_ENTITY, entity:SocialEntity };
const putEntity = (entity: SocialEntity): PutEntityAction => ({ type:PUT_ENTITY, entity });

//
const DELETE_ENTITY = A`DELETE_ENTITY`;
type DeleteEntityAction = { type:typeof DELETE_ENTITY, id:SocialEntityId };
const deleteEntity = (kind: SocialEntityKind, id: SocialEntityId): DeleteEntityAction => ({ type:DELETE_ENTITY, id });

//
// does put on each entity - put(entities[kind][...]) - optimized
// this is PUT_ENTITYS and NOT "PUT" because a PUT here would overwrite the branch entities
type PutEntitysData = {
    [key: SocialEntityKind]: {
        [key: SocialEntityId]: SocialEntity
    }
}
const PUT_ENTITYS = A`PUT_ENTITYS`;
type PutEntitysAction = { type:typeof PUT_ENTITYS, data:PutEntitysData }; // data is entitysNew in shape of object, this just happens to match $Shape<Entities>
const putEntitys = (data: PutEntitysData): PutEntitysAction => ({ type:PUT_ENTITYS, data });

//
const REF_ENTITY = A`REF_ENTITY`;
type RefEntityAction = { type:typeof REF_ENTITY, kind:SocialEntityKind, name:string, ...PromiseAction };
const refEntity = (kind:SocialEntityKind, name: string): RefEntityAction => promisifyAction({ type:REF_ENTITY, kind, name });
const refSocialEntity = refEntity;

const refEntityWorker = function* refEntityWorker(action) {
    const { kind, name, resolve } = action;
    const refKey = getSocialRefKey(kind, name);

    console.log('in refEntityWorker, refKey:', refKey);

    REFCNT[refKey] = REFCNT[refKey] ? REFCNT[refKey] + 1 : 1;

    yield put(refreshEntity(kind, name, undefined, resolve));

    const isDupe = REFCNT[refKey] > 1;
    if (isDupe) return;

}
const refEntityWatcher = function* refEntityWatcher(action) {
    yield takeEvery(REF_ENTITY, refEntityWorker);
}
sagas.push(refEntityWatcher);

//
const UNREF_ENTITY = A`UNREF_ENTITY`;
type UnrefEntityAction = { type: typeof UNREF_ENTITY, kind: SocialEntityKind, name: string, id: SocialEntityId };
const unrefEntity = (kind: SocialEntityKind, name: string, id: SocialEntityId): UnrefEntityAction => ({ type:UNREF_ENTITY, kind, name, id });
const unrefSocialEntity = unrefEntity;

const unrefEntityWorker = function* unrefEntityWorker(action) {
    const { kind, name, id } = action;
    const refKey = getSocialRefKey(kind, name);

    if (REFCNT[refKey] === 1) {
        delete REFCNT[refKey];
        // find id of name
        // yield put(deleteEntity(kind, id));
    } else {
        REFCNT[refKey]--;
    }
}
const unrefEntityWatcher = function* unrefEntityWatcher(action) {
    yield takeEvery(UNREF_ENTITY, unrefEntityWorker);
}
sagas.push(unrefEntityWatcher);

//
const REFRESH_ENTITY = A`REFRESH_ENTITY`;
type RefreshEntityAction = { type: typeof REFRESH_ENTITY, kind: SocialEntityKind, name: string, id?: SocialEntityId, resolve?: $PropertyType<PromiseAction, 'resolve'> };
const refreshEntity = (kind: SocialEntityKind, name: string, id: ?SocialEntityId, resolve?: $PropertyType<PromiseAction, 'resolve'>): RefreshEntityAction => ({ type:REFRESH_ENTITY, kind, name, id, resolve });

const refreshEntityWorker = function* refreshEntityWorker(action) {
    const { kind, id, name, resolve } = action;

    console.log('in refresh, kind:', kind, 'id:', id, 'name:', name);

    if (UNREFRESHABLE_KINDS.includes(kind)) return;

    if (hasId(id)) {
        const {social:{ [kind]:{ [id]:entity } }} = yield select();

        if (entity) {
            const { fetchedAt, isFetching } = entity;
            const timeSinceFetched = Date.now() - fetchedAt;
            if (isFetching || timeSinceFetched <= MIN_MS_TILL_CAN_REFRESH_AGAIN) {
                if (resolve) resolve(entity.id);
                return;
            }
        }

        yield put(patchEntity(id, { kind, isFetching:true }));
    }

    const endpoint = kind; // crossfile-link029189
    const res = yield call(fetchApi, kind, { qs:{ name } });
    console.log('res.status:', res.status);
    if (res.status === 200) {
        const reply = yield call([res, res.json]);

        const entities = yield call(normalizeUniversal, reply);
        console.log('entities:', entities);
        yield put(putEntitys(entities)); // isFetching will go to undefined on put

        if (resolve) {
            for (const entity of Object.values(entities[kind])) {
                if (entity.name === name) resolve(entity.id);
            }
            resolve(null); // as promise cant be resolved twice, if it was not resolved with entity.id we resolve it here with null
        }
    } else if (kind === K.articles && res.status === 404) {
        if (resolve) resolve(null);
    } else {
        if (hasId(id)) {
            yield put(patchEntity(id, { kind, isFetching:false }));
            if (resolve) resolve(id);
        }
    }

}
const refreshEntityWatcher = function* refreshEntityWatcher(action) {
    yield takeEvery(REFRESH_ENTITY, refreshEntityWorker);
}
sagas.push(refreshEntityWatcher);

//
// thumbId only passed if
const TOGGLE_THUMB = A`TOGGLE_THUMB`;
type ToggleThumbAction =
  | { type: typeof TOGGLE_THUMB, id?: SocialEntityId, name: string, forename: string, like: boolean, thumbId: void }
  | { type: typeof TOGGLE_THUMB, id: SocialEntityId,  name: string, forename: string,  like: null,   thumbId: ThumbId }; // thumbId passed only when like is null, for delete
type ToggleThumbArg =
  | { id: void | SocialEntityId, like: boolean, name: string, forename: string } // create or update
  | { id: SocialEntityId,        like: null,    name: string, forename: string, thumbId: ThumbId } // delete
const toggleThumb = ({ id, like, name, forename, thumbId}: ToggleThumbArg): ToggleThumbAction => ({ type:TOGGLE_THUMB, id, name, forename, like, thumbId });

const toggleThumbWorker = function* toggleThumbWorker(action) {
    const { name, forename, like, thumbId, id } = action;

    const isDelete = like === null;

    yield put(patchEntity(id, { kind:K.articles, isFetching:true }));

    const res = yield call(fetchApi, isDelete ? `thumbs/${thumbId}` : 'thumbs', {
        method: isDelete ? 'DELETE' : 'POST',
        qs: !isDelete ? null : { forename },
        body: isDelete ? undefined : { like, forename, name }
    });
    console.log('toggleThumb res.status:', res.status);

    yield put(patchEntity(id, { kind:K.articles, isFetching:false }));
    yield put(refreshEntity(K.articles, name, id));
}
const toggleThumbWatcher = function* toggleThumbWatcher(action) {
    yield takeEvery(TOGGLE_THUMB, toggleThumbWorker);
}
sagas.push(toggleThumbWatcher);

//
type Action =
  | PatchEntityAction
  | PutEntityAction
  | DeleteEntityAction
  | PutEntitysAction;

export default function reducer(state: Shape = INITIAL, action:Action): Shape {
    switch(action.type) {
        case PUT_ENTITY: {
            const { entity:entityNew, entity:{ kind, id } } = action;

            return { ...state, [kind]:{ ...state[kind], [id]:entityNew } };
        }
        case PATCH_ENTITY: {
            const { id, data, data:{ kind } } = action;

            const entities = state;

            const entitys = entities[kind];
            // if (!(id in entitys)) console.warn('no such entity so cannot patch, id:', id, 'kind:', kind); // DEBUG:
            // if (!(id in entitys)) return state;

            const entity = entitys[id];
            const entityNew = deleteUndefined({ ...entity, ...data });

            const hasId = 'id' in data;
            const idNew = hasId ? data.id : null;

            const entitiesNew = { ...entities, [kind]:{ ...entitys, [idNew || id]:entityNew } };
            const stateNew = entitiesNew;

            return stateNew;
        }
        case DELETE_ENTITY: {
            const { kind, id } = action;

            const entities = state;

            const entitys = entities[kind];
            // if (!(id in entitys)) console.warn('no such entity so cannot delete, id:', id, 'kind:', kind); // DEBUG:
            // if (!(id in entitys)) return state;

            return { ...entities, [kind]:omit({ ...entitys }, id) };
        }
        case PUT_ENTITYS: {
            const { data } = action;

            const stateNew = { ...state };
            for (const [kind, entitysNew] of Object.entries(data)) {
                if (kind in K) {
                    const entitys = state[kind];
                    stateNew[kind] = { ...entitys, ...entitysNew };
                }
            }

            return stateNew;
        }
        default: return state;
    }
}

export { refSocialEntity, unrefSocialEntity, toggleThumb }
