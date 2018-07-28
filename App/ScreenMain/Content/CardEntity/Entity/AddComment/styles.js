// @flow

import { StyleSheet, Platform } from 'react-native'

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
        height: Platform.OS === 'ios' ? 14 * 2 * 3 : undefined, // andorid has numberOfLines prop
        paddingHorizontal: Platform.OS === 'ios' ? 4 : undefined,
        paddingVertical: 4,
        marginBottom: 7,
        textAlignVertical: 'top'
    },

    spacer: {
        flex: 1
    }

})

export default styles
