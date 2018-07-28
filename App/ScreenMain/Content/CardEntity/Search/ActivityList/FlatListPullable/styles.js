// @flow

import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    flatListWrap: {
        flex: 1,
        flexGrow: 1
    },
    flatList: {
        // backgroundColor: 'green',
        flex: 1
    },
    flatListContent: {
        // backgroundColor: 'blue'
    },
    flatListWrap: {
        flex: 1
    },

    loadMore: {
        position: 'absolute',
        top: '100%',
        width: '100%',
        height: 56,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadMoreLabel: {
        color: '#FFFFFF',
        fontSize: 15,
        lineHeight: 20,
        marginLeft: 8,
        fontWeight: '500'
    },
    loadMoreIcon: {
        color: '#FFFFFF',
        fontSize: 20
    }
})

export default styles
