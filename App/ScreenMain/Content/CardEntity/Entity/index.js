import React, { PureComponent } from 'react'
import { Image, Linking, ScrollView, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { toTitleCase } from 'cmn/lib/all'

import ImagePixelated from './ImagePixelated'
import Icon from '../../../../Icon'
import StatRow from './StatRow'

import { ENTITYS } from '../../../../flow-control/entitys'
import { watchSocialEntity, unwatchSocialEntity } from '../../../../flow-control/social'

import styles from './styles'
import QUALITY_A from './quality-a.png'
import QUALITY_B from './quality-b.png'
import QUALITY_C from './quality-c.png'
import QUALITY_D from './quality-d.png'
import QUALITY_S from './quality-s.png'

import type { Entity as EntityType, EntityKind } from '../../../flow-control/entitys/types'
import type { Card } from '../../../flow-control/cards'
import type { Shape as AppShape } from '../../../flow-control'
import type { Shape as EntitysShape } from '../../../flow-control/entitys'

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
    thumbs: {},
    comments: {},
    helpfuls: {},
    article: {}
}

class EntityDumb extends PureComponent<Props> {
    body: *
    commentsY: number = 0

    componentDidMount() {
        const { entity:{ name } } = this.props;

        dispatch(watchSocialEntity(name));
    }
    componentWillUnmount() {
        const { entity:{ name } } = this.props;

        dispatch(unwatchSocialEntity(name));
    }
    render() {
        const { entityId, entity, kind } = this.props;

        console.log('entity:', entity);

        return (
            <View style={styles.main}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={()=>null}>
                        <View style={[styles.headerIconWrap]}>
                            <Icon style={[styles.headerIcon, { color:'#5677FC' }]} name="thumb_down" />
                            <Text style={[styles.headerIconLabel, { color:'#5677FC' }]}>12</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>null}>
                        <View style={[styles.headerIconWrap]}>
                        <Icon style={[styles.headerIcon, {  }]} name="thumb_up" />
                        <Text style={[styles.headerIconLabel, {  }]}>1</Text>
                        </View>
                    </TouchableOpacity>
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
                        <TouchableOpacity onPress={()=>null}>
                            {/* <View style={styles.titleRightIconWrap}> */}
                                <Icon style={styles.titleRightIcon} name="sort" />
                                {/* <Text style={styles.titleRightIconLabel}>Date</Text> */}
                            {/* </View> */}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.scrollToAddComment}>
                            <Icon style={styles.titleRightIcon} name="add" />
                        </TouchableOpacity>
                    </View>
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
                    <View style={styles.addComment}>
                        <TextInput style={styles.addCommentInput} keyboardAppearance="dark" placeholder="Leave a comment" placeholderTextColor="#858D90" selectionColor="#5677FC" underlineColorAndroid="transparent" disableFullscreenUI multiline />
                        <TouchableHighlight style={styles.button} onPress={()=>null}>
                            <Text style={styles.buttonLabel}>POST</Text>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </View>
        )
    }

    refBody = el => this.body = el
    handleLayoutComments = ({nativeEvent:{layout:{ y }}}:LayoutEvent) => this.commentsY = y
    scrollToComments = () => this.body.scrollTo({ y:this.commentsY })
    scrollToAddComment = () => this.body.scrollToEnd() // TODO: focus TextInput

    gotoGunpedia = () => Linking.openURL(this.props.entity.moreUrl)
}

const EntitySmart = connect(
    function({ entitys }: AppShape, { entityId }: OwnProps) {
        const kind = entitys[ENTITYS.GUN][entityId] ? ENTITYS.GUN : ENTITYS.ITEM;

        return {
            entity: entitys[ENTITYS.GUN][entityId] || entitys[ENTITYS.ITEM][entityId],
            kind
        }
    }
)

const Entity = EntitySmart(EntityDumb)

export default Entity
