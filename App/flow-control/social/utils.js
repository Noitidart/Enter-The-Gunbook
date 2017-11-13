// @flow

import type { SocialEntityKind } from './types'

export function getSocialRefKey(kind: SocialEntityKind, name: string) {
    return kind + name;
}
