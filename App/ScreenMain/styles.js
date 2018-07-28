// @flow

import { StyleSheet, StatusBar, Platform } from 'react-native'

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#191231'
    },
    background: {
        position: 'absolute',
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    marginStatus: {
        height: (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight),
        marginBottom: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignSelf: 'stretch'
    },
    statusWrap: {
        marginTop: 20
    },
    statusLabel: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold'
    }
})

export default styles
