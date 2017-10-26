// @flow
import React, { Component } from 'react'
import { AppRegistry, Platform, StyleSheet, Text, View, StatusBar } from 'react-native'
import { Provider } from 'react-redux'

import store from './flow-control'

import Counter from './Counter'

import styles from './styles'

// if (Platform.os === 'android') StatusBar.setTranslucent(true);

const instructions = Platform.select({
    ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
    android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`,
});

type State = {
    isOpaque: boolean
}

export default class App extends Component<void, State> {
    state = {
        isOpaque: false
    }

    render() {
        const { isOpaque } = this.state;

        return (
            <Provider store={store}>
                <View style={isOpaque ? styles.appOpaque : styles.app}>
                    <View style={styles.container}>
                        <Text style={styles.welcome}>
                            Welcome to React Native!
                        </Text>
                        <Text style={styles.instructions}>
                            To get started, edit App.js
                        </Text>
                        <Text style={styles.instructions}>
                            {instructions}
                        </Text>
                        <Counter />
                    </View>
                </View>
            </Provider>
        )
    }

    setAppOpaque = () => this.setState( () => ({ isOpaque:true }) )
}

AppRegistry.registerComponent('enter_the_gunbook', () => App)
