// @flow

import type { Entity } from '../entitys/types'

type EntityName = $PropertyType<Entity, 'name'>;

type SocialEntity =     Article    | Thumb    | Comment    | Displayname    | Helpful;
type SocialEntityKind = 'articles' | 'thumbs' | 'comments' | 'displaynames' | 'helpfuls';
type SocialEntityId = $PropertyType<EntityBase, 'id'>

type DateIso = string; // ISO 8601 - combined date in timezone offset - 2017-08-23 21:21:56
type DateUnix = number;

const K: {[key: SocialEntityKind]: SocialEntityKind} = { // short for SOCIAL_ENTITY_KIND // keys/values are the endpoints to hit /api/xxx crossfile-link029189
    articles: 'articles',
    thumbs: 'thumbs',
    comments: 'comments',
    displaynames: 'displaynames',
    helpfuls: 'helpfuls'
}

type Entities = {|
    articles: { [key: ArticleId]:Article },
    thumbs: { [key: ThumbId]:Thumb },
    comments: { [key: CommentId]:Comment },
    displaynames: { [key: DisplaynameId]:Displayname },
    helpfuls: { [key: HelpfulId]:Helpful }
|}

type EntityBase = {|
    id: number,
    fetchedAt: DateUnix,
    isFetching?: boolean,
    kind: SocialEntityKind
|}

type Article = {|
    ...EntityBase,
    kind: typeof K.articles,
    name: string,
    commentIds: CommentId[],
    thumbIds: ThumbId[]
|}
type ArticleId = $PropertyType<Article, 'id'>;

type Thumb = {|
    ...EntityBase,
    kind: typeof K.thumbs,
    updatedAt: DateIso,
    like: boolean,
    articleId: ArticleId,
    displaynameId: DisplaynameId
|}
type ThumbId = $PropertyType<Thumb, 'id'>;

type Comment = {|
    ...EntityBase,
    kind: typeof K.comments,
    createdAt: DateIso,
    articleId: ArticleId,
    displaynameId: DisplaynameId,
    helpfulIds: HelpfulId[]
|}
type CommentId = $PropertyType<Comment, 'id'>;

type Displayname = {|
    ...EntityBase,
    kind: typeof K.displaynames
|}
type DisplaynameId = $PropertyType<Displayname, 'id'>;

type Helpful = {|
    ...EntityBase,
    kind: typeof K.helpfuls,
    createdAt: DateIso,
    displaynameId: DisplaynameId,
    commentId: CommentId
|}
type HelpfulId = $PropertyType<Helpful, 'id'>;

export { K }
export type { Entities, SocialEntity, SocialEntityKind, SocialEntityId }
