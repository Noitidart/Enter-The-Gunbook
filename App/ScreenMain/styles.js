// @flow

import { StyleSheet, StatusBar } from 'react-native'

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    background: {
        position: 'absolute',
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    marginStatus: {
        height: StatusBar.currentHeight + 10
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    }
})

export default styles
