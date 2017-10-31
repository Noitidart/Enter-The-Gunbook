import React, { PureComponent } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { toTitleCase } from 'cmn/lib/all'

import ImagePixelated from './ImagePixelated'
import Icon from '../../../../Icon'
import StatRow from './StatRow'

import { ENTITYS } from '../../../../flow-control/entitys'

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
    kind: EntityKind,
    entity: EntityType
}

class EntityDumb extends PureComponent<Props> {
    render() {
        const { entityId, entity, kind } = this.props;

        console.log('entity:', entity);

        return (
            <View style={styles.main}>
                <View style={styles.header}>
                    <Icon style={styles.headerIcon} name="youtube_searched_for" />
                    <Icon style={styles.headerIcon} name="trending_up" />
                    <Icon style={styles.headerIcon} name="comment" />
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
                            <Text style={styles.kind}> &middot; </Text>
                            { entity.quality && <Image style={styles.quality} source={QUALITY[entity.quality]} /> }
                        </View>
                    </View>
                </View>
                <ScrollView style={styles.body}>
                    { Object.entries(entity).map( ([name, value]) => <StatRow kind={kind} key={name} entityId={entityId} name={name} value={value} /> ) }
                    <View style={styles.titleRow}>
                        <Icon style={styles.titleIcon} name="comment" />
                        <Text style={styles.title}>Comments</Text>
                    </View>
                    <Text style={styles.para}>
                        <Text>Coming soon</Text>
                    </Text>
                    <View style={styles.titleRow}>
                        <Icon style={styles.titleIcon} name="youtube_searched_for" />
                        <Text style={styles.title}>Other Results</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
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
