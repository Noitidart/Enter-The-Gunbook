// @flow

import type { Entity } from '../entitys/types'

type EntityName = $PropertyType<Entity, 'name'>;

type SocialEntity =     Article    | Thumb    | Comment    | Displayname    | Helpful;
type SocialEntityKind = 'articles' | 'thumbs' | 'comments' | 'displaynames' | 'helpfuls';

type DateIso = string; // ISO 8601 - combined date in timezone offset - 2017-08-23 21:21:56
type DateUnix = number;

const K = { // short for SOCIAL_ENTITY_KIND
    articles: 'articles',
    thumbs: 'thumbs',
    comments: 'comments',
    displaynames: 'displaynames',
    helpfuls: 'helpfuls'
}

type EntityBase = {
    id: number,
    fetchedAt: DateUnix,
    isFetching?: boolean,
    kind: SocialEntityKind
}

type Article = {
    ...EntityBase,
    kind: typeof K.articles,
    name: string,
    commentIds: CommentId[],
    thumbIds: ThumbId[]
}
type ArticleId = $PropertyType<Article, 'id'>;

type Thumb = {
    ...EntityBase,
    kind: typeof K.thumbs,
    updatedAt: DateIso,
    like: boolean,
    articleId: ArticleId,
    displaynameId: DisplaynameId
}
type ThumbId = $PropertyType<Thumb, 'id'>;

type Comment = {
    ...EntityBase,
    kind: typeof K.comments,
    createdAt: DateIso,
    articleId: ArticleId,
    displaynameId: DisplaynameId,
    helpfulIds: HelpfulId[]
}
type CommentId = $PropertyType<Comment, 'id'>;

type Displayname = {
    ...EntityBase,
    kind: typeof K.displaynames
}
type DisplaynameId = $PropertyType<Displayname, 'id'>;

type Helpful = {
    ...EntityBase,
    kind: typeof K.helpfuls,
    createdAt: DateIso,
    displaynameId: DisplaynameId,
    commentId: CommentId
}
type HelpfulId = $PropertyType<Helpful, 'id'>;

export { K }
export type { Article, Comment, Displayname, EntityName, Helpful, SocialEntity, SocialEntityKind, Thumb }
