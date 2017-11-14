// @flow

import { StyleSheet } from 'react-native'

const OFF_WHITE = 'rgba(255, 255, 255, 0.8)';
const OFF_WHITE_1 = 'rgba(255, 255, 255, 0.7)';

const styles = StyleSheet.create({
    main: {
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flex: 1
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.5)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        marginBottom: 10
    },
    headerIcon: {
        color: '#FFFFFF',
        fontSize: 26,
        padding: 10
    },
    headerLabel: {
        color: '#FFFFFF',
        fontSize: 22,
        lineHeight: 26
    },


    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: OFF_WHITE_1
    },
    title: {
        fontSize: 18,
        color: OFF_WHITE
    },
    titleIcon: {
        color: OFF_WHITE,
        fontSize: 22,
        marginRight: 10
    },
    titleRight: {
        color: OFF_WHITE,
        fontSize: 16,
        marginHorizontal: 7
    },
    titleRightIcon: {
        color: OFF_WHITE,
        fontSize: 19,
        marginHorizontal: 7
    },
    titleRightIconLabel: {
        color: OFF_WHITE,
        fontSize: 13
    },
    titleRightIconWrap: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleSpacer: {
        flex: 1
    },

    para: {
        paddingHorizontal: 15,
        paddingVertical: 5 // link418111
    },
    paraHr: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginTop: 10, // 2* link418111
        alignSelf: 'center',
        width: '95%'
    },
    paraBody: {
        marginVertical: 5,
        marginHorizontal: 3,
        color: '#D3DDE4'
    },

    rowButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6
    }
})

export default styles
