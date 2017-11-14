import React, { PureComponent } from 'react'
import { Text, View, Alert, Platform, Picker, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import { unCamelCase } from '../../../../flow-control/account/utils'
import Icon from '../../../../Icon'

import styles from '../styles'
import stylesThis from './styles'

import type { Shape as AccountShape } from '../../../../flow-control/account'
import type { Shape as EntitysShape } from '../../../../flow-control/entitys'
import type { Shape as AppShape } from '../../../../flow-control'

type OwnProps = {
    activeOpacity: number,
}

type Props = {
    ...OwnProps,
    // redux
    entitys: EntitysShape
}

type State = {
    options: { label:string, value:string }[]
}

class SortFabDumb extends PureComponent<Props, State> {
    state = {
        options: [
            { label:'Cancel', value:'cancel' } // NOTE: on android, because selectedValue of <Picker> defaults to first value, so if that value is pressed nothing happens, so i put in cancel
        ]
    }
    componentDidUpdate(propsOld) {
        const { numericKeys } = this.props;
        const { numericKeys:numericKeysOld } = propsOld;

        if (numericKeys !== numericKeysOld) this.recalcOptions();
    }
    componentDidMount() {
        this.recalcOptions();
    }
    render() {
        const { activeOpacity } = this.props;
        const { options } = this.state;

        const Wrapper = Platform.OS === 'android' ? View : TouchableOpacity;

        return (
            <Wrapper style={styles.sort} onPress={Platform.OS === 'ios' ? this.handlePress : undefined}>
                <View style={styles.backingSmall} >
                    <Icon name="sort" style={styles.labelSmall} />
                    { Platform.OS === 'android' &&
                        <Picker prompt="Sort your items by:" selectedValue="cancel" onValueChange={this.handlePicked} style={stylesThis.picker}>
                            { options.map( option => <Picker.Item label={option.label} value={option.value} key={option.value} /> )}
                        </Picker>
                    }
                </View>
            </Wrapper>
        )
    }

    handlePress = () => {
        const { options } = this.state;
        Alert.alert( 'Sort your items by:', undefined,
            options.map( option => ({ text:option.label, onPress:()=>this.handlePicked(option.value), style:(option.value === 'cancel' ? 'cancel' : undefined) }) )
        );
    }

    handlePicked = value => console.log('value:', value)

    recalcOptions = () => {
        const { numericKeys } = this.props;

        const options = [];

        console.log('numericKeys:', numericKeys);
        for (const key in numericKeys) {
            options.push({ label:unCamelCase(key), value:key });
        }

        options.sort(SortFab.sortAscLabel);

        options.push({ label:'Cancel', value:'cancel' });

        this.setState(() => ({ options }));
    }

    static sortAscLabel({ label:labelA }, { label:labelB }) {
        return labelA.localeCompare(labelB);
    }

}

const SortFabSmart = connect(
    function({ account:{ numericKeys } }: AppShape) {
        return {
            numericKeys
        }
    }
)

const SortFab = SortFabSmart(SortFabDumb)

export default SortFab
