// @flow
import React, { Component } from 'react'
import { AppRegistry, Platform, StatusBar, View } from 'react-native'
import { Provider } from 'react-redux'

import store from './flow-control'

import ScreenMain from './ScreenMain'

import styles from './styles'

if (Platform.OS === 'android') {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('rgba(0, 0, 0, .7)', false);
}

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
                    <ScreenMain setAppOpaque={this.setAppOpaque} />
                </View>
            </Provider>
        )
    }

    setAppOpaque = () => this.setState( () => ({ isOpaque:true }) )
}

AppRegistry.registerComponent('enter_the_gunbook', () => App)
