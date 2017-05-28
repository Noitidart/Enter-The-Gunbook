import React, { Component, PureComponent } from 'react'
import { Animated, AppRegistry, Image, PermissionsAndroid, Platform, ScrollView, TouchableHighlight, View } from 'react-native'
import { AudioRecorder, AudioUtils } from 'react-native-audio'

import { escapeRegex, compareIntThenLex, stripTags, toTitleCase, wait, wordSimilarity } from './utils'
import * as STT from './watson-stt'
import * as Wiki from './wiki'

import Button from './Button'
import ImagePixelated from './ImagePixelated'
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

/* shape of state.content
{
    reason:
    data:
}
*/

const REASONS = {
    MATCHED: 'MATCHED', // data: {search_term, selected_ix, top10} top10 is array of similarities entries
    ERROR_SERVER_SPEECH: 'ERROR_SERVER_SPEECH', // data: null
    ERROR_NO_SPEAK: 'ERROR_NO_SPEAK' // data: null - voice could not be parsed
};

const entities = Wiki.getEntities();

class OtherLink extends PureComponent {
    // scrollInner
    // setState
    // ix
    // children - string
    handlePress = () => {
        const { scrollInner, setState, ix } = this.props;
        scrollInner(0);
        setState( ({ content, content:{data} }) => ({ content:{ ...content, data:{ ...data, selected_ix:ix } } }));
    }
    render() {
        const { children } = this.props;
        return (
            <Text onPress={this.handlePress} style={styles.link}>{children}</Text>
        )
    }
}

const xOffset = new Animated.Value(0);

class App extends Component {
    setStateBounded = null
    state = {
        load_anim: new Animated.Value(0),
        subcontent_isshowing: false,
        fab_canshow: false,
        haspermission: false, // to use audio recording
        fab_shape: FAB_SHAPE.UNINIT,
        content: null,
        pagerinner_width: 0
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
            this.startListening(5000);
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
            // console.error('error:', error);
            // if (error.includes('No speech detected for 30s.')) {
            //     // /Users/noitidart/Pictures/Screenshot -  28, 2017 12.13 AM.png
            //     this.setState(()=>({ content:{reason:REASONS.ERROR_NO_SPEAK, data:null}, fab_shape:FAB_SHAPE.IDLE }))
            // } else {
                console.error(`STT::getResults - ${error}`);
                this.setState(()=>({ content:{reason:REASONS.ERROR_SERVER_SPEECH, data:error}, fab_shape:FAB_SHAPE.IDLE }))
                throw new Error(`STT::getResults - ${error}`);
            // }
        }

        console.log('textified:', textified);

        let search_term;
        {
            let { results } = textified;
            $RESULTS:
            for (let result of results) {
                let { alternatives, final } = result;
                for (let alt of alternatives) {
                    let { confidence, transcript } = alt;
                    search_term = transcript.trim();
                    break $RESULTS;
                }
            }
        }

        if (!search_term) {
            this.setState(()=>({ content:{reason:REASONS.ERROR_NO_SPEAK, data:null}, fab_shape:FAB_SHAPE.IDLE }))
            return;
        }

        this.setState(()=>({ fab_shape:FAB_SHAPE.SEARCHING }))

        if (!entities.guns || !entities.items) {
            await Promise.all([
                Wiki.refreshGuns(),
                Wiki.refreshItems()
            ]);
        }

        console.log('search_term:', search_term);
        const similarities = []; // {similarity:wordSimilarity(search_term, entity.Name), dotpath:guns.1, entity:}
        entities.guns.forEach((entity, ix) =>
            similarities.push({
                similarity: wordSimilarity(search_term, entity.Name),
                dotpath:`guns.${ix}`,
                entity
            })
        );
        entities.items.forEach((entity, ix) =>
            similarities.push({
                similarity: wordSimilarity(search_term, entity.Name),
                dotpath:`items.${ix}`,
                entity
            })
        );
        similarities.sort( ({similarity:similarity_a}, {similarity:similarity_b}) => similarity_b - similarity_a );

        console.log('similarities:', similarities);

        let content = {
            reason: REASONS.MATCHED,
            data: {
                search_term,
                selected_ix: 0,
                top10: similarities.slice(0, 10)
            }
        };
        this.setState(()=>({ content, fab_shape:FAB_SHAPE.IDLE }))
    }
    startListening = async (duration=3000) => {
        console.log('starting recording');
        let { fab_shape } = this.state;

        this.setState(()=>({content:null, fab_shape:FAB_SHAPE.LISTENING}))

        try {
            const file_path = await AudioRecorder.startRecording();
            console.log('file_path:', file_path);
        } catch (error) {
            console.error('failed to start recording, error:', error);
            return;
        }
        console.log('started recording');

        this.stop_timeout = setTimeout(this.stopListening, duration);
    }
    stop_timeout: null
    stopListening = async () => {
        console.log('stopping recording');
        clearTimeout(this.stop_timeout);

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
    scrollInner = (x, y=0) => {
        // scrolls the current scroll view
        if (!this.pager_inner) return;
        this.pager_inner.scrollTo({x, y:0, animated:true });
    }
    handleScrollInner = Animated.event(
        [
            {
                nativeEvent: {
                    contentOffset: {
                        x: xOffset
                    }
                }
            }
        ]
    )
    refPagerInner = el => this.pager_inner = el
    refPageOuter = el => this.pager_outer = el
    setPagerInnerWidth = ({nativeEvent:{layout:{ width }}}) => {
        this.setState(()=>({pagerinner_width:width}))
        console.log('WIDTH SET TO:', width);
    }
    async fetchDetails(selected) {
        console.log('STARTING FETCH DETAILS');

        const { entity } = selected;
        console.log('entity:', entity, 'entity.details_url:', entity.details_url);
        if ('details' in entity) return; // already fetched details for this, it might be null if it had no details

        const res = await fetch(entity.details_url);
        const html = await res.text();
        // console.log('details_html:', html);

        const stats_stix = html.indexOf('<b>Statistics');
        const stats_enix = html.indexOf('<th', stats_stix);
        const stats_html = html.substr(stats_stix, stats_enix - stats_stix);
        const stats = {};
        const stats_rows = stats_html.match(/<tr[\s\S]*?<\/tr/g);
        // console.log('stats_html:', stats_html);
        for (const row of stats_rows) {
            const stats_cells = row.match(/<td[\s\S]*?<\/td[\s\S]*?>/g); // need the neding tag so needed the `[\s\S]*?>` so stripTags removes it
            // console.log('stats_cells:', stats_cells, 'row:', row);
            const name = stripTags(stats_cells[0]).trim().replace(':', '');
            if (name.startsWith('Introduc')) continue; // skipe "Introduced in"
            const value = Wiki.getValueFromHtml(stats_cells[1]);
            stats[name] = value;
        }
        console.log('stats:', stats);
        // console.log('stats_html:', stats_html);

        // check if it has Notes - which are <li>...</li>
        let detail_notes = null;
        {
            const notes_stix = html.indexOf('id="Notes"');
            if (notes_stix > -1) {
                const notes_enix = html.indexOf('</ul', notes_stix);
                const notes_html = html.substr(notes_stix, notes_enix - notes_stix);
                // console.log('notes_html:', notes_html)
                const note_htmls = notes_html.match(/<li[\s\S]*?<\/li[\s\S]*?>/g); // need the neding tag so needed the `[\s\S]*?>` so stripTags removes it
                // console.log('notes_match:', notes_match);
                detail_notes = note_htmls.map(note_html => stripTags(note_html).trim());
            }
        }
        console.log('detail_notes:', detail_notes);

        Object.assign(entity, { ...stats, detail_notes })

        // is it currently in content? if it is then update it
        const { content:{reason, data:{top10}={} }={},  } = this.state;
        if (reason === REASONS.MATCHED) {
            for (let top of top10) {
                if (top === selected) {
                    // because updated it by reference, just trigger setState again
                    this.setState(({content, content:{data}}) => ({content:{...content, data:{...data}}}))
                    break;
                }
            }
        }
    }
    render() {
        const { pagerinner_width, content, fab_shape, fab_canshow, haspermission, load_anim, subcontent_isshowing } = this.state;

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


        let content_el;
        if (content) {
            switch (content.reason) {
                case REASONS.ERROR_NO_SPEAK: {
                        content_el = (
                            <Text style={styles.nopermission_text}>You did not say anything!</Text>
                        );
                    break;
                }
                case REASONS.ERROR_SERVER_SPEECH: {
                        content_el = (
                            <Text style={styles.nopermission_text}>Speech-to-Text server failed.</Text>
                        );
                    break;
                }
                case REASONS.MATCHED: {
                        const { data:{ search_term, selected_ix, top10 } } = content;

                        const selected = top10[selected_ix];
                        const { entity } = selected;
                        const has_details = Object.keys(entity).includes('detail_notes');
                        if (!has_details) setTimeout(()=>this.fetchDetails(selected), 0);
                        content_el = (
                            <ScrollView ref={this.refPagerInner} style={styles.matched} contentContainerStyle={styles.matched_content_container} horizontal pagingEnabled scrollEventThrottle={16} onScroll={this.handleScrollInner} onLayout={this.setPagerInnerWidth}>
                                <ScrollView style={styles.entity}>
                                    <Text style={styles.nopermission_text}>{entity.Name}</Text>
                                    <PageLink label="Matches >" page={0} right scrollTo={this.scrollInner} isnext page_width={pagerinner_width} />
                                    {/*<Image key="Icon" source={{ uri:entity.Icon }} resizeMode="contain" style={styles.entity_icon} resizeMethod="scale" />*/}
                                    <View key="Icon" style={styles.entity_icon_wrap}>
                                        <ImagePixelated key="Icon" height="50" url={entity.Icon} />
                                    </View>
                                    {Object.entries(entity).sort( ([attr_name_a], [attr_name_b]) => compareIntThenLex(attr_name_a, attr_name_b) ).map( ([attr_name, attr_value]) => {
                                        if (attr_value === null) return undefined; // like detail_notes
                                        switch (attr_name) {
                                            case 'details_url':
                                            case 'Name':
                                            case 'alt_names':
                                            case 'Quote':
                                            case 'Icon':
                                            case 'Notes':
                                            case 'detail_notes':
                                                return undefined;
                                            default:
                                                return (
                                                    <View style={styles.row} key={attr_name}>
                                                        <Text style={styles.attr_name}>{attr_name}</Text>
                                                        <View style={styles.attr_spacer} />
                                                        <Text style={styles.attr_value}>{attr_value}</Text>
                                                    </View>
                                                );
                                        }
                                    })}
                                    { entity.Notes && <Note setState={this.setStateBounded}>{entity.Notes}</Note> }
                                    { !has_details &&
                                        <View style={styles.row} key="details">
                                            <Text style={styles.attr_notes}>Searching Wiki for more details...</Text>
                                        </View>
                                    }
                                    { has_details && entity.detail_notes &&
                                        entity.detail_notes.map( (detail_note, ix) => <Note setState={this.setStateBounded} key={'detail_note_' + ix}>{detail_note}</Note> )
                                    }
                                </ScrollView>
                                <View style={styles.matches}>
                                    <Text style={styles.nopermission_text}>Other Matches</Text>
                                    <PageLink label="< Back" page={1} scrollTo={this.scrollInner} page_width={pagerinner_width} />
                                    <View style={styles.row_said}>
                                        <Text style={styles.text_said}>"{search_term}"</Text>
                                    </View>
                                    {top10.map((top, ix) => {
                                        let { similarity, dotpath, entity } = top;
                                        return (
                                            <View key={dotpath} style={styles.row}>
                                                { selected_ix !== ix && <OtherLink ix={ix} setState={this.setStateBounded} scrollInner={this.scrollInner}>{entity.Name}</OtherLink>}
                                                { selected_ix === ix && <Text style={styles.link_active}>{entity.Name}</Text>}
                                                <Text style={styles.text_item_type}>{toTitleCase(dotpath.substr(0, dotpath.indexOf('.')-1))}</Text>
                                                <Text style={styles.text_similarity}>{Math.round(similarity*100)}%</Text>
                                            </View>
                                        )
                                    })}
                                </View>
                            </ScrollView>
                        );
                    break;
                }
                // no-default
            }
        }


        return (
            <Image source={background_image} style={styles.background} >
                <Animated.Image source={logo_image} style={logo_style} />
                <Animated.View style={content_style}>
                    { subcontent_isshowing && <Animated.View style={subcontent_style}>
                        { !haspermission && <Text style={styles.nopermission_text}>Enter The Gunbook does not have permission to use your microphone</Text> }
                        { haspermission && !fab_canshow && <Button>Listening...</Button> }
                        { haspermission && !fab_canshow && <Text style={styles.initial_listen_text}>(say a gun or item name to search)</Text> }
                        {content_el}
                    </Animated.View> }
                </Animated.View>
                { haspermission && fab_canshow && <Fab startListening={this.startListening} stopListening={this.stopListening} shape={fab_shape} />}
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
    // refButton = el => this.button = el
    handlePress = e => {
        console.log('e:', e);
        const { startListening, stopListening, shape } = this.props;
        if (shape === FAB_SHAPE.IDLE) {
            startListening();
        } else if (shape === FAB_SHAPE.LISTENING) {
            stopListening();
        }
    }
    render() {
        let { shape } = this.props;
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
            let style = styles.fab;
            if (shape === FAB_SHAPE.IDLE) {
                style = [style, styles.fab_idle];
            }
            return <Button style={style} onPress={this.handlePress}>{text}</Button>;
        } else {
            return (
                <Animated.View style={background_style}>
                    { iorder.includes('logo') && <Animated.Image source={logo_image} style={logo_style} /> }
                    <Animated.View style={content_style}>
                        <Animated.View style={subcontent_style}>
                            <Button style={button_style} onPress={this.handlePress}>{text}</Button>
                            <Animated.Text style={text_style}>(say a gun or item name to search)</Animated.Text>
                        </Animated.View>
                    </Animated.View>
                </Animated.View>
            )
        }
    }
}

function showEntity(entity, setState) {
    setState( ({ content, content:{ reason, data }={} }) => {
        if (reason === REASONS.MATCHED) {
            const { top10 } = data;

            const entity_ix = top10.findIndex(({entity:a_entity}) => a_entity === entity);
            if (entity_ix > -1) {
                return {
                    content: {
                        ...content,
                        data: {
                            ...data,
                            selected_ix: entity_ix
                        }
                    }
                };
            } else {
                const dotpath = entities.guns.includes(entity) ? 'guns.' + entities.guns.findIndex(a_entity => a_entity === entity) : 'items.' + entities.items.findIndex(a_entity => a_entity === entity)
                const top10_entry_new = { similarity:0, entity, dotpath }

                const top10_new = [...top10, top10_entry_new];
                const data_new = { ...data, top10:top10_new }
                const content_new = { reason, data:data_new };

                return { content:content_new };
            }
        } else {
            // not yet supported
        }
    })
}

class Note extends PureComponent {
    // children must be a string
    // replace any text within with a link if its name is found in entities
    render() {
        let { children:fulltext, setState } = this.props;
        const names = []; // names found in text, we will split by this arr
        for (const {Name:name} of entities.guns) names.push(name);
        for (const {Name:name} of entities.items) names.push(name);

        names.sort((name_a, name_b) => name_b.length - name_a.length); // sort it longest first, so it doesnt replace like "Bullet Bore" with link to just "Bullet"
        const names_patt_strs = names.map(name => escapeRegex(name) );

        const names_patt = new RegExp('(?:' + names_patt_strs.join('|') + ')', 'g');

        // console.log('names_patt_strs:', names_patt_strs.join('|'));

        // pre text_els stuff
        const ixlens = [0];
        let match;
        while (match = names_patt.exec(fulltext)) {
            const len = match[0].length;
            const ix = names_patt.lastIndex - len;
            const last_len = ix - ixlens[ixlens.length-1];
            const next_ix = names_patt.lastIndex;
            ixlens.push(last_len, ix, len, next_ix);
        }

        const text_els = ixlens.length > 1 ? substrs(fulltext, ...ixlens) : fulltext;
        if (ixlens.length > 1) {
            console.log('fulltext:', fulltext, 'text_els:', text_els);
            for (let i=0; i<text_els.length; i++) {
                const text = text_els[i];
                if (names.includes(text)) {
                    text_els[i] = <ItemLink key={i.toString()} setState={setState} entity={findEntityByName(text)} />
                }
            }
        }

        return (
            <View style={styles.row}>
                <Text style={styles.attr_note}>
                    {text_els}
                </Text>
            </View>
        )
    }
}

function findEntityByName(name) {
    for (const entity of entities.guns) {
        if (entity.Name === name) return entity;
    }
    for (const entity of entities.items) {
        if (entity.Name === name) return entity;
    }
}

class ItemLink extends PureComponent {
    // props
    // entity
    // setState
    onPress = () => {
        let { entity, setState } = this.props;
        showEntity(entity, setState);
    }
    render() {
        let { entity } = this.props;
        return <Text onPress={this.onPress} style={styles.link_noflex}>{entity.Name}</Text>;
    }
}

function substrs(str, ...ixlens) {
    // substrs('Fooba Qux', 0, 5, 6, 3) // ix1, len1, ix2, len2 // returns: Array [ "Fooba", "Qux" ] // can ommit the final 3, it works as normal substr and goes till end if "len" is undefined
    const strs = [];
    for (let i=0; i<ixlens.length; i=i+2) {
        const ix = ixlens[i];
        const len = ixlens[i+1];
        strs.push(str.substr(ix, len));
    }
    return strs;
}

class PageLink extends Component {
    /* props
    label - string
    page - num - the page number this element is on
    right - truthy - bool - position on left
    isnext - truthy - bool - if pressing this should go to next page, by default assumes it should go to previous page
    scrollTo - function for the ScrollViews scrollTo
    page_width - width of the ScrollView - not the container - as container is full width of all the children - so just page_width which is what each paging moves
    */
    handlePress = () => {
        const { isnext, page, scrollTo, page_width } = this.props;
        const goto_page = isnext ? page + 1 : page - 1;
        const goto_x = goto_page * page_width;

        scrollTo(goto_x);
    }
    render() {
        const { label, page, right, page_width } = this.props;

        const pagex_st = page * page_width;
        const pagex_en = pagex_st + page_width;
        const pagex_pre = pagex_st - page_width;
        const pagex_pre_changed = pagex_st - (page_width / 2); // point of no return - so if x is >= this, and user releases at this point, it will come to this page i
        const pagex_en_changed = pagex_st + (page_width / 2); // point of no return
        let opacity;
        if (page_width === 0) {
            // only show opacity 1 on the page 0 item. so this assuems starting page is page 0
            if (page === 0) opacity = 1;
            else opacity = 0;
        } else {
            opacity = xOffset.interpolate({inputRange:[pagex_pre, pagex_pre_changed, pagex_pre_changed+1, pagex_st, pagex_en_changed-1, pagex_en_changed, pagex_en], outputRange:[0, 0, 0.1, 1, 0.1, 0, 0]})
        }
        const style_animated = { opacity };

        return (
            <Animated.View style={[right ? styles.pagelink_view : styles.pagelink_view_left, style_animated]}>
                <TouchableHighlight onPress={this.handlePress}>
                    <View>
                        <Text style={styles.pagelink_text}>{label}</Text>
                    </View>
                </TouchableHighlight>
            </Animated.View>
        )
    }
}

AppRegistry.registerComponent('enter_the_gunbook', () => App);