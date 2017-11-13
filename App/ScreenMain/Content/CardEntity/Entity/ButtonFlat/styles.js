// @flow

import { StyleSheet } from 'react-native'

import colors from '../colors'

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.blue,
        borderRadius: 2,
        padding: 8,
        alignItems: 'center'
    },
    buttonLabel: {
        fontSize: 14,
        color: colors.white,
        fontWeight: 'bold'
    }
})

export default styles
