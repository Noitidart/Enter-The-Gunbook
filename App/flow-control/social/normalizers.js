// @flow

import { normalize, schema } from 'normalizr'
import { pickAsByString } from 'cmn/lib/all'

import { K } from './types'

function pickEntity(kind, ...pickAsByStringArgs) {
    return {
        processStrategy: value => ({
            kind,
            fetchedAt: Date.now(),
            ...pickAsByString(value, 'id', ...pickAsByStringArgs)
        })
    }
}

const SCHEMA_DISPLAYNAME = new schema.Entity(K.displaynames, undefined, pickEntity(K.displaynames, 'forename'));

const SCHEMA_HELPFUL = new schema.Entity(K.helpfuls, { displaynameId:SCHEMA_DISPLAYNAME }, pickEntity(
                           K.helpfuls,
                           'created_at as createdAt',
                           'displayname as displaynameId',
                           'comment_id as commentId'
                       ));

const SCHEMA_COMMENT = new schema.Entity(K.comments,
                           {
                               displaynameId: SCHEMA_DISPLAYNAME,
                               helpfulIds: [ SCHEMA_HELPFUL ]
                           },
                           pickEntity(K.comments,
                               'body',
                               'created_at as createdAt',
                               'displayname as displaynameId',
                               'article_id as articleId',
                               'helpfuls as helpfulIds'
                           )
                       );

const SCHEMA_THUMB = new schema.Entity(K.thumbs, { displaynameId:SCHEMA_DISPLAYNAME }, pickEntity(K.thumbs, 'like', 'created_at as createdAt', 'displayname as displaynameId', 'article_id as articleId'));

const SCHEMA_ARTICLE = new schema.Entity(K.articles,
                           {
                               commentIds: [ SCHEMA_COMMENT ],
                               thumbIds: [ SCHEMA_THUMB ]
                           },
                           pickEntity(K.articles,
                               'name',
                               'comments as commentIds',
                               'thumbs as thumbIds'
                           )
                       );

export function normalizeUniversal(reply: {} | {}[]) {
    const normalized = normalize(Array.isArray(reply) ? reply : [ reply ], [ SCHEMA_ARTICLE ]);
    console.log('normalized:', normalized);

    const { articles={}, comments={}, displaynames={}, helpfuls={}, thumbs={} } = normalized.entities;
    const entitys = { articles, comments, displaynames, helpfuls, thumbs };
    return entitys;
}
