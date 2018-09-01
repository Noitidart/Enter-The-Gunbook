import React, { PureComponent } from 'react'
import { Text, View, Alert, Platform, TouchableOpacity } from 'react-native'
import DialogAndroid from 'react-native-dialogs'
import { connect } from 'react-redux'
import { words } from 'lodash'

import { sortCards } from '../../../../flow-control/cards'
import { getCardEntitys, groupSortables } from '../../../../flow-control/cards/utils'

import Icon from '../../../../Icon'

import styles from '../styles'

import type { Shape as AppShape } from '../../../../flow-control'
import type { Shape as AccountShape } from '../../../../flow-control/account'
import type { Shape as CardsShape } from '../../../../flow-control/cards'
import type { Shape as EntitysShape } from '../../../../flow-control/entitys'

const PROMPT_TITLE = 'Sort your items by:';

type Props = {
    // redux
    dispatch: Dispatch,
    numericKeys: $PropertyType<AccountShape, 'numericKeys'>,
    cards: CardsShape,
    cardEntitys: Entity[]
}

type State = {
    options: null | { label:string, value:string }[]
}

class SortFabDumb extends PureComponent<Props, State> {
    state = {
        options: null
    }
    componentDidUpdate(propsOld) {
        const { numericKeys, cards } = this.props;
        const { numericKeys:numericKeysOld, cards:cardsOld } = propsOld;

        if (numericKeys !== numericKeysOld || cards !== cardsOld) this.recalcOptions();
    }
    componentDidMount() {
        this.recalcOptions();
    }
    render() {
        const { options } = this.state;

        return (
            <TouchableOpacity style={[styles.sort, styles.backingSmall]} onPress={this.handlePress} activeOpacity={0.7}>
                <Icon name="sort" style={styles.labelSmall} />
            </TouchableOpacity>
        )
    }

    handlePress = async () => {
        const { options } = this.state;

        if (!options) return this.handleCannotPress();

        if (Platform.OS === 'ios') {
            Alert.alert(PROMPT_TITLE, undefined,
                options.map( option => ({ text:option.label, onPress:()=>this.handlePicked(option.value), style:(option.value === 'cancel' ? 'cancel' : undefined) }) )
            );
        } else {
            const { selectedItem } = await DialogAndroid.showPicker(PROMPT_TITLE, null, {
                items: options.slice(0, options.length-1), // no cancel button
                idKey: 'value',
                positiveText: null,
                negativeText: 'Cancel'
            });
            if (selectedItem) this.handlePicked(selectedItem.value);
        }
    }

    handleCannotPress = () => Alert.alert('Nothing to Sort', 'You currently have no items that can be sorted. Items are sortable if they have any numeric properties.', [{ text:'OK', style:'cancel' }]);

    handlePicked = byKey => this.props.dispatch(sortCards(byKey))

    recalcOptions = () => {
        const { numericKeys, cards, cardEntitys } = this.props;

        const options = [];

        for (const key in numericKeys) {
            const { sortableCards } = groupSortables(cards, cardEntitys, key);
            if (sortableCards.length) {
                options.push({ label:words(key), value:key });
            }
        }

        if (!options.length) {
            this.setState(() => ({ options:null }))
        } else {
            options.sort(SortFab.sortAscLabel);
            options.push({ label:'Cancel', value:'cancel' });
            this.setState(() => ({ options }));
        }
    }

    static sortAscLabel({ label:labelA }, { label:labelB }) {
        return labelA.localeCompare(labelB);
    }

}

const SortFabSmart = connect(
    function({ account:{ numericKeys }, cards, entitys:entities }: AppShape) {
        return {
            numericKeys,
            cards,
            cardEntitys: getCardEntitys(cards, entities)
        }
    }
)

const SortFab = SortFabSmart(SortFabDumb)

export default SortFab
