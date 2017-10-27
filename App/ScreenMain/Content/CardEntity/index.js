import React, { PureComponent } from 'react'
import { Text, View } from 'react-native'

import styles from './styles'

type Props = {

}

class CardCounter extends PureComponent<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    ENTITY PAGE
                </Text>
            </View>
        )
    }
}

export default CardCounter
