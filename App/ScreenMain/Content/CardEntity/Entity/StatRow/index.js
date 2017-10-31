import React, { PureComponent } from 'react'
import { View, Image, Text } from 'react-native'
import { connect } from 'react-redux'
import { average } from 'cmn/lib/all'

import { getLabelForStat, getIconForStat, median, sortedWithoutOutliers } from './utils'

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

        const isValueNumeric = value !== null && value !== undefined && (value === 'Infinity' || typeof value !== 'string');

        if (!isValueNumeric) {
            return null;
        } else {
            const values = sortedWithoutOutliers(Object.values(entitys).map(entity => entity[name]).filter(value => ![null, undefined, 'Infinity'].includes(value)));
            const valuesMax = Math.max(...values).toFixed(2);
            const valuesAvg = average(values).toFixed(2);
            const valuesMedian = median(values).toFixed(2);
            const valueForPercent = valuesMax;
            const percentOfValues = Math.min(value / valueForPercent, 1).toFixed(2) * 100;

            const redFill = value > valuesMax ? true : false;

            console.log('name:', name, 'value:', value, 'valuesAvg:', valuesAvg, 'valuesMedian:', valuesMedian, 'valuesMax:',  valuesMax, 'percent:', `${percentOfValues}%`, 'values:', values);
            return (
                <View style={styles.row}>
                    <View style={styles.columns}>
                        <Icon name={getIconForStat(name)} style={styles.icon} />
                        <View style={styles.dataCol}>
                            <Text style={styles.name}>{getLabelForStat(name)}</Text>
                            <View style={styles.valueRow}>
                                <View style={styles.bar}>
                                    <View style={[styles.barFill, { width:`${percentOfValues}%` }, redFill && { backgroundColor:'#E51C23' }]} />
                                </View>
                                <Text style={styles.value}>{value}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
        }
    }
}

const StatRowSmart = connect(
    function({ entitys }: AppShape, { kind, entityId }: OwnProps) {
        return {
            entitys: entitys[kind]
        }
    }
)

const StatRow = StatRowSmart(StatRowDumb)

export default StatRow
