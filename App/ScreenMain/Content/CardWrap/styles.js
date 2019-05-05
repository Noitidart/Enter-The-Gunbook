// @flow

import { StyleSheet } from 'react-native'

const CARD_MARGIN = 20;

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentContainer: {
        // padding: 20,
        // width: '100%'
    },
    scroller: {
        // backgroundColor: 'skyblue'
    },
    card: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 2,
        // padding: 10,
        margin: CARD_MARGIN,
        flex: 1
    },

    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#FFFFFF'
    },
    instructions: {
        textAlign: 'center',
        color: '#FFFFFF',
        marginBottom: 5
    },
    text: {
        color: '#FFFFFF'
    }
})

export { CARD_MARGIN }
export default styles
