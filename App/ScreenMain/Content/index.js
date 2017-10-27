import React, { PureComponent } from 'react'
import { Image, View, Text } from 'react-native'

import Counter from '../../Counter'

import styles from './styles'

type Props = {

}

class Content extends PureComponent<Props> {
    render() {
        return (
            <View style={styles.content}>
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

export default Content
