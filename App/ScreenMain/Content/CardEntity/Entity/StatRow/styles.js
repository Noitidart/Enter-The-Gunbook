// @flow

import { StyleSheet } from 'react-native'

const OFF_BLACK = 'rgba(0, 0, 0, 0.3)';

const styles = StyleSheet.create({
    main: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: OFF_BLACK,
        borderBottomColor: OFF_BLACK,
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    columns: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    dataCol: {
        flex: 1,
        marginLeft: 10
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    icon: {
        fontSize: 30,
        color: '#FFFFFF'
    },
    name: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)'
    },
    bar: {
        height: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        flex: 1
    },
    barFill: {
        height: 10,
        backgroundColor: '#FFDB0C'
    },
    value: {
        textAlign: 'right',
        width: 60,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16
    }

})

export default styles
