// @flow

import { StyleSheet } from 'react-native'

import colors from '../colors'

const styles = StyleSheet.create({
    addComment: {
        // backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 10, // 2* link3181
    },
    addCommentInput: {
        color: colors.white,
        backgroundColor: colors.darkGray,
        borderRadius: 5,
        fontSize: 14,
        // height: 14 * 2 * 3, // android: line height is fontSize * 2 apparently, at least when fontSize is 14, * 3 for number of lines
        paddingVertical: 4,
        marginBottom: 7,
        textAlignVertical: 'top'
    },

    spacer: {
        flex: 1
    }

})

export default styles
