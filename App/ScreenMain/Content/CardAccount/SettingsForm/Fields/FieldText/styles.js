// @flow

import { StyleSheet, Platform } from 'react-native'

const OFF_WHITE = 'rgba(255, 255, 255, 0.8)';
const OFF_WHITE_1 = 'rgba(255, 255, 255, 0.7)';

const styles = StyleSheet.create({
    input: {
        color: '#FFFFFF',
        backgroundColor: '#2F2B31',
        borderRadius: 5,
        fontSize: 14,
        height: 14 * 2 * 1, // android: line height is fontSize * 2 apparently, at least when fontSize is 14, * 1 for number of lines
        paddingVertical: 4,
        paddingHorizontal: Platform.OS === 'ios' ? 4 : undefined,
        width: 130,
        marginLeft: 5
    },

    taken: {
        color: '#FFDB0C',
        fontWeight: 'bold',
        fontSize: 12,
        marginVertical: 5
    }
})

export default styles
