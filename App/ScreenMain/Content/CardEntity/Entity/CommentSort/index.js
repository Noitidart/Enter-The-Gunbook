import React, { PureComponent } from 'react'
import { Text, View, Alert, Platform, TouchableOpacity } from 'react-native'
import DialogAndroid from 'react-native-dialogs'
import { connect } from 'react-redux'

import { updateAccount } from '../../../../../flow-control/account'

import Icon from '../../../../../Icon'

import styles from '../styles'

import type { Shape as AppShape } from '../../../../flow-control'
import type { Shape as AccountShape } from '../../../../flow-control/account'

const PROMPT_TITLE = 'Sort comments by:';

type Props = {
    // redux
    dispatch: Dispatch,
    sortCommentsBy: $PropertyType<AccountShape, 'sortCommentsBy'>
}

const OPTIONS: { label:string, value:string }[] = [
    { label:'Comment Date', value:'date' },
    { label:'Most Helpful', value:'helpful' },
    { label:'Cancel', value:'cancel' }
]

class CommentSortDumb extends PureComponent<Props> {
    render() {
        const { sortCommentsBy } = this.props;

        return (
            <TouchableOpacity onPress={this.handlePress}>
                <Icon style={styles.titleRightIcon} name="sort" />
            </TouchableOpacity>
        )
    }

    handlePress = async () => {
        const { sortCommentsBy } = this.props;

        if (Platform.OS === 'ios') {
            Alert.alert( PROMPT_TITLE, undefined,
                OPTIONS.map( option => ({ text:option.label, onPress:()=>this.handlePicked(option.value), style:(option.value === 'cancel' ? 'cancel' : undefined) }) )
            );
        } else {
            const { selectedItem } = await DialogAndroid.showPicker(PROMPT_TITLE, null, {
                items: OPTIONS.slice(0, OPTIONS.length-1), // no cancel button
                idKey: 'value',
                type: DialogAndroid.listRadio,
                selectedId: sortCommentsBy,
                positiveText: null,
                negativeText: 'Cancel'
            });
            if (selectedItem) this.handlePicked(selectedItem.value);
        }
    }

    handlePicked = sortCommentsBy => this.props.dispatch(updateAccount({ sortCommentsBy }))

}

const CommentSortSmart = connect(
    function({ account:{ sortCommentsBy } }: AppShape) {
        return {
            sortCommentsBy
        }
    }
)

const CommentSort = CommentSortSmart(CommentSortDumb)

export default CommentSort
