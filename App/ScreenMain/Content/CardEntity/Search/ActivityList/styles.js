// @flow

import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    activityListWrap: {
        flex: 1
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
        marginVertical: 8
    },
    activityItem: {
        flexDirection: 'row'
    },
    activityItem__itemName: {
        // color: '#FFFFFF',
        // width: '35%',
        flex: 1,
        fontSize: 13,
        paddingRight: 4
    },
    activityItem__description: {
        color: '#FFFFFF',
        width: '15%',
        paddingHorizontal: 4,
        textAlign: 'center'
    },
    activityItem__time: {
        color: '#FFFFFF',
        width: '25%',
        fontSize: 13,
        paddingLeft: 4,
        textAlign: 'right'
    }
})

export default styles
