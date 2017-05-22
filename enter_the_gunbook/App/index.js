import React, { Component } from 'react'
import { Animated, AppRegistry, Image } from 'react-native'

import Text from './Text'

import styles from './style.css'
import background_image from './assets/background-0.jpg'
import logo_image from './assets/logo.png'

class App extends Component {
    setStateBounded = null
    state = {
        logo_anim: new Animated.Value(0)
    }
    constructor(props) {
        super(props);
        this.setStateBounded = this.setState.bind(this);
    }
    componentDidMount() {
        let { logo_anim } = this.state;
        Animated.timing(this.state.logo_anim, { toValue:1, duration:2000 }).start();
    }
    render() {
        let { logo_anim } = this.state;

        const INPUT_TRANSITION_POINT = .5;
        let logo_style = [
            styles.logo,
            {
                width: logo_anim.interpolate({ inputRange:[0,INPUT_TRANSITION_POINT,1], outputRange:['95%','95%','50%'] }),
                opacity: logo_anim.interpolate({ inputRange:[0,INPUT_TRANSITION_POINT], outputRange:[0,1] })
            }
        ];

        let content_style = [
            styles.content,
            {
                flex: logo_anim.interpolate({ inputRange:[0,INPUT_TRANSITION_POINT,1], outputRange:[0,0,4] }),
            }
        ];

        return (
            <Image source={background_image} style={styles.background} >
                <Animated.Image source={logo_image} style={logo_style} />
                <Animated.View style={content_style}>
                </Animated.View>
            </Image>
        )
    }
}

AppRegistry.registerComponent('enter_the_gunbook', () => App);