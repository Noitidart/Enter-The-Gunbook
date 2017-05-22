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
        resizeMode: 'contain',
        backgroundColor: 'skyblue'
    }
})

export default styles