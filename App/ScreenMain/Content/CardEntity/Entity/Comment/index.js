// @flow

import React, { PureComponent } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import { pick } from 'lodash'

import Icon from '../../../../../Icon'

import { deleteComment, toggleHelpful } from '../../../../../flow-control/social'
import { alertDisplayname } from '../../../../../flow-control/social/utils'

import styles from './styles'

import type { SocialEntity, CommentId, HelpfulId } from '../../../../../flow-control/social/types'
import type { Shape as SocialShape } from '../../../../../flow-control/social'
import type { Shape as AppShape } from '../../../../../flow-control'

type OwnProps = {
    id: CommentId
}

type Props = {
    ...OwnProps,
    // redux
    dispatch: Dispatch,
    forename: string,
    isUserAuthor: boolean,
    helpfulId: HelpfulId | null,
    cntHelpfuls: number,
    isHelpful: boolean
}

class CommentDumb extends PureComponent<Props> {
    render() {
        const { isHelpful, cntHelpful, authorName, isUserAuthor, createdAt, body } = this.props;

        return (
            <View style={styles.comment}>
                <View style={styles.commentHead}>
                    <View style={styles.commentAvatar}>
                        <Text style={styles.commentAvatarLabel}>{ authorName.substr(0, 1).toUpperCase() }</Text>
                    </View>
                    <View style={styles.commentHeadText}>
                        <View style={styles.row}>
                            <Text style={styles.commentAuthor}>{authorName}</Text>
                            <Text style={styles.commentDot}> &middot; </Text>
                            <Text style={styles.commentDate}>{ moment.utc(createdAt).fromNow() }</Text>
                            <View style={styles.spacer} />
                            { isUserAuthor &&
                                <TouchableOpacity style={styles.commentDeleteWrap} onPress={this.deleteComment}>
                                    <Icon style={styles.commentDelete} name="delete" />
                                </TouchableOpacity>
                            }
                        </View>
                        <TouchableOpacity onPress={this.toggleHelpful}>
                            <Text style={styles.commentHelpful}>
                                { isHelpful && cntHelpful === 1 && 'Only you found this helpful. Do you still?' }
                                { isHelpful && cntHelpful === 2 && 'You and 1 other found this helpful. Do you still?' }
                                { isHelpful && cntHelpful > 2 && `You and ${cntHelpful-1} others found this helpful. Do you still?` }
                                { !isHelpful && cntHelpful === 1 && '1 person found this helpful. Did you too?' }
                                { !isHelpful && cntHelpful > 1 && `${cntHelpful} people found this helpful. Did you too?` }
                                { cntHelpful === 0 && 'No one found this helpful. Did you?' }
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* if they have a thumb show it here as a subicon */}
                </View>
                <Text style={styles.commentBody}>{ body }</Text>
                <View style={styles.commentHr} />
            </View>
        )
    }

    deleteComment = () => {
        const { dispatch, forename, id } = this.props;
        dispatch(deleteComment(forename, id));
    }
    toggleHelpful = () => {
        const { dispatch, forename, id, isHelpful, helpfulId } = this.props;

        const hasForename = !!forename;
        if (!hasForename) {
            alertDisplayname(dispatch, 'To be able to mark a comment as helpful, you need to first set a "display name" from the settings page.');
            return;
        }

        dispatch(toggleHelpful(id, !isHelpful, forename, helpfulId));
    }
}

const CommentSmart = connect(
    function({ social, account:{ forename} }: AppShape, { id }: OwnProps) {

        const { displaynameId, helpfulIds, createdAt, body } = social.comments[id];

        const author = social.displaynames[displaynameId];

        const hasForename = !!forename;
        const displayname = !hasForename ? false : Object.values(social.displaynames).find(displayname => displayname.forename.toLowerCase() === forename.toLowerCase());
        const hasDisplayname = !!displayname;

        const helpfuls = pick(social.helpfuls, helpfulIds);
        const helpful = !hasDisplayname ? null : Object.values(helpfuls).find(helpful => helpful.displaynameId === displayname.id);
        const isHelpful = !!helpful;
        const cntHelpful = helpfulIds.length;

        return {
            createdAt,
            body,
            forename,
            authorName: author.forename,
            isUserAuthor: hasDisplayname && displayname.id === author.id,
            isHelpful,
            helpfulId: !helpful ? null : helpful.id,
            cntHelpful
        }
    }
)

const Comment = CommentSmart(CommentDumb)

export default Comment
