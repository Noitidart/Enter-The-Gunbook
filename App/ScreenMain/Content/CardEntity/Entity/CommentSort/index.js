import React, { PureComponent } from 'react'
import { Text, View, Alert, Platform, Picker, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import { updateAccount } from '../../../../../flow-control/account'

import Icon from '../../../../../Icon'

import styles from '../styles'
import stylesThis from './styles'

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

        const Wrapper = Platform.OS !== 'android' ? TouchableOpacity : View;

        return (
            <Wrapper onPress={Platform.OS !== 'android' ? this.handlePress : undefined}>
                {/* <View style={styles.titleRightIconWrap}> */}
                    <Icon style={styles.titleRightIcon} name="sort" />
                    {/* <Text style={styles.titleRightIconLabel}>{sortCommentsBy}</Text> */}
                    { Platform.OS === 'android' &&
                        <Picker prompt={PROMPT_TITLE} selectedValue="cancel" onValueChange={this.handlePicked} style={stylesThis.picker}>
                            { OPTIONS.map( option => <Picker.Item label={option.label} value={option.value} key={option.value} /> )}
                        </Picker>
                    }
                {/* </View> */}
            </Wrapper>
        )
    }

    handlePress = () => {
        Alert.alert( PROMPT_TITLE, undefined,
            OPTIONS.map( option => ({ text:option.label, onPress:()=>this.handlePicked(option.value), style:(option.value === 'cancel' ? 'cancel' : undefined) }) )
        );
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
