// @flow

import React, { PureComponent } from 'react'
import { Alert, TextInput, View, Platform } from 'react-native'
import { connect } from 'react-redux'

import ButtonFlat from '../ButtonFlat'

import { addComment } from '../../../../../flow-control/social'
import { alertDisplayname } from '../../../../../flow-control/social/utils'
import { keyboardManagement } from '../../../..'

import styles from './styles'

import type { SocialEntity, ArticleId } from '../../../../../flow-control/social/types'
import type { Shape as SocialShape } from '../../../../../flow-control/social'
import type { Shape as AppShape } from '../../../../../flow-control'

type OwnProps = {
    name: string,
    id: null | ArticleId
}

type Props = {
    ...OwnProps,
    // redux
    dispatch: Dispatch,
    forename: string
}

type State = {
    body: string
}

class AddCommentDumb extends PureComponent<Props, State> {
    state = {
        body: ''
    }

    render() {
        const { body } = this.state;

        return (
            <View style={styles.addComment}>
                <TextInput
                    style={styles.addCommentInput}
                    keyboardAppearance="dark"
                    numberOfLines={4}
                    onChangeText={this.handleChangeText}
                    onFocus={Platform.OS === 'ios' ? keyboardManagement.enableKeyboardAvoiding : undefined}
                    placeholder="Leave a comment"
                    placeholderTextColor="#858D90"
                    returnKeyType={Platform.OS === 'android' ? 'none' : undefined}
                    selectionColor="#5677FC"
                    underlineColorAndroid="transparent"
                    value={body}
                    disableFullscreenUI
                    multiline
                />
                <ButtonFlat label="POST" onPress={this.addComment} />
            </View>
        )
    }

    handleChangeText = body => this.setState(() => ({ body }))

    addComment = () => {
        const { dispatch, forename, name, id } = this.props;
        const { body } = this.state;

        if (!body.trim()) {
            Alert.alert('Message Required', 'You cannot post a blank message.', [{ text:'OK' }]);
            return;
        }

        const hasForename = !!forename;
        if (!hasForename) {
            alertDisplayname(dispatch, 'To be able to post a comment, you need to first set a "display name" from the settings page.');
            return;
        }

        dispatch(addComment(name, body.trim(), forename, id));
        this.setState(() => ({ body:'' }));
    }
}

const AddCommentSmart = connect(
    function({ account:{ forename } }: AppShape) {
        return {
            forename
        }
    }
)

const AddComment = AddCommentSmart(AddCommentDumb)

export default AddComment
