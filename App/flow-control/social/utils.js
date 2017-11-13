// @flow

import type { SocialEntityKind } from './types'

export function getSocialRefKey(kind: SocialEntityKind, name: string) {
    return kind + name;
}

export function hasId(aVar) {
    return typeof aVar === 'number';
}
