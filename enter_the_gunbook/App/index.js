import React, { Component } from 'react'
import { Animated, AppRegistry, Image, PermissionsAndroid, Platform, View } from 'react-native'
import { AudioRecorder, AudioUtils } from 'react-native-audio'

import { wait } from './utils'
import * as STT from './watson-stt'

import Button from './Button'
import Text from './Text'

import background_image from './assets/background-0.jpg'
import logo_image from './assets/logo.png'
import styles from './style.css'

const load_anim_DURATION = 2000;
const load_anim_MOVEUP_POINT = .5;
const load_anim_SUBCONTENT_SHOW_POINT = 0.7;

class App extends Component {
    setStateBounded = null
    watson_token = null
    state = {
        load_anim: new Animated.Value(0),
        subcontent_isshowing: false,
        haspermission: false // to use audio recording
    }
    constructor(props) {
        super(props);
        this.setStateBounded = this.setState.bind(this);
    }
    async componentDidMount() {

        // loading animation
        const { load_anim } = this.state;
        Animated.timing(this.state.load_anim, { toValue:1, duration:load_anim_DURATION }).start();
        setTimeout(()=>this.setState( ()=>({ subcontent_isshowing:true })), load_anim_DURATION * load_anim_SUBCONTENT_SHOW_POINT);

        // check audio permission
        let haspermission = await this.checkPermission();
        if (haspermission) {
            this.setState( ()=>({ haspermission }) );
        }
    }
    componentDidUpdate(propsold, stateold) {
        const { haspermission } = this.state;
        const { haspermission:haspermissionold } = stateold;

        if (!haspermissionold && haspermission) {
            // set up audio
            this.AUDIO_PATH = AudioUtils.MusicDirectoryPath + '/enter-the-gunbook.aac';
            AudioRecorder.prepareRecordingAtPath(this.AUDIO_PATH, { SampleRate:22050, Channels:1, AudioQuality:'Low', AudioEncoding:'aac' });
            AudioRecorder.onProgress = this.handleAudioProgress;
            AudioRecorder.onFinish = this.handleAudioFinishIOS;
            this.startListening();
        }
    }
    async checkPermission() {
        if (Platform.OS !== 'android') {
            return Promise.resolve(true);
        }

        let result;
        try {
            result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, { title:'Microphone Permission', message:'Enter the Gunbook needs access to your microphone so you can search with voice.' });
        } catch(error) {
            console.error('failed getting permission, result:', result);
        }
        // console.log('permission result:', result);
        return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
    }
    handleAudioProgress = data => {
        console.log('data.currentTime:', data.currentTime, 'data:', data);
    }
    handleAudioFinishIOS = data => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === 'ios') {
            console.log('ok recording finished ios, data:', data);
            this.handleAudioFinish(data.status === 'OK', data.audioFileURL);
        }
    }
    async handleAudioFinish(didsucceed, file_path) {
        console.log('handleAudioFinish', 'didsucceed:', didsucceed, 'file_path:', file_path);

        if (!didsucceed) {
            console.error('failed to record!!');
            return;
        }

        if (!this.watson_token) {
            try {
                this.watson_token = await STT.getToken();
                console.log('watson_token:', this.watson_token);
            } catch(error) {
                console.error(`STT::getToken - ${error}`);
                throw new Error(`STT::getToken - ${error}`);
            }
        }

        let textified;
        try {
            textified = STT.getResults(file_path, 'aac', this.watson_token)
        } catch(error) {
            console.error(`STT::getResults - ${error}`);
            throw new Error(`STT::getResults - ${error}`);
        }
    }
    startListening = async () => {
        console.log('starting recording');
        try {
            const file_path = await AudioRecorder.startRecording();
            console.log('file_path:', file_path);
        } catch (error) {
            console.error('failed to start recording, error:', error);
            return;
        }
        console.log('started recording');

        await wait(5000);

        this.stopListening();
    }
    stopListening = async () => {
        console.log('stopping recording');
        let file_path;
        try {
            file_path = await AudioRecorder.stopRecording();
        } catch(error) {
            console.error('failed to stop recording, error:', error);
            return;
        }
        console.log('stopped recording');

        if (Platform.OS === 'android') {
            this.handleAudioFinish(true, file_path);
        }
    }
    render() {
        const { load_anim, subcontent_isshowing, haspermission } = this.state;

        const logo_style = [
            styles.logo,
            {
                width: load_anim.interpolate({ inputRange:[0,load_anim_MOVEUP_POINT,1], outputRange:['95%','95%','50%'] }),
                opacity: load_anim.interpolate({ inputRange:[0,load_anim_MOVEUP_POINT], outputRange:[0,1] })
            }
        ];

        const content_style = [
            styles.content,
            {
                flex: load_anim.interpolate({ inputRange:[0,load_anim_MOVEUP_POINT,1], outputRange:[0,0,4] })
            }
        ];

        const subcontent_style = [
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
                        { !haspermission && <Text style={styles.nopermission_text}>Enter The Gunbook does not have permission to use your microphone</Text> }
                        { haspermission &&
                            <View style={styles.initial_listen_view}>
                                <Button onPress={this.startListening}>Listening...</Button>
                                <Text style={{marginTop:10, fontSize:13}}>(say a gun or item name to search)</Text>
                            </View>
                        }
                    </Animated.View> }
                </Animated.View>
            </Image>
        )
    }
}

AppRegistry.registerComponent('enter_the_gunbook', () => App);