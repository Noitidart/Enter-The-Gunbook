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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    nopermission_text: {
        textAlign: 'center',
        fontSize: 17,
        fontWeight: 'bold',
        marginHorizontal: 30
    },
    initial_listen_view: {
        alignItems: 'center'
    },
    initial_listen_text: {
        marginTop: 10,
        fontSize: 13,
        color: '#FFFFFF' // because Animated.Text also uses this - so i match style stuff from ./Text/style.css.js
    }
})

export default styles