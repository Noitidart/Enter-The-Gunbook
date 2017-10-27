// @flow

export type Entity = Gun | Item;
export type EntityKind = 'GUN' | 'ITEM';

type Url = string;
export type Name = Id;

export type EntityBase = {
    id: Name,
    alts: string[], // alternative names for voice recognition
    quote: string,
    icon: Url,
    notes: string[],
    hasFetchedMore: boolean,
    isFetchingMore: boolean
}

export type Gun = {
    ...EntityBase,
    kind: 'gun'
}

export type Item = {
    ...EntityBase,
    kind: 'item'
}
