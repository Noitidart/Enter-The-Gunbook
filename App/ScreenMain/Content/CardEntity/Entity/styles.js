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
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.5)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    headerIcon: {
        color: '#FFFFFF',
        fontSize: 26,
        padding: 10
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
        color: OFF_WHITE
    },
    kind: {
        fontSize: 15,
        color: OFF_WHITE
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

    body: {

    },

    para: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: '#FFFFFF'
    }
})

export default styles
