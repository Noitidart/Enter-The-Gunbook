import React, { PureComponent } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { toTitleCase } from 'cmn/lib/all'

import ImagePixelated from './ImagePixelated'
import Icon from '../../../../Icon'
import StatRow from './StatRow'

import { ENTITYS } from '../../../../flow-control/entitys'

import styles from './styles'

import type { Entity as EntityType, EntityKind } from '../../../flow-control/entitys/types'
import type { Card } from '../../../flow-control/cards'
import type { Shape as AppShape } from '../../../flow-control'
import type { Shape as EntitysShape } from '../../../flow-control/entitys'

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
                        <Text style={styles.kind}>{toTitleCase(kind)}</Text>
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
