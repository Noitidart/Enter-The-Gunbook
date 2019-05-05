// @flow
import React, { Component } from 'react'
import { AppRegistry, Platform, StatusBar, ScrollView } from 'react-native'
import { Provider } from 'react-redux'
import DialogAndroid from 'react-native-dialogs'

import store from './flow-control'
import { name as appName } from '../app.json';

import ScreenMain from './ScreenMain'

import styles from './styles'

if (Platform.OS === 'android') {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('rgba(0, 0, 0, .7)', false);

    DialogAndroid.assignDefaults({
        contentColor: '#000000',
        positiveColor: '#191231',
        negativeColor: '#191231',
        neutralColor: '#191231',
        widgetColor: '#191231'
    });
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
                <ScrollView style={isOpaque ? styles.appOpaque : styles.app} contentContainerStyle={styles.appContent} keyboardShouldPersistTaps="handled" scrollEnabled={false}>
                    <ScreenMain setAppOpaque={this.setAppOpaque} />
                </ScrollView>
            </Provider>
        )
    }

    setAppOpaque = () => this.setState( () => ({ isOpaque:true }) )
}

AppRegistry.registerComponent(appName, () => App);
