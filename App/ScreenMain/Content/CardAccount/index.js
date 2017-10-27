import React, { PureComponent } from 'react'
import { Text, View } from 'react-native'

import Icon from '../../../Icon'

import styles from './styles'

type Props = {

}

class CardAccount extends PureComponent<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Icon name="settings" style={styles.welcome} />
                <Text style={styles.welcome}>Settings</Text>
            </View>
        )
    }
}

export default CardAccount
