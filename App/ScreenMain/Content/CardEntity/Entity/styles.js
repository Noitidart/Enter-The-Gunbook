// @flow

import { StyleSheet } from 'react-native'

import colors from './colors'

const styles = StyleSheet.create({
    main: {
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flex: 1
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.5)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    headerIcon: {
        color: colors.white,
        fontSize: 26,
        padding: 10 // link18847
    },
    headerIconLabel: {
        color: colors.white,
        fontSize: 15
    },
    headerIconWrap: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    headerActivity: {
        padding: 10 // from link18847
    },

    image: {
        width: 100,
        height: 100,
        position: 'absolute',
        left: 10,
        top: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inlineImageRow: {
        minHeight: 80,
        paddingTop: 5,
        paddingBottom: 10,
        flexDirection: 'row',
        marginLeft: 120 // indent to avoid image
    },
    descRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    quality: {
        resizeMode: 'stretch',
        width: 10,
        height: 14,
        marginTop: 1,
        marginHorizontal: 1
    },
    name: {
        fontSize: 24,
        color: colors.white80
    },
    kind: {
        fontSize: 15,
        color: colors.white80
    },

    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.white70
    },
    title: {
        fontSize: 18,
        color: colors.white80
    },
    titleIcon: {
        color: colors.white80,
        fontSize: 22,
        marginRight: 10
    },
    titleRight: {
        color: colors.white80,
        fontSize: 16,
        marginHorizontal: 7
    },
    titleRightIcon: {
        color: colors.white80,
        fontSize: 19,
        marginHorizontal: 7 // link339
    },
    titleRightIconLabel: {
        color: colors.white80,
        fontSize: 13
    },
    titleRightIconWrap: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleSpacer: {
        flex: 1
    },

    titleActivity: {
        marginHorizontal: 7 // from link339
    },

    // body: {

    // },

    rowButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6
    },

    spacer: {
        flex: 1
    },

    commentsLoading: {
        marginVertical: 20
    },
    commentsMessage: {
        color: colors.whiteSlight,
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 20
    },

    red: {
        color: colors.red
    },
    blue: {
        color: colors.blue
    }
})

export default styles
