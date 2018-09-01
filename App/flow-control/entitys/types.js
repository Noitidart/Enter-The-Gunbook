// @flow

import { ENTITYS } from './'

export type Entity = Gun | Item;
export type EntityKind = $Keys<typeof ENTITYS>;

export type EntityKey = $Keys<Entity>; // any key inside Entity

type Url = string;
type Unix = number;
export type Name = Id;

type Quality = 'A' | 'B' | 'C' | 'D' | 'S'

export type EntityBase = {
    id: Name,
    alts?: string[], // alternative names for voice recognition
    quote: string,
    image: Url,
    moreUrl: Url,
    fetchedMoreAt?: Unix,
    hasFetchedMore?: boolean,
    isFetchingMore?: boolean
}

type EntityId = $PropertyType<EntityBase, 'id'>

export type Gun = {
    ...EntityBase,
    kind: typeof ENTITYS.GUN,
    ammoCpacity: number | Array<{
        name: string,
        value: number
    }>,
    damage: number | Array<{
        name: string,
        value: number, // float
        perMulti?: number, // > 1, number of multiple, the value is damage per bullet
        perSec?: true
    }>,
    fireRate: null | number,
    force: null | number,
    magazineSize: null | number,
    notes: string,
    quality: Quality,
    range: null | number,
    reloadTime: null | number,
    shotSpeed: null | number,
    spread: null | number,
    type: string, // Semiautomatic, Charged, Burst
    synergys?: Synergy[]
}

export type Item = {
    ...EntityBase,
    kind: typeof ENTITYS.ITEM,
    effect: string,
    quality: null | Quality,
    type: string, // Passive, Active
    synergys?: Synergy[]
}

type Synergy = {
    name: string,
    desc: string,
    entityCombos: Array<EntityId[]>
}
