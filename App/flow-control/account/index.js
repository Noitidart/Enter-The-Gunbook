// @flow

import { delay } from 'redux-saga'
import { takeEvery, take, call, put, race, select } from 'redux-saga/effects'
import { normalize, schema } from 'normalizr'
import { pickDotpath } from 'cmn/lib/all'
import cheerio from 'cheerio-without-node-native'

import { ENTITYS, overwriteEntitys, NUMERIC_THRESHOLD } from '../entitys'
import { overwriteSynergyById } from '../synergyById'
import { gamepediaExtractTable, GUNGEON_PEDIA_PARSERS } from './wiki'
import { tableToJSON, isNumeric } from './utils'
import { waitRehydrate } from '../utils'

import type { EntityKey } from '../entitys/types'

export type Shape = {
    searchMode: 'voice' | 'text',
    syncedEntitysAt: number, // Date
    forename: string,
    numericKeys: { [EntityKey]: true },
    sortCommentsBy: 'date' | 'helpful'
};

const INITIAL = {
    searchMode: 'voice',
    syncedEntitysAt: 0,
    forename: '',
    numericKeys: {},
    sortCommentsBy: 'date'
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
const parseIntInf = value => {
    if (value === undefined) return undefined;
    if (value === null) return null;
    else if (value === 'Infinity') return 'Infinity';
    else if (value.includes('Error creating thumb')) return undefined;
    else if (value === 'N/A' || value === '-') return null; // im pretty sure wiki.js does the trimming
    // else if (value.length === 0) return undefined; // taken care of by wiki.js#getValueFromHtml
    else if (isNaN(value) && value) return value;
    else return numberOrUnd(parseInt(value));
}
const parseFloatInf = value => {
    if (value === undefined) return undefined;
    if (value === null) return null;
    else if (value === 'Infinity') return 'Infinity';
    else if (value.includes('Error creating thumb')) return undefined;
    else if (value === 'N/A' || value === '-') return null; // im pretty sure wiki.js does the trimming
    // else if (value.length === 0) return undefined; // taken care of by wiki.js#getValueFromHtml
    else if (isNaN(value) && value) return value;
    else return numberOrUnd(parseFloat(value));
}

const numberOrUnd = value => isNaN(value) ? undefined : value; // null is a number
const numberOrInf = value => isNaN(value) ? 'Infinity' : value;

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
                processStrategy: value => {
                    // if (value.Name.includes('Rad Gun')) {
                    //     console.log('value:', value);
                    //     console.log('value.Spread:', value.Spread, 'parseIntInf:', parseIntInf(value.Spread));
                    // }
                    return ({
                        kind: ENTITYS.GUN,
                        ammoCapacity: numberOrInf(parseIntInf(value['Ammo Capacity'])), // TODO: verify that all things with null ammoCapacity are actually Infinity
                        damage: parseFloatInf(value.Damage), // TODO: its never null
                        fireRate: parseFloatInf(value['Fire Rate']),
                        force: parseIntInf(value.Force),
                        magazineSize: parseIntInf(value['Magazine Size']),
                        range: parseIntInf(value.Range),
                        reloadTime: parseFloatInf(value['Reload Time']),
                        shotSpeed: parseIntInf(value['Shot Speed']),
                        spread: parseIntInf(value.Spread),
                        ...pickDotpath(value,
                            'Name as id',
                            'Icon as image',
                            'Notes as notes',
                            'Quality as quality',
                            'Quote as quote',
                            'Type as type',
                            'moreUrl'
                        )
                    })
                }
            });

            entitys[ENTITYS.GUN] = normalize(data, [ GunSchema ]).entities.guns;

            console.log('guns data:', data);

            // checkForNaN(entitys[ENTITYS.GUN]);
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
                        'Quote as quote',
                        'Type as type',
                        'moreUrl'
                    )
                })
            });

            entitys[ENTITYS.ITEM] = normalize(data, [ ItemSchema ]).entities.items;

            console.log('items data:', data);

            // checkForNaN(entitys[ENTITYS.ITEM]);

        }

        for (const aEntitys of Object.values(entitys)) {
            for (const [id, entity] of Object.entries(aEntitys)) {
                if (id in alts) {
                    entity.alts = alts[id];
                }
            }
        }

        // // create the fake items, because of naming issues
        const itemIdByFakeId = {
            // 'Alpha Bullets': 'Alpha Bullet',
            'Master Round I': 'Master Round',
            'Master Round II': 'Master Round',
            'Master Round III': 'Master Round',
            'Master Round IV': 'Master Round',
            'Master Round V': 'Master Round'
        };
        for (const [fakeId, itemId] of Object.entries(itemIdByFakeId)) {
            if (entitys[ENTITYS.ITEM]) {
                entitys[ENTITYS.ITEM][fakeId] = JSON.parse(JSON.stringify(entitys[ENTITYS.ITEM][itemId]));
                entitys[ENTITYS.ITEM][fakeId].id = fakeId;
            }
        }

        // synergys
        const synergyById = {};
        {
            const res = yield call(fetch, 'https://enterthegungeon.gamepedia.com/Synergies');
            const html = yield call([res, res.text]);
            const $ = cheerio.load(html);
            const rows = $('table.wikitable > tr');
            let synergyIdLast = -1;
            rows.each((ix, row) => {
                if (ix === 0) return;

                const tds = $(row).find('> td');
                const synergyId = ++synergyIdLast;
                let name, desc;
                const combo = [];

                tds.each((ix, td) => {
                    $td = $(td);
                    if (ix === 0) {
                        name = $td.text().trim();
                    } else if (ix === tds.length - 1) {
                        desc = $td.text().trim();
                    } else {
                        // combo td
                        const entityIds = $td.find('a ~ a').map((_, td) => $(td).text().trim()).toArray();

                        // add synergyId to all entityIds
                        for (let entityId of entityIds) {
                            // HACK: coerce entityId
                            if (entityId === 'Alpha Bullets') entityId = 'Alpha Bullet';

                            const entityKind = entitys[ENTITYS.ITEM].hasOwnProperty(entityId) ? ENTITYS.ITEM
                                                                                              : entitys[ENTITYS.GUN].hasOwnProperty(entityId) ? ENTITYS.GUN
                                                                                                                                              : null;

                            if (!entityKind) {
                                console.error('entityId not found in entitys.ITEM or entitys.GUN, entityId:', entityId);
                            } else {
                                const entity = entitys[entityKind][entityId];
                                const synergyIds = entity.synergyIds || [];
                                if (!synergyIds.includes(synergyId)) {
                                    synergyIds.push(synergyId);
                                    entity.synergyIds = synergyIds;
                                }
                            }
                        }

                        // create combo
                        if (entityIds.length === 1) {
                            combo.push(entityIds[0]);
                        } else {
                            const tdText = $td.text();

                            let hasOrTd = false;
                            $td.find('td').each((_, td) => {
                                if ($(td).text().trim() === 'or') {
                                    hasOrTd = true;
                                    return false;
                                }
                            });

                            if (!hasOrTd && tdText.includes('Any two of the following:')) {
                                combo.push({
                                    requiredCount: 2,
                                    entityIds
                                })
                            } else if (hasOrTd || tdText.includes('Any of the following:') || tdText.includes('Any one of the following:')) {
                                combo.push({
                                    requiredCount: 1,
                                    entityIds
                                })
                            } else {
                                combo.push(...entityIds);
                                console.log('this synergy has a td with multipl a elements, and its not OR, synergy:', {
                                    id: synergyId,
                                    name,
                                    desc,
                                    combo
                                });
                            }
                        }
                    }
                });

                synergyById[synergyId] = {
                    id: synergyId,
                    name,
                    desc,
                    combo
                };

            });
        }

        // update/calc numeric keys - must be done after all adding of new keys is done
        const numericKeys = {};
        const keyStats: { [EntityKey: string]: { numeric:number, non:number }} = {};
        for (const aEntitys of Object.values(entitys)) {
            for (const entity of Object.values(aEntitys)) {
                // check each key,
                for (const [key, value] of Object.entries(entity)) {
                    if (!(key in keyStats)) keyStats[key] = { numeric:0, non:0 };
                    keyStats[key][isNumeric(value) ? 'numeric' : 'non']++;
                }
            }
        }
        for (const [key, stats] of Object.entries(keyStats)) {
            const percentNumeric = stats.numeric / (stats.numeric + stats.non);
            // stats.percentNumeric = percentNumeric;
            if (percentNumeric > NUMERIC_THRESHOLD) numericKeys[key] = true;
        }
        // console.log('keyStats:', keyStats, 'numericKeys:', numericKeys);
        // end - update/calc numeric keys

        // console.log('synergyById:', synergyById);
        yield put(overwriteSynergyById(synergyById))

        // console.log('entitys:', entitys);

        yield put(overwriteEntitys(entitys));

        yield put(update({ syncedEntitysAt:Date.now(), numericKeys }))
    }
}
sagas.push(syncEntitysSaga);

// function checkForNaN(entitys) {
//     // entitys === kindEntitys
//     for (const [id, entity] of Object.entries(entitys)) {
//         for (const [name, value] of Object.entries(entity)) {
//             if ([NaN].includes(value)) {
//                 console.log('FOUND NaN at:', 'name:', name, 'entity:', entity);
//                 throw new Error('');
//                 // console.log('FOUND NaN at:', entity);
//             }
//         }
//     }
// }

//
type Action = UpdateAction;

export default function reducer(state: Shape = INITIAL, action:Action): Shape {
    switch(action.type) {
        case UPDATE: return { ...state, ...action.data };
        default: return state;
    }
}

export { updateAccount, syncEntitys }
