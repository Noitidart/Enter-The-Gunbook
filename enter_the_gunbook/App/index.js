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

const LOAD_ANIM_DURATION = 2000;
const load_anim_MOVEUP_POINT = .5;
const load_anim_SUBCONTENT_SHOW_POINT = 0.7;

const FAB_SHAPE = {
    UNINIT: 'UNINIT',
    LISTENING: 'LISTENING',
    TEXTING: 'TEXTING',
    SEARCHING: 'SEARCHING',
    IDLE: 'IDLE'
}

class App extends Component {
    setStateBounded = null
    state = {
        load_anim: new Animated.Value(0),
        subcontent_isshowing: false,
        fab_canshow: false,
        haspermission: false, // to use audio recording
        fab_shape: FAB_SHAPE.UNINIT,
        content: null
    }
    constructor(props) {
        super(props);
        this.setStateBounded = this.setState.bind(this);
    }
    async componentDidMount() {

        // loading animation
        const { load_anim } = this.state;
        Animated.timing(load_anim, { toValue:1, duration:LOAD_ANIM_DURATION }).start();
        setTimeout(()=>this.setState( ()=>({ subcontent_isshowing:true })), LOAD_ANIM_DURATION * load_anim_SUBCONTENT_SHOW_POINT);
        setTimeout(()=>this.setState( ()=>({ fab_canshow:true })), LOAD_ANIM_DURATION);

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
            console.log('AudioUtils:', AudioUtils);

            if (Platform.OS === 'ios') {
                this.AUDIO_EXT = 'ulaw';
                this.AUDIO_ENCODING = 'ulaw';
                this.AUDIO_SAMPLE_RATE = 22050;
                this.AUDIO_CONTENT_TYPE = 'audio/mulaw;rate=' + this.AUDIO_SAMPLE_RATE;
            } else if (Platform.OS === 'android') {
                this.AUDIO_EXT = 'ogg';
                this.AUDIO_ENCODING = 'vorbis';
                this.AUDIO_CONTENT_TYPE = 'audio/ogg;'
                this.AUDIO_SAMPLE_RATE = 22050;
            } else {
                alert('your platform is not supported, only ios and android');
            }

            this.AUDIO_PATH = AudioUtils.DocumentDirectoryPath + '/enter-the-gunbook.' + this.AUDIO_EXT;
            AudioRecorder.prepareRecordingAtPath(this.AUDIO_PATH, { SampleRate:this.AUDIO_SAMPLE_RATE, Channels:1, AudioQuality:'Low', AudioEncoding:this.AUDIO_ENCODING });
            AudioRecorder.onProgress = this.handleAudioProgress;
            AudioRecorder.onFinished = this.handleAudioFinishIOS;
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
            alert('failed to record!!');
            console.error('failed to record!!');
            return;
        }

        let textified;
        try {
            textified = await STT.getResults(file_path, this.AUDIO_EXT, this.AUDIO_CONTENT_TYPE)
        } catch(error) {
            console.error(`STT::getResults - ${error}`);
            this.setState(()=>({ content:'Failed to convert your speech to text', fab_shape:FAB_SHAPE.IDLE }))
            throw new Error(`STT::getResults - ${error}`);
        }

        console.log('textified:', textified);
        this.setState(()=>({ fab_shape:FAB_SHAPE.SEARCHING }))
    }
    startListening = async () => {
        console.log('starting recording');
        let { fab_shape } = this.state;

        this.setState(()=>({fab_shape:FAB_SHAPE.LISTENING}))

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

        this.setState(()=>({fab_shape:FAB_SHAPE.TEXTING}))

        if (Platform.OS === 'android') {
            this.handleAudioFinish(true, file_path);
        }
    }
    render() {
        const { fab_shape, fab_canshow, haspermission, load_anim, subcontent_isshowing } = this.state;

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
                        { haspermission && !fab_canshow && <Button>Listening...</Button> }
                        { haspermission && !fab_canshow && <Text style={styles.initial_listen_text}>(say a gun or item name to search)</Text> }
                    </Animated.View> }
                </Animated.View>
                { haspermission && fab_canshow && <Fab startListening={this.startListening} shape={fab_shape} />}
            </Image>
        )
    }
}

function AnimatedAsync(name, ...args) {
    return new Promise(resolve => Animated[name](...args).start(resolve));
}

function objectSet(obj, key, value) {
    // sets and return
    obj[key] = value;
    return obj;
}

class Fab extends Component {
    /* props
    shape - UNINIT, UNINIT_LISTENING, UNINIT_TEXTIFYING
    */
    state = {
        iorder: ['logo', 'subcontent', 'text', 'background', 'content'],
        ianim: ['background', 'logo', 'content', 'subcontent', 'text'].reduce( (acc, animid) => objectSet(acc, animid, new Animated.Value(0)), {}), // ianim stands for initial_anim
        initialized: false // set to false for in progress
    }
    initializeNext = async () => {
        const { ianim, iorder } = this.state;
        // console.error('starting anim for:', iorder[0]);
        await AnimatedAsync('timing', ianim[iorder[0]], { toValue:1, duration:200 });
        this.setState(({iorder})=>{
            let iorder_new = iorder.filter((el, ix) => ix !== 0);
            if (iorder_new.length) {
                return { iorder:iorder_new, initialized:false };
            } else {
                return { iorder:null, initialized:true };
            }
        });
    }
    componentDidUpdate(propsold, stateold) {
        const { initialized, iorder } = this.state;
        const { iorder:iorder_old } = stateold;
        const { shape } = this.props;
        const { shape:shape_old } = propsold;
        console.log('shape:', shape, 'shape_old:', shape_old);
        if (!initialized) {
            if (shape_old !== FAB_SHAPE.TEXTING && shape === FAB_SHAPE.TEXTING) {
                this.initializeNext();
            } else if (iorder && iorder !== iorder_old) {
                // guranteed iorder is not null
                this.initializeNext();
            }
        }
    }
    render() {
        let { startListening, shape } = this.props;
        let { iorder, initialized, ianim } = this.state;

        // point of initial styles is to perfectly over lap the non-pressable button that slid in with the view
        let background_style = styles.background_fab;
        let logo_style = styles.logo_fab;
        let content_style = styles.content_fab;
        let subcontent_style = styles.subcontent_fab;
        let button_style = undefined;
        let text_style = [styles.initial_listen_text, { opacity: ianim.logo.interpolate({ inputRange:[0,1], outputRange:[1,0] }) }];

        if (!initialized) {
            logo_style = [logo_style, { flex: ianim.logo.interpolate({ inputRange:[0,1], outputRange:[1,.001] }) }];

            if (!iorder.includes('logo')) {
                subcontent_style = [subcontent_style, {
                    margin: ianim.subcontent.interpolate({ inputRange:[0,1], outputRange:[20,0] }),
                    padding: ianim.subcontent.interpolate({ inputRange:[0,1], outputRange:[10,0] }),
                    borderWidth: ianim.subcontent.interpolate({ inputRange:[0,1], outputRange:[1,0] })
                }];
            }
            if (!iorder.includes('subcontent')) {
                text_style.push({
                    fontSize: ianim.text.interpolate({ inputRange:[0,1], outputRange:[13,0] }),
                    marginTop: ianim.text.interpolate({ inputRange:[0,1], outputRange:[10,0] })
                });
            }

            if (!iorder.includes('text')) {
                button_style = {
                    position: 'absolute'
                };
            }
        }

        const text = (function getTextForShape(shape, isinitialized) {
            switch (shape) {
                case FAB_SHAPE.UNINIT:
                case FAB_SHAPE.LISTENING:
                    return 'Listening...';
                case FAB_SHAPE.TEXTING:
                case FAB_SHAPE.SEARCHING:
                    return 'Searching...';
                case FAB_SHAPE.IDLE:
                    return 'Search Again';
            }
        })(shape, initialized);

        if (initialized) {
            return <Button style={styles.fab}>{text}</Button>;
        } else {
            return (
                <Animated.View style={background_style}>
                    { iorder.includes('logo') && <Animated.Image source={logo_image} style={logo_style} /> }
                    <Animated.View style={content_style}>
                        <Animated.View style={subcontent_style}>
                            <Button style={button_style}>{text}</Button>
                            <Animated.Text style={text_style}>(say a gun or item name to search)</Animated.Text>
                        </Animated.View>
                    </Animated.View>
                </Animated.View>
            )
        }
    }
}

AppRegistry.registerComponent('enter_the_gunbook', () => App);