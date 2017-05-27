import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    background: {
        // crossfile-link3817778 to get the image responsive on landing per - http://stackoverflow.com/a/32428956/1828637
        flex: 1,
        width: null,
        height: null,
        alignItems: 'center', // get mainbutton to not stretch across
        justifyContent: 'center', // center content vertically
        resizeMode: 'cover'
    },
    background_fab: {
        position: 'absolute',
        // copy of `background`
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center', // get mainbutton to not stretch across
        justifyContent: 'center' // center content vertically
    },
    //
    logo: {
        flex: 1,
        width: '80%',
        resizeMode: 'contain'
    },
    logo_fab: {
        flex: 1,
        width: '50%',
        resizeMode: 'contain',
        opacity: 0
        // backgroundColor: 'skyblue'
    },
    //
    content: {
        flex: 0,
        flexDirection: 'row' // for link291992
    },
    content_fab: {
        flex: 4,
        flexDirection: 'row',
        // backgroundColor: 'orange'
        // copy paste of `content` but with flex to final after `load_anim` value
        // backgroundColor: 'lightsteelblue',
    },
    //
    subcontent: {
        borderWidth: 1,
        borderRadius: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        margin: 20,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1 // makes it take 100% width link291992
    },
    subcontent_fab: {
        // copy paste of `subcontent`
        borderWidth: 1,
        borderRadius: 2,
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
        margin: 20,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        // added for fab
        borderColor: 'transparent'
    },
    //
    fab: {
        position: 'absolute'
    },
    fab_idle: {
        right: 10,
        bottom: 10
    },
    //
    nopermission_text: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        marginHorizontal: 30
    },
    initial_listen_view: {
        alignItems: 'center'
    },
    initial_listen_text: {
        backgroundColor: 'transparent', // on iOS Animated.Text has a white background - so override that to transparent
        marginTop: 10,
        fontSize: 11,
        color: '#FFFFFF' // because Animated.Text also uses this - so i match style stuff from ./Text/style.css.js
    },
    //
    matched: {
        flexDirection: 'row'
    },
    matched_content_container: {
        width: '200%'
    },
    entity: {
        // backgroundColor: 'skyblue',
        width: '50%'
    },
    matches: {
        // backgroundColor: 'steelblue',
        width: '50%'
    },
    //
    entity_icon: {
        flex: 1,
        maxHeight: 50,
        marginVertical: 10
    },
    //
    link_noflex: {
        color: '#FFCC33',
        fontWeight: '600',
        flex: 1
    },
    link: {
        color: '#FFCC33',
        fontWeight: '600',
        flex: 1,
        fontSize: 12
    },
    link_active: {
        color: '#FFFFFF',
        fontWeight: '800',
        flex: 1,
        fontSize: 12
    },
    attr_name: {
        textAlign: 'right',
        flex: 1,
        fontSize: 12
    },
    attr_spacer: {
        width: 10
    },
    attr_value: {
        flex: 1,
        fontSize: 12
    },
    attr_note: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12
    },
    row: {
        marginVertical: 3,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    text_said: {
        fontStyle: 'italic',
        fontSize: 14,
        textAlign: 'center'
    },
    row_said: {
        marginTop: 3,
        marginBottom: 5
    },
    text_similarity: {
        flex: 1,
        textAlign: 'right',
        fontSize: 12
    },
    text_item_type: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12
    },
    //
    pagelink_view: {
        position: 'absolute',
        top: 3,
        right: 0
    },
    pagelink_view_left: {
        position: 'absolute',
        top: 3,
        left: 0
    }
})

export default styles