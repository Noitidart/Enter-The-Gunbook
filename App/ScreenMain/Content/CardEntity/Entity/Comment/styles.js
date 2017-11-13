// @flow

import { StyleSheet } from 'react-native'

import colors from '../colors'

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
        backgroundColor: colors.gray,
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    commentAvatarLabel: {
        color: colors.white,
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
        color: colors.white,
        fontWeight: 'bold'
    },
    commentDot: {
        color: colors.white
    },
    commentDeleteWrap: {
        paddingLeft: 20
    },
    commentDelete: {
        color: colors.white80
    },
    commentDate: {
        color: colors.graySlight,
        fontSize: 12
    },
    commentHelpful: {
        color: colors.graySlight
    },
    commentBody: {
        marginTop: 3,
        marginHorizontal: 3,
        color: colors.whiteSlight
    },

    addComment: {
        // backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 10, // 2* link3181
    },
    addCommentInput: {
        color: colors.white,
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
