// @flow

import React, { PureComponent } from 'react'
import { Text, TouchableHighlight, View } from 'react-native'

import styles from './styles'

type Props = {
    onPress: () => void,
    label: string
}

class ButtonFlat extends PureComponent<Props> {
    render() {
        const { onPress, label } = this.props;

        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </TouchableHighlight>
        )
    }
}

export default ButtonFlat
