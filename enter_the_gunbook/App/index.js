import React, { Component } from 'react'
import { Animated, AppRegistry, Image } from 'react-native'

import Button from './Button'
import Text from './Text'

import styles from './style.css'
import background_image from './assets/background-0.jpg'
import logo_image from './assets/logo.png'

const load_anim_DURATION = 2000;
const load_anim_MOVEUP_POINT = .5;
const load_anim_SUBCONTENT_SHOW_POINT = 0.7;

class App extends Component {
    setStateBounded = null
    state = {
        load_anim: new Animated.Value(0),
        subcontent_isshowing: false
    }
    constructor(props) {
        super(props);
        this.setStateBounded = this.setState.bind(this);
    }
    componentDidMount() {
        let { load_anim } = this.state;


        Animated.timing(this.state.load_anim, { toValue:1, duration:load_anim_DURATION }).start();

        setTimeout(()=>this.setState( ()=>({ subcontent_isshowing:true })), load_anim_DURATION * load_anim_SUBCONTENT_SHOW_POINT);
    }
    startListen() {
        console.log('listening');
    }
    render() {
        let { load_anim, subcontent_isshowing } = this.state;

        let logo_style = [
            styles.logo,
            {
                width: load_anim.interpolate({ inputRange:[0,load_anim_MOVEUP_POINT,1], outputRange:['95%','95%','50%'] }),
                opacity: load_anim.interpolate({ inputRange:[0,load_anim_MOVEUP_POINT], outputRange:[0,1] })
            }
        ];

        let content_style = [
            styles.content,
            {
                flex: load_anim.interpolate({ inputRange:[0,load_anim_MOVEUP_POINT,1], outputRange:[0,0,4] })
            }
        ];

        let subcontent_style = [
            styles.subcontent,
            {
                top: load_anim.interpolate({ inputRange:[0,load_anim_SUBCONTENT_SHOW_POINT,1], outputRange:['100%','100%','0%'] }),
                opacity: load_anim.interpolate({ inputRange:[load_anim_SUBCONTENT_SHOW_POINT,1], outputRange:[0,1] })
            }
        ];

        return (
            <Image source={background_image} style={styles.background} >
                <Animated.Image source={logo_image} style={logo_style} />
                <Animated.View style={content_style}>
                    { subcontent_isshowing && <Animated.View style={subcontent_style}>
                        <Button onPress={this.startListen}>Listening...</Button>
                    </Animated.View> }
                </Animated.View>
            </Image>
        )
    }
}

AppRegistry.registerComponent('enter_the_gunbook', () => App);