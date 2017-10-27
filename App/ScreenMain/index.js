// @flow
import React, { Component } from 'react'
import { Image, View, Dimensions, Text } from 'react-native'

import Content from './Content'
import Loading from './Loading'
import ScaledImage from './ScaledImage'

import styles from './styles'
import LOGO from './logo.png'
import BACKGROUND from './background.jpg'

type Props = {
    setAppOpaque: () => void
}

type State = {
    screen: { width:number, height:number },
    isPortrait: boolean,
    backgroundLoaded: boolean,
    logoLoaded: boolean,
    isPreLoaded: boolean,
    isLoaded: boolean
}

class ScreenMain extends Component<Props, State> {
    state = {
        ...ScreenMain.getScreenState(),
        isBackgroundLoaded: false,
        isLogoLoaded: false,
        isLoaded: false,
        isPreLoaded: false,
        loadingStatus: 'Initializing...'
    }


    render() {
        const { screen, isPortrait, isLoaded, isPreLoaded, loadingStatus } = this.state;

        return (
            <View style={styles.screen} onLayout={this.handleLayoutScreen}>
                <Image source={BACKGROUND} style={[styles.background, { opacity:(isPreLoaded ? 1 : 0) }]} onLoad={this.handleLoadBackground} />
                <View style={styles.marginStatus} />
                <ScaledImage style={{ opacity:(isPreLoaded ? 1 : 0) }} source={LOGO} screen={screen} sourceWidth={873} sourceHeight={281} width={isPortrait ? 0.8 : undefined} height={isPortrait ? undefined : 0.2} onLoad={this.handleLoadLogo} />
                { !isLoaded && <Loading setLoadingStatus={this.setLoadingStatus} setLoaded={this.setLoaded} setPreLoaded={this.setPreLoaded} isBackgroundLoaded={this.state.isBackgroundLoaded} isLogoLoaded={this.state.isLogoLoaded} isPreLoaded={isPreLoaded} /> }
                { isPreLoaded && !isLoaded &&
                    <View style={styles.statusWrap}>
                        <Text style={styles.statusLabel}>{loadingStatus}</Text>
                    </View>
                }
                { isLoaded && <Content screen={screen} /> }
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

    handleLoadLogo = () => this.setState(() => ({ isLogoLoaded:true }))
    handleLoadBackground = () => this.setState(() => ({ isBackgroundLoaded:true }))
    setLoaded = () => this.setState(() => ({ isLoaded:true }))
    setPreLoaded = () => this.setState(() => ({ isPreLoaded:true }))
    setLoadingStatus = loadingStatus => this.setState(() => ({ loadingStatus }))
}

export default ScreenMain
