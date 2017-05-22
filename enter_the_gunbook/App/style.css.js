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
    //
    logo: {
        flex: 1,
        width: '80%',
        resizeMode: 'contain',
    },
    content: {
        flex: 0,
        flexDirection: 'row' // for link291992
    },
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
    //
    nopermission_text: {
        textAlign: 'center',
        fontSize: 17,
        fontWeight: 'bold',
        marginHorizontal: 30
    },
    initial_listen_view: {
        alignItems: 'center'
    }
})

export default styles