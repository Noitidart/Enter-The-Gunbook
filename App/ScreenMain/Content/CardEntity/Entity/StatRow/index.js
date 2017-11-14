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
import type { Shape as AccountShape } from '../../../../../flow-control/account'

type OwnProps = {
    kind: EntityKind,
    entityId: id,
    name: string,
    value: string | number
}

type Props = {
    ...OwnProps,
    // redux:
    numericKeys: $PropertyType<AccountShape, 'numericKeys'>,
    entitys?: number // only if value is number
}

class StatRowDumb extends PureComponent<Props> {
    render() {
        const { entitys, entityId, name, value, numericKeys } = this.props;

        const areMostValuesNumeric = name in numericKeys; // value !== null && value !== undefined && (value === 'Infinity' || typeof value !== 'string');
        const hasIcon = !!getIconForStat(name);
        const isNull = value === null;
        const shouldShow = hasIcon && (!isNull || (isNull && areMostValuesNumeric));
        if (!shouldShow) return null;

        if (!areMostValuesNumeric) {
            return (
                <View style={styles.row}>
                    <View style={styles.columns}>
                        <Icon name={getIconForStat(name)} style={styles.icon} />
                        <View style={styles.dataCol}>
                            <Text style={styles.name}>{getLabelForStat(name)}</Text>
                            <Text style={styles.para}>{value}</Text>
                        </View>
                    </View>
                </View>
            )
        } else {
            const isValueNumeric = !isNull && !isNaN(value); // test in fx, isNaN('Infinity') false
            // console.log(`isNaN('Infinity')`, isNaN('Infinity')); // false on android mataches fx // PLATFORM TEST:

            if (isValueNumeric) {
                const numericValues = Object.values(entitys).map(entity => entity[name]).filter(value => typeof value !== 'string' && ![null, undefined, 'Infinity'].includes(value));
                // console.log('name:', name, 'numericValues:', numericValues);
                const values = sortedWithoutOutliers(numericValues);
                const valuesMax = Math.max(...values).toFixed(2);
                const valuesAvg = average(values).toFixed(2);
                const valuesMedian = median(values).toFixed(2);
                const valueForPercent = valuesMax;
                const percentOfValues = Math.min(value / valueForPercent, 1).toFixed(2) * 100;

                const redFill = value > valuesMax ? true : false;

                // console.log('name:', name, 'value:', value, 'valuesAvg:', valuesAvg, 'valuesMedian:', valuesMedian, 'valuesMax:',  valuesMax, 'percent:', `${percentOfValues}%`, 'values:', values);
                return (
                    <View style={styles.row}>
                        <View style={styles.columns}>
                            <Icon name={getIconForStat(name)} style={styles.icon} />
                            <View style={styles.dataCol}>
                                <Text style={styles.name}>{getLabelForStat(name)}</Text>
                                <View style={styles.valueRow}>
                                    <View style={styles.bar}>
                                        <View style={[styles.barFill, { width:`${percentOfValues}%` }, redFill && styles.barFillRed]} />
                                    </View>
                                    <Text style={styles.value}>{value}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )
            } else {
                // console.log('name:', name, 'value is not numeric, but most values in this group are');
                const isNA = value === null; // not applicable
                const isUnknown = value === undefined;
                const isString = typeof value === 'string';

                return (
                    <View style={styles.row}>
                        <View style={styles.columns}>
                            <Icon name={getIconForStat(name)} style={styles.icon} />
                            <View style={styles.dataCol}>
                                <Text style={styles.name}>{getLabelForStat(name)}</Text>
                                <View style={styles.valueRow}>
                                    <View style={styles.bar}>
                                        { (isString || isUnknown) && <Text style={styles.nonNumericValueForMostlyNumericValues}>? ? ?</Text> }
                                        { isNA && <Text style={styles.nonNumericValueForMostlyNumericValues}>Not Applicable</Text> }
                                    </View>
                                    <Text style={styles.value}>
                                        { isNA && 'N/A' }
                                        { isUnknown && '?' }
                                        { isString && value }
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )
            }
        }
    }
}

const StatRowSmart = connect(
    function({ entitys, account:{ numericKeys } }: AppShape, { kind, entityId }: OwnProps) {
        return {
            entitys: entitys[kind],
            numericKeys
        }
    }
)

const StatRow = StatRowSmart(StatRowDumb)

export default StatRow
