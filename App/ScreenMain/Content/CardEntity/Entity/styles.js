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
    headerIconLabel: {
        color: '#FFFFFF',
        fontSize: 15
    },
    headerIconWrap: {
        flexDirection: 'row',
        alignItems: 'center'
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

    // body: {

    // },

    rowButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6
    },
    button: {
        backgroundColor: '#5677FC',
        borderRadius: 2,
        padding: 8,
        alignItems: 'center'
    },
    buttonLabel: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: 'bold'
    },

    comment: {
        paddingHorizontal: 15,
        paddingVertical: 5 // link3181
    },
    commentHr: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginTop: 10, // 2* link3181
        alignSelf: 'center',
        width: '95%'
    },
    commentHead: {
        flexDirection: 'row'
    },
    commentAvatar: {
        height: 36,
        width: 36,
        borderRadius: 36 / 2,
        backgroundColor: '#858D90',
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    commentAvatarLabel: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold'
    },
    commentHeadText: {
        flex: 1 // so trash icon goes in far right
    },
    row: {
        flexDirection: 'row'
    },
    commentAuthor: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    commentDot: {
        color: '#FFFFFF'
    },
    commentDelete: {
        color: OFF_WHITE
    },
    commentDate: {
        color: '#B2BBC4',
        fontSize: 12
    },
    commentHelpful: {
        color: '#B2BBC4'
    },
    commentBody: {
        marginTop: 3,
        marginHorizontal: 3,
        color: '#D3DDE4'
    },

    addComment: {
        // backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 10, // 2* link3181
    },
    addCommentInput: {
        color: '#FFFFFF',
        backgroundColor: '#2F2B31',
        borderRadius: 5,
        fontSize: 14,
        height: 14 * 2 * 3, // android: line height is fontSize * 2 apparently, at least when fontSize is 14, * 3 for number of lines
        paddingVertical: 4,
        marginBottom: 7,
        textAlignVertical: 'top'
    },

    spacer: {
        flex: 1
    }

})

export default styles
