// @flow

import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    activityListWrap: {

    },
    activityList: {

    },
    activityListContent: {

    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500'
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
        width: '20%',
        paddingHorizontal: 4,
        textAlign: 'center'
    },
    activityItem__time: {
        color: '#FFFFFF',
        width: '20%',
        fontSize: 13,
        paddingLeft: 4,
        textAlign: 'right'
    }
})

export default styles
