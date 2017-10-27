// @flow
import React, { Component } from 'react'
import { Image, Text, View, Dimensions } from 'react-native'

import ScaledImage from './ScaledImage'
import Counter from '../Counter'

import styles from './styles'
import BACKGROUND from './background.jpg'
import LOGO from './logo.png'

type Props = {
    setAppOpaque: () => void
}

type State = {
    screen: { width:number, height:number }
}

class ScreenMain extends Component<Props, State> {
    state = {
        ...ScreenMain.getScreenState()
    }

    render() {
        const { screen, isPortrait } = this.state;
        console.log('isPortrait:', isPortrait);

        return (
            <View style={styles.screen} onLayout={this.handleLayoutScreen}>
                <Image source={BACKGROUND} style={styles.background} />
                <View style={styles.marginStatus} />
                <ScaledImage source={LOGO} screen={screen} sourceWidth={873} sourceHeight={281} width={isPortrait ? 0.8 : undefined} height={isPortrait ? undefined : 0.2} />
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

    static getScreenState = () => {
        const screen = Dimensions.get('window')
        return {
            screen,
            isPortrait: screen.height > screen.width
        }
    }

    handleLayoutScreen = () => this.setState(() => ScreenMain.getScreenState())
}

export default ScreenMain
