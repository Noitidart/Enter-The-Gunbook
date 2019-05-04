// @flow

import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    view: {
        position: 'absolute',
        top: 54,
        right: 16,
        backgroundColor: '#ff465c',
        padding: 8,
        borderRadius: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    text: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    links: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    cancelButton: {
        borderRadius: 2,
        padding: 8,
        marginHorizontal: 8,
        alignItems: 'center'
    },
    cancelLabel: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: 'bold'
    }
})

export default styles
