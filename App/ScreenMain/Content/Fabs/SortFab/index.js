import React, { PureComponent } from 'react'
import { Text, View, Alert, Platform, Picker, TouchableOpacity } from 'react-native'

import Icon from '../../../../Icon'

import styles from '../styles'

type Props = {
    activeOpacity: number
}

const OPTIONS = [
    { label:'Name', value:'name' },
    { label:'Damge', value:'damage' },
    { label:'Creep Sell Price', value:'price' },
    { label:'Cancel', value:'cancel' } // NOTE: on android, because selectedValue of <Picker> defaults to first value, so if that value is pressed nothing happens, so i put in cancel
]

class SortFab extends PureComponent<Props> {
    render() {
        const { activeOpacity } = this.props;

        const Wrapper = Platform.OS === 'android' ? View : TouchableOpacity;
        return (
            <Wrapper style={styles.sort} onPress={this.handlePress}>
                <View style={styles.backingSmall} >
                    <Icon name="sort" style={styles.labelSmall} />
                    { Platform.OS === 'android' &&
                        <Picker prompt="Sort your items by:" selectedValue="cancel" onValueChange={this.handlePicked} style={{ position:'absolute', width:'100%', height:'100%', transform:[{scale:6}] }}>
                            { OPTIONS.map( option => <Picker.Item label={option.label} value={option.value} key={option.value} /> )}
                        </Picker>
                    }
                </View>
            </Wrapper>
        )
    }

    handlePress = () => {
        Alert.alert( 'Sort your items by:', undefined,
            OPTIONS.map( option => ({ text:option.label, onPress:()=>this.handlePicked(option.value), style:(option.value === 'cancel' ? 'cancel' : undefined) }) )
        );
    }

    handlePicked = value => console.log('value:', value);
}

export default SortFab
