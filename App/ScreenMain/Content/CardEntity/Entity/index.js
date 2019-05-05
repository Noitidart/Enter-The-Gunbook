import React, { PureComponent } from 'react'
import { ActivityIndicator, Image, Linking, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { startCase, pick } from 'lodash'

import { sortDescHelpful } from './utils'

import ButtonFlat from './ButtonFlat'
import Comment from './Comment'
import CommentSort from './CommentSort'
import AddComment from './AddComment'
import ImagePixelated from './ImagePixelated'
import Icon from '../../../../Icon'
import StatRow from './StatRow'

import { K, CommentId } from '../../../../flow-control/social/types'
import { ENTITYS } from '../../../../flow-control/entitys'
import { refSocialEntity, unrefSocialEntity, toggleThumb } from '../../../../flow-control/social'
import { alertDisplayname } from '../../../../flow-control/social/utils'

import styles from './styles'
import QUALITY_A from './quality-a.png'
import QUALITY_B from './quality-b.png'
import QUALITY_C from './quality-c.png'
import QUALITY_D from './quality-d.png'
import QUALITY_S from './quality-s.png'

import type { SocialEntity, ThumbId } from '../../../flow-control/social/types'
import type { Entity as EntityType, EntityKind } from '../../../flow-control/entitys/types'
import type { Card } from '../../../flow-control/cards'
import type { Shape as AppShape } from '../../../flow-control'
import type { Shape as EntitysShape } from '../../../flow-control/entitys'
import type { Shape as SocialShape } from '../../../flow-control/social'

const QUALITY = {
    A: QUALITY_A,
    B: QUALITY_B,
    C: QUALITY_C,
    D: QUALITY_D,
    S: QUALITY_S
}

type OwnProps = {
    entityId: Id
}

type Props = {
    ...OwnProps,
    // redux
    dispatch: Dispatch,
    kind: EntityKind,
    entity: EntityType,
    socialEntity?: SocialEntity,
    thumbs: {},
    comments: {},
    forename: string,
    thumbId: ThumbId | null,
    isThumbUp: number,
    isThumbDn: number,
    cntThumbUp: boolean,
    cntThumbDn: boolean,
    sortedCommentIds: null | CommentId[]
}

type State = {
    socialEntityId?: SocialEntityId
}

class EntityDumb extends PureComponent<Props, State> {
    body: *
    commentsY: number = 0
    state = {}

    componentDidMount() {
        this.refEntity();
    }
    componentWillUnmount() {
        const { socialEntityId } = this.state;
        const { entity:{ id:name }, dispatch } = this.props;

        if (socialEntityId !== null && socialEntityId !== undefined) dispatch(unrefSocialEntity(K.articles, name, socialEntityId));
    }
    render() {
        const { entityId, entity, kind, socialEntity, isThumbUp, isThumbDn, cntThumbUp, cntThumbDn, sortedCommentIds } = this.props;

        const { socialEntityId } = this.state;

        const hasInitFetched = socialEntityId !== undefined;
        const isFetching = !hasInitFetched || (socialEntity && socialEntity.isFetching);

        const hasComments = !socialEntity ? false : !!socialEntity.commentIds.length;

        console.log('entity:', entity);

        return (
            <View style={styles.main}>
                <View style={styles.header}>
                    { hasInitFetched &&
                        <TouchableOpacity onPress={this.toggleThumbDn}>
                            <View style={[styles.headerIconWrap]}>
                                <Icon style={[styles.headerIcon, isThumbDn && styles.red]} name="thumb_down" />
                                <Text style={[styles.headerIconLabel, isThumbDn && styles.red]}>{cntThumbDn}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    { hasInitFetched &&
                        <TouchableOpacity onPress={this.toggleThumbUp}>
                            <View style={[styles.headerIconWrap]}>
                                <Icon style={[styles.headerIcon, isThumbUp && styles.blue]} name="thumb_up" />
                                <Text style={[styles.headerIconLabel, isThumbUp && styles.blue]}>{cntThumbUp}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    { !hasInitFetched &&
                        <ActivityIndicator color="#FFFFFF" size="small" style={styles.headerActivity} />
                    }
                    <TouchableOpacity onPress={this.scrollToComments}>
                        <Icon style={styles.headerIcon} name="comment" />
                    </TouchableOpacity>
                </View>
                <View style={styles.image}>
                    <ImagePixelated url={entity.image} height={90} width={90} />
                </View>
                <View style={styles.inlineImageRow}>
                    <View>
                        <Text style={styles.name}>{entityId}</Text>
                        <View style={styles.descRow}>
                            <Text style={styles.kind}>{startCase(kind.toLowerCase())}</Text>
                            <Text style={styles.kind}> &middot; </Text>
                            <Text style={styles.kind}>{entity.type}</Text>
                            { entity.quality && <Text style={styles.kind}> &middot; </Text> }
                            { entity.quality && <Image style={styles.quality} source={QUALITY[entity.quality]} /> }
                        </View>
                    </View>
                </View>
                <ScrollView style={styles.body} ref={this.refBody}>
                    { Object.entries(entity).map( ([name, value]) => <StatRow kind={kind} key={name} entityId={entityId} name={name} value={value} /> ) }
                    <View style={styles.rowButton}>
                        <ButtonFlat label="SEE MORE ON GUNPEDIA" onPress={this.gotoGunpedia} />
                    </View>
                    <View style={styles.titleRow} onLayout={this.handleLayoutComments}>
                        <Icon style={styles.titleIcon} name="comment" />
                        <Text style={styles.title}>Comments</Text>
                        <View style={styles.titleSpacer} />
                        { hasInitFetched && <CommentSort /> }
                        { hasInitFetched &&
                            <TouchableOpacity onPress={this.scrollToAddComment}>
                                <Icon style={styles.titleRightIcon} name="add" />
                            </TouchableOpacity>
                        }
                    </View>
                    { !hasInitFetched &&
                        <ActivityIndicator color="#FFFFFF" size="large" style={styles.commentsLoading} />
                    }
                    { hasInitFetched && hasComments &&
                        sortedCommentIds.map( id => <Comment id={id} key={id} /> )
                    }
                    { hasInitFetched && !hasComments &&
                        <Text style={styles.commentsMessage}>No comments yet</Text>
                    }
                    { hasInitFetched && <AddComment name={entityId} id={!socialEntity ? null : socialEntity.id} /> }
                </ScrollView>
            </View>
        )
    }

    refBody = el => this.body = el
    handleLayoutComments = ({nativeEvent:{layout:{ y }}}:LayoutEvent) => this.commentsY = y
    scrollToComments = () => this.body.scrollTo({ y:this.commentsY })
    scrollToAddComment = () => this.body.scrollToEnd() // TODO: focus TextInput

    gotoGunpedia = () => Linking.openURL(this.props.entity.moreUrl)

    refEntity = async () => {
        const { entity:{ id:name }, dispatch } = this.props;
        const socialEntityId = await dispatch(refSocialEntity(K.articles, name)).promise;
        this.setState(() => ({ socialEntityId }));
    }

    toggleThumbUp = () => {
        const { dispatch, forename, entity:{ id:name }, isThumbUp, thumbId } = this.props;
        let { socialEntityId:id } = this.state;

        const hasForename = !!forename;
        if (!hasForename) {
            alertDisplayname(dispatch, 'To be able to vote, you need to first set a "display name" from the settings page.');
            return;
        }

        const isDelete = isThumbUp;
        if (isDelete) dispatch(toggleThumb({ forename, name, thumbId, id, like:null }));
        else dispatch(toggleThumb({ forename, name, like:true, id }));
    }
    toggleThumbDn = () => {
        const { dispatch, forename, entity:{ id:name }, isThumbDn, thumbId } = this.props;
        let { socialEntityId:id } = this.state;

        const hasForename = !!forename;
        if (!hasForename) {
            alertDisplayname(dispatch, 'To be able to vote, you need to first set a "display name" from the settings page.');
            return;
        }

        const isDelete = isThumbDn;
        if (isDelete) dispatch(toggleThumb({ id, forename, name, thumbId, like:null }));
        else dispatch(toggleThumb({ id, forename, name, like:false }));
    }
}

const EntitySmart = connect(
    function({ entitys, social, account:{ forename, sortCommentsBy } }: AppShape, { entityId }: OwnProps) {
        const kind = entitys[ENTITYS.GUN][entityId] ? ENTITYS.GUN : ENTITYS.ITEM;

        const name = entityId;
        const socialEntity = Object.values(social.articles).find(entity => entity.name === name);

        const thumbs = !socialEntity ? null : pick(social.thumbs, socialEntity.thumbIds);

        const displayname = !forename ? false : Object.values(social.displaynames).find(displayname => displayname.forename.toLowerCase() === forename.toLowerCase());
        const thumb = !thumbs || !displayname ? null : Object.values(thumbs).find(thumb => thumb.displaynameId === displayname.id);
        const isThumbUp = thumb ? thumb.like : false;
        const isThumbDn = thumb ? !thumb.like : false;
        const cntThumbUp = !thumbs ? 0 : Object.values(thumbs).reduce( (sum, { like }) => like ? ++sum : sum, 0 );
        const cntThumbDn = !thumbs ? 0 : Object.values(thumbs).reduce( (sum, { like }) => !like ? ++sum : sum, 0 );

        let sortedCommentIds = null;
        if (socialEntity) {
            if (sortCommentsBy === 'helpful') {
                const comments = !socialEntity ? null : pick(social.comments, socialEntity.commentIds);
                sortedCommentIds = !comments ? null : Object.values(comments).sort(sortDescHelpful).map(({ id }) => id);
            } else {
                sortedCommentIds = socialEntity.commentIds;
            }
        }

        return {
            entity: entitys[ENTITYS.GUN][entityId] || entitys[ENTITYS.ITEM][entityId],
            kind,
            forename,
            socialEntity,
            thumbId: !thumb ? null : thumb.id,
            isThumbUp,
            isThumbDn,
            cntThumbUp,
            cntThumbDn,
            sortedCommentIds
        }
    }
)

const Entity = EntitySmart(EntityDumb)

export default Entity
