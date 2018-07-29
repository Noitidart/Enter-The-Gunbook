// @flow
import React, { Component } from 'react'
import { Animated, Dimensions, Image, Keyboard, Platform, Text, View } from 'react-native'

import Content from './Content'
import Loading from './Loading'
import ImageScaled from './ImageScaled'

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

    animKeyboard = new Animated.Value(0)
    animKeyboardStyle = { transform: [{ translateY: this.animKeyboard }] }

    constructor(props: Props) {
        super(props);
        keyboardManagement.enableKeyboardAvoiding = this.enableKeyboardAvoiding;
    }
    componentDidMount() {
        if (Platform.OS === 'ios') {
            Keyboard.addListener('keyboardWillShow', this.handleKeyboardWillShow);
            Keyboard.addListener('keyboardWillHide', this.handleKeyboardWillHide);
        }
    }
    componentWillUnmount() {
        if (Platform.OS === 'ios') {
            Keyboard.removeListener(this.handleKeyboardWillShow);
            Keyboard.removeListener(this.handleKeyboardWillHide);        
        }
    }

    render() {
        const { screen, isPortrait, isLoaded, isPreLoaded, loadingStatus } = this.state;

        return (
            <Animated.View style={[styles.screen, this.animKeyboardStyle]} onLayout={this.handleLayoutScreen}>
                <Image source={BACKGROUND} style={[styles.background, { opacity:(isPreLoaded ? 1 : 0) }]} onLoad={this.handleLoadBackground} />
                <View style={styles.marginStatus} />
                <ImageScaled style={{ opacity:(isPreLoaded ? 1 : 0) }} source={LOGO} screen={screen} sourceWidth={873} sourceHeight={281} width={isPortrait ? 0.8 : undefined} height={isPortrait ? undefined : 0.2} onLoad={this.handleLoadLogo} />
                { !isLoaded && <Loading setLoadingStatus={this.setLoadingStatus} setLoaded={this.setLoaded} setPreLoaded={this.setPreLoaded} isBackgroundLoaded={this.state.isBackgroundLoaded} isLogoLoaded={this.state.isLogoLoaded} isPreLoaded={isPreLoaded} /> }
                { isPreLoaded && !isLoaded &&
                    <View style={styles.statusWrap}>
                        <Text style={styles.statusLabel}>{loadingStatus}</Text>
                    </View>
                }
                { isLoaded && <Content screen={screen} /> }
            </Animated.View>
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

    isKeyboardAvoidingEnabled = false
    keyboardAvoidDp = 0

    handleKeyboardWillShow = (e: KeyboardWillShowEvent) => {
        // console.log('will show, e:', e);
        this.keyboardAvoidDp = e.endCoordinates.screenY-e.startCoordinates.screenY;
        this.avoidKeyboardIfEnabled();
    }

    handleKeyboardWillHide = (e: KeyboardWillHideEvent) => {
        // console.log('will hide, e:', e);
        this.isKeyboardAvoidingEnabled = false;
        this.keyboardAvoidDp = 0;
        Animated.timing(this.animKeyboard, { duration:250, toValue:0, useNativeDriver:true }).start();
    }

    avoidKeyboardIfEnabled = () => {
        if (this.isKeyboardAvoidingEnabled) {
            Animated.timing(this.animKeyboard, { duration:250, toValue:this.keyboardAvoidDp, useNativeDriver:true }).start();
        }
    }

    enableKeyboardAvoiding = () => {
        this.isKeyboardAvoidingEnabled = true;
        this.avoidKeyboardIfEnabled();
    }
}

const keyboardManagement = {}

export { keyboardManagement }
export default ScreenMain
