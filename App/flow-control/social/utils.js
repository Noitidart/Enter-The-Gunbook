// @flow

import type { SocialEntityKind } from './types'

export function getSocialRefKey(kind: SocialEntityKind, name: string) {
    return kind + name;
}

export function hasId(aVar) {
    return typeof aVar === 'number';
}

export async function alertError(res, template) {
    let reply;
    try {
        reply = await res.json();
    } catch(ignore) {}

    console.log('reply:', reply);

    if (reply.error) alert(reply.error);
    else alert(template.replace('%STATUS%', res.status));
}
