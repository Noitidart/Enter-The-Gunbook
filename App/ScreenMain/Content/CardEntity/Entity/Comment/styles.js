// @flow

import { StyleSheet } from 'react-native'

const OFF_WHITE = 'rgba(255, 255, 255, 0.8)';
const OFF_WHITE_1 = 'rgba(255, 255, 255, 0.7)';

const styles = StyleSheet.create({
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
        flexDirection: 'row',
        alignItems: 'center'
    },
    commentAuthor: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    commentDot: {
        color: '#FFFFFF'
    },
    commentDeleteWrap: {
        paddingLeft: 20
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
