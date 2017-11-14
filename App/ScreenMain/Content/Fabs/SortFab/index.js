import React, { PureComponent } from 'react'
import { Text, View, Alert, Platform, Picker, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import { unCamelCase } from '../../../../flow-control/account/utils'
import { sortCards } from '../../../../flow-control/cards'
import { getCardEntitys, groupSortables } from '../../../../flow-control/cards/utils'

import Icon from '../../../../Icon'

import styles from '../styles'
import stylesThis from './styles'

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

        let onPress, Wrapper;
        if (options) {
            if (Platform.OS !== 'android') {
                Wrapper = View;
                onPress = this.handlePress;
            } else {
                // android
                Wrapper = View;
            }
        } else {
            Wrapper = TouchableOpacity;
            onPress = this.handleCannotPress;
        }
        return (
            <Wrapper style={styles.sort} onPress={onPress}>
                <View style={styles.backingSmall} >
                    <Icon name="sort" style={styles.labelSmall} />
                    { options && Platform.OS === 'android' &&
                        <Picker prompt={PROMPT_TITLE} selectedValue="cancel" onValueChange={this.handlePicked} style={stylesThis.picker}>
                            { options.map( option => <Picker.Item label={option.label} value={option.value} key={option.value} /> )}
                        </Picker>
                    }
                </View>
            </Wrapper>
        )
    }

    handlePress = () => {
        const { options } = this.state;
        Alert.alert(PROMPT_TITLE, undefined,
            options.map( option => ({ text:option.label, onPress:()=>this.handlePicked(option.value), style:(option.value === 'cancel' ? 'cancel' : undefined) }) )
        );
    }

    handleCannotPress = () => Alert.alert('Nothing to Sort', 'You currently have no items that can be sorted. Items are sortable if they have any numeric properties.', [{ text:'OK', style:'cancel' }]);

    handlePicked = byKey => this.props.dispatch(sortCards(byKey))

    recalcOptions = () => {
        const { numericKeys, cards, cardEntitys } = this.props;

        const options = [];

        for (const key in numericKeys) {
            const { sortableCards } = groupSortables(cards, cardEntitys, key);
            if (sortableCards.length) {
                options.push({ label:unCamelCase(key), value:key });
            }
        }

        if (!options.length) {
            this.setState(() => ({ options:null }))
        } else {
            options.sort(SortFab.sortAscLabel);
            options.push({ label:'Cancel', value:'cancel' }); // NOTE: on android, because selectedValue of <Picker> defaults to first value, so if that value is pressed nothing happens, so i put in cancel
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
