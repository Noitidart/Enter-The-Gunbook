import React, { PureComponent } from 'react'
import { Text, View } from 'react-native'

import Counter from './Counter'

import styles from './styles'

type Props = {

}

class CardCounter extends PureComponent<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to React Native!
                </Text>
                <Text style={styles.instructions}>
                    To get started, edit App.js
                </Text>
                <Text style={styles.instructions}>
                    Double tap R on your keyboard to reload,\nShake or press menu button for dev menu
                </Text>
                <Counter />
            </View>
        )
    }
}

export default CardCounter
