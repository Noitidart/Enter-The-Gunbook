// @flow

import { delay } from 'redux-saga'
import { takeEvery, take, call, put, race, select } from 'redux-saga/effects'
import { normalize, schema } from 'normalizr'
import { pickDotpath } from 'cmn/lib/all'

import { ENTITYS, overwriteEntitys, NUMERIC_THRESHOLD } from '../entitys'
import { gamepediaExtractTable, GUNGEON_PEDIA_PARSERS } from './wiki'
import { tableToJSON } from './utils'
import { waitRehydrate } from '../utils'

import type { EntityKey } from '../entitys/types'

export type Shape = {
    searchMode: 'voice' | 'text',
    syncedEntitysAt: number, // Date
    forename: string,
    numericKeys: { [EntityKey]: true }
};

const INITIAL = {
    searchMode: 'voice',
    syncedEntitysAt: 0,
    forename: '',
    numericKeys: {}
}
export const sagas = [];

const A = ([actionType]: string[]) => 'ACCOUNT_' + actionType;

//
const UPDATE = A`UPDATE`;
type UpdateAction = { type:typeof UPDATE, data:$Shape<Shape> };
const update = updateAccount = (data): UpdateAction => ({ type:UPDATE, data });

// sync entitys on action dispatch, on startup and not yet synced, or if last sync is stale
const SYNC_ENTITYS = A`SYNC_ENTITYS`
type SyncEntitysAction = { type:typeof SYNC_ENTITYS };
const syncEntitys = (): SyncEntitysAction => ({ type:SYNC_ENTITYS });
const parseIntInf = value => value === 'Infinity' ? 'Infinity' : parseInt(value);
const parseFloatInf = value => value === 'Infinity' ? 'Infinity' : parseFloat(value);
const syncEntitysSaga = function* syncEntitysSaga() {

    yield call(waitRehydrate);

    const MIN_TIME_SINCE_SYNC = 24 * 60 * 60 * 1000; // 24 hours
    // const MIN_TIME_SINCE_SYNC = 30000; // every 30s

    while (true) {
        const {account:{ syncedEntitysAt }} = yield select();

        // const timeSinceSync = Date.now() - syncedEntitysAt;
        // const timeTillSync = MIN_TIME_SINCE_SYNC - timeSinceSync;
        // console.log('timeTillSync:', timeTillSync);
        // if (timeTillSync > 0) {
        //     const { manual, auto } = yield race({
        //         manual: take(SYNC_ENTITYS),
        //         auto: call(delay, timeSinceSync)
        //     });
        //     console.log('manual:', manual, 'auto:', auto);
        // }
        // because of android long setTimeout bug i have to use this loop below instead of the above
        while (true) {
            const timeSinceSync = Date.now() - syncedEntitysAt;
            const timeTillSync = MIN_TIME_SINCE_SYNC - timeSinceSync;
            // console.log('timeTillSync:', timeTillSync);
            if (timeTillSync <= 0) {
                break; // either auto or stale on startup
            } else {
                const { manual, auto } = yield race({
                    manual: take(SYNC_ENTITYS),
                    auto: call(delay, 1000)
                });
                if (manual) break;
            }
        }

        let alts = {};
        {
            const res = yield call(fetch, 'https://github.com/Noitidart/Enter-The-Gunbook/wiki/Alternate-Phrases');
            const html = yield call([res, res.text]);

            const table_stix = html.indexOf('<table', html.indexOf('voice recognition'));
            const table_enix = html.indexOf('</table', table_stix);
            const table = html.substr(table_stix, table_enix - table_stix);

            const data = tableToJSON(table);
            for (const { Name:name, Alternatives:altsStr } of data) {
                alts[name] = altsStr.split(',');
            }
            console.log('alts data:', data, 'alts:', alts);
        }

        const entitys = {};

        // guns
        {
            const res = yield call(fetch, 'https://enterthegungeon.gamepedia.com/Guns');
            const html = yield call([res, res.text]);
            const table = gamepediaExtractTable(html);
            const data = tableToJSON(table, GUNGEON_PEDIA_PARSERS);

            const GunSchema = new schema.Entity('guns', undefined, {
                idAttribute: 'Name',
                processStrategy: value => ({
                    kind: ENTITYS.GUN,
                    ammoCapacity: parseIntInf(value['Ammo Capacity']) || null, // TODO: not null
                    damage: parseFloatInf(value.Damage) || null, // TODO: not null
                    fireRate: parseFloatInf(value['Fire Rate']) || null,
                    force: parseIntInf(value.Force) || null,
                    magazineSize: parseIntInf(value['Magazine Size']) || null,
                    range: parseIntInf(value.Range) || null,
                    reloadTime: parseFloatInf(value['Reload Time']) || null,
                    shotSpeed: parseIntInf(value['Shot Speed']) || null,
                    spread: parseIntInf(value.Spread) || null,
                    ...pickDotpath(value,
                        'Name as id',
                        'Icon as image',
                        'Notes as notes',
                        'Quality as quality',
                        // 'Quote as quote',
                        'Type as type',
                        'moreUrl'
                    )
                })
            });

            entitys[ENTITYS.GUN] = normalize(data, [ GunSchema ]).entities.guns;

            console.log('guns data:', data);

            checkForNaN(entitys[ENTITYS.GUN]);
        }

        let items;
        {
            const res = yield call(fetch, 'https://enterthegungeon.gamepedia.com/Items');
            const html = yield call([res, res.text]);
            const table = gamepediaExtractTable(html);
            const data = tableToJSON(table, GUNGEON_PEDIA_PARSERS);

            const ItemSchema = new schema.Entity('items', undefined, {
                idAttribute: 'Name',
                processStrategy: value => ({
                    kind: ENTITYS.ITEM,
                    ...pickDotpath(value,
                        'Name as id',
                        'Effect as effect',
                        'Icon as image',
                        'Quality as quality',
                        // 'Quote as quote',
                        'Type as type',
                        'moreUrl'
                    )
                })
            });

            entitys[ENTITYS.ITEM] = normalize(data, [ ItemSchema ]).entities.items;

            console.log('items data:', data);

            checkForNaN(entitys[ENTITYS.ITEM]);

        }

        for (const aEntitys of Object.values(entitys)) {
            for (const [id, entity] of Object.entries(aEntitys)) {
                if (id in alts) {
                    entity.alts = alts[id];
                }
            }
        }
        console.log('entitys:', entitys);

        // update/calc numeric keys
        const numericKeys = {};
        const keyStats: { [EntityKey: string]: { numeric:number, non:number }} = {};
        for (const aEntitys of Object.values(entitys)) {
            for (const entity of Object.values(aEntitys)) {
                // check each key,
                for (const [key, value] of Object.entries(entity)) {
                    if (!(key in keyStats)) keyStats[key] = { numeric:0, non:0 };
                    if (value === null || isNaN(value)) keyStats[key].non++;
                    else keyStats[key].numeric++;
                }
            }
        }
        for (const [key, stats] of Object.entries(keyStats)) {
            const percentNumeric = stats.numeric / (stats.numeric + stats.non);
            stats.percentNumeric = percentNumeric; // DEBUG:
            if (percentNumeric > NUMERIC_THRESHOLD) numericKeys[key] = true;
        }
        console.log('keyStats:', keyStats, 'numericKeys:', numericKeys);
        // end - update/calc numeric keys

        yield put(overwriteEntitys(entitys));

        yield put(update({ syncedEntitysAt:Date.now(), numericKeys }))
    }
}
sagas.push(syncEntitysSaga);

function checkForNaN(entitys) {
    // entitys === kindEntitys
    for (const [id, entity] of Object.entries(entitys)) {
        for (const [name, value] of Object.entries(entity)) {
            if ([NaN].includes(value)) {
                console.log('FOUND NaN at:', 'name:', name, 'entity:', entity);
                throw new Error('');
                // console.log('FOUND NaN at:', entity);
            }
        }
    }
}

//
type Action = UpdateAction;

export default function reducer(state: Shape = INITIAL, action:Action): Shape {
    switch(action.type) {
        case UPDATE: return { ...state, ...action.data };
        default: return state;
    }
}

export { updateAccount, syncEntitys }
