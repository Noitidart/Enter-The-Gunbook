import React, { PureComponent } from 'react'
import { ActivityIndicator, Image, Linking, ScrollView, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { toTitleCase, pick } from 'cmn/lib/all'
import { depth0Or1Equal } from 'cmn/lib/recompose'

import ImagePixelated from './ImagePixelated'
import Icon from '../../../../Icon'
import StatRow from './StatRow'

import { K } from '../../../../flow-control/social/types'
import { ENTITYS } from '../../../../flow-control/entitys'
import { refSocialEntity, unrefSocialEntity } from '../../../../flow-control/social'

import styles from './styles'
import QUALITY_A from './quality-a.png'
import QUALITY_B from './quality-b.png'
import QUALITY_C from './quality-c.png'
import QUALITY_D from './quality-d.png'
import QUALITY_S from './quality-s.png'

import type { SocialEntity } from '../../../flow-control/social/types'
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
    helpfuls: {},
    article: {},
    forename: string,
    isThumbUp: number,
    isThumbDn: number,
    cntThumbUp: boolean,
    cntThumbDn: boolean
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
        const { entityId, entity, kind, socialEntity, isThumbUp, isThumbDn, cntThumbUp, cntThumbDn } = this.props;

        const { socialEntityId } = this.state;

        const hasInitFetched = socialEntityId !== undefined;
        const isFetching = !hasInitFetched || (socialEntity && socialEntity.isFetching);

        console.log('entity:', entity, 'socialEntity:', socialEntity);

        return (
            <View style={styles.main}>
                <View style={styles.header}>
                    { hasInitFetched &&
                        <TouchableOpacity onPress={()=>null}>
                            <View style={[styles.headerIconWrap]}>
                                <Icon style={[styles.headerIcon, isThumbDn && { color:'#E51C23' }]} name="thumb_down" />
                                <Text style={[styles.headerIconLabel, isThumbDn && { color:'#E51C23' }]}>{cntThumbDn}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    { hasInitFetched &&
                        <TouchableOpacity onPress={()=>null}>
                            <View style={[styles.headerIconWrap]}>
                                <Icon style={[styles.headerIcon, isThumbUp && { color:'#5677FC' }]} name="thumb_up" />
                                <Text style={[styles.headerIconLabel, isThumbUp && { color:'#5677FC' }]}>{cntThumbUp}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    { hasInitFetched &&
                        <TouchableOpacity onPress={this.scrollToComments}>
                            <Icon style={styles.headerIcon} name="comment" />
                        </TouchableOpacity>
                    }
                    { !hasInitFetched &&
                        <ActivityIndicator color="#FFFFFF" size="small" style={styles.headerActivity} />
                    }
                </View>
                <View style={styles.image}>
                    <ImagePixelated url={entity.image} height={90} width={90} />
                </View>
                <View style={styles.inlineImageRow}>
                    <View>
                        <Text style={styles.name}>{entityId}</Text>
                        <View style={styles.descRow}>
                            <Text style={styles.kind}>{toTitleCase(kind)}</Text>
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
                        <TouchableHighlight style={styles.button} onPress={this.gotoGunpedia}>
                            <Text style={styles.buttonLabel}>SEE MORE ON GUNPEDIA</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.titleRow} onLayout={this.handleLayoutComments}>
                        <Icon style={styles.titleIcon} name="comment" />
                        <Text style={styles.title}>Comments</Text>
                        <View style={styles.titleSpacer} />
                        { hasInitFetched &&
                            <TouchableOpacity onPress={()=>null}>
                                {/* <View style={styles.titleRightIconWrap}> */}
                                    <Icon style={styles.titleRightIcon} name="sort" />
                                    {/* <Text style={styles.titleRightIconLabel}>Date</Text> */}
                                {/* </View> */}
                            </TouchableOpacity>
                        }
                        { hasInitFetched &&
                            <TouchableOpacity onPress={this.scrollToAddComment}>
                                <Icon style={styles.titleRightIcon} name="add" />
                            </TouchableOpacity>
                        }
                    </View>
                    { !hasInitFetched &&
                        <ActivityIndicator color="#FFFFFF" size="large" style={styles.commentsLoading} />
                    }
                    { hasInitFetched &&
                        <View style={styles.comment}>
                            <View style={styles.commentHead}>
                                <View style={styles.commentAvatar}>
                                    <Text style={styles.commentAvatarLabel}>A</Text>
                                </View>
                                <View style={styles.commentHeadText}>
                                    <View style={styles.row}>
                                        <Text style={styles.commentAuthor}>Author</Text>
                                        <Text style={styles.commentDot}> &middot; </Text>
                                        <Text style={styles.commentDate}>2 min ago</Text>
                                        <View style={styles.spacer} />
                                        <TouchableOpacity style={styles.commentDeleteWrap}>
                                            <Icon style={styles.commentDelete} name="delete" />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity onPress={()=>null}>
                                        <Text style={styles.commentHelpful}>You and 1 other found this helpful</Text>
                                    </TouchableOpacity>
                                </View>
                                {/* if they have a thumb show it here as a subicon */}
                            </View>
                            <Text style={styles.commentBody}>body body body body body</Text>
                            <View style={styles.commentHr} />
                        </View>
                    }
                    { hasInitFetched &&
                        <View style={styles.comment}>
                            <View style={styles.commentHead}>
                                <View style={styles.commentAvatar}>
                                    <Text style={styles.commentAvatarLabel}>A</Text>
                                </View>
                                <View style={styles.commentHeadText}>
                                    <View style={styles.row}>
                                        <Text style={styles.commentAuthor}>Author</Text>
                                        <Text style={styles.commentDot}> &middot; </Text>
                                        <Text style={styles.commentDate}>2 min ago</Text>
                                        <View style={styles.spacer} />
                                        <TouchableOpacity style={styles.commentDeleteWrap}>
                                            <Icon style={styles.commentDelete} name="delete" />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity onPress={()=>null}>
                                        <Text style={styles.commentHelpful}>You and 1 other found this helpful</Text>
                                    </TouchableOpacity>
                                </View>
                                {/* if they have a thumb show it here as a subicon */}
                            </View>
                            <Text style={styles.commentBody}>body body body body body</Text>
                            <View style={styles.commentHr} />
                        </View>
                    }
                    { hasInitFetched &&
                        <View style={styles.addComment}>
                            <TextInput style={styles.addCommentInput} keyboardAppearance="dark" placeholder="Leave a comment" placeholderTextColor="#858D90" selectionColor="#5677FC" underlineColorAndroid="transparent" disableFullscreenUI multiline />
                            <TouchableHighlight style={styles.button} onPress={()=>null}>
                                <Text style={styles.buttonLabel}>POST</Text>
                            </TouchableHighlight>
                        </View>
                    }
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
        console.log('dispatching refSocialEntity:', K.articles, name);
        const socialEntityId = await dispatch(refSocialEntity(K.articles, name)).promise;
        this.setState(() => ({ socialEntityId }));
    }
}

const EntitySmart = connect(
    function({ entitys, social, account:{ forename } }: AppShape, { entityId }: OwnProps) {
        const kind = entitys[ENTITYS.GUN][entityId] ? ENTITYS.GUN : ENTITYS.ITEM;

        const name = entityId;
        const socialEntity = Object.values(social[K.articles]).find(entity => entity.name === name);

        const thumbs = !socialEntity ? {} : pick(social.thumbs, socialEntity.thumbIds);
        const comments = !socialEntity ? {}  : pick(social.comments, socialEntity.commentIds);
        const helpfuls = !socialEntity ? {}  : pick(social.helpfuls, socialEntity.helpfulIds);

        const hasForename = !!forename;
        const thumb = !hasForename ? null : Object.values(thumbs).find(thumb => thumb.display)
        const isThumbUp = thumb ? thumb.like : false;
        const isThumbDn = thumb ? !thumb.like : false;
        const cntThumbUp = Object.values(thumbs).reduce( (sum, { like }) => like ? ++sum : sum, 0 );
        const cntThumbDn = Object.values(thumbs).reduce( (sum, { like }) => !like ? ++sum : sum, 0 );

        return {
            entity: entitys[ENTITYS.GUN][entityId] || entitys[ENTITYS.ITEM][entityId],
            kind,
            forename,
            socialEntity,
            thumbs,
            comments,
            helpfuls,
            isThumbUp,
            isThumbDn,
            cntThumbUp,
            cntThumbDn
        }
    },
    undefined,
    undefined,
    {
        areStatePropsEqual: (props, propsOld) => depth0Or1Equal(props, propsOld, { thumbs:1, comments:1, helpfuls:1 })
    }
)

const Entity = EntitySmart(EntityDumb)

export default Entity
