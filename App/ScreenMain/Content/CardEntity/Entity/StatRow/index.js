import React, { PureComponent } from 'react'
import { View, Image, Text } from 'react-native'
import { connect } from 'react-redux'

import Icon from '../../../../../Icon'

import styles from './styles'

import type { Entity } from '../../../../../flow-control/entitys/types'
import type { Card } from '../../../../../flow-control/cards'
import type { Shape as AppShape } from '../../../../../flow-control'

type OwnProps = {
    kind: EntityKind,
    entityId: id,
    name: string,
    value: string | number
}

type Props = {
    ...OwnProps,
    entitys?: number // only if value is number
}

class StatRowDumb extends PureComponent<Props> {
    render() {
        const { entitys, entityId, name, value } = this.props;

        const isValueNumeric = typeof value === 'string';
        const maxValue = isValueNumeric ? 10 : undefined;
        // Math.max(...Object.values(entitys).map(entity => entity[name]))

        return (
            <View style={styles.row}>
                <Text>{name} - {value}</Text>
            </View>
        )
    }
}

const StatRowSmart = connect(
    function({ entitys }: AppShape, { kind }: OwnProps) {
        return {
            entity: entitys[kind]
        }
    }
)

const StatRow = StatRowSmart(StatRowDumb)

export default StatRow
