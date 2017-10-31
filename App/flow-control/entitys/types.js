// @flow

import { ENTITYS } from './'

export type Entity = Gun | Item;
export type EntityKind = $Keys<typeof ENTITYS>;

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

export type Gun = {
    ...EntityBase,
    kind: typeof ENTITYS.GUN,
    ammoCpacity: number,
    damage: number,
    fireRate: null | number,
    force: null | number,
    magazineSize: number,
    notes: string,
    quality: Quality,
    range: null | number,
    reloadTime: null | number,
    shotSpeed: null | number,
    spread: null | number,
    type: string // Semiautomatic, Charged, Burst
}

export type Item = {
    ...EntityBase,
    kind: typeof ENTITYS.ITEM,
    effect: string,
    quality: null | Quality,
    type: string // Passive, Active
}
