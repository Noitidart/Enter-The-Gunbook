import React, { PureComponent } from 'react'
import { TouchableOpacity, View, Platform } from 'react-native'
import { connect } from 'react-redux'

import { addCard, focusOrAddCard, CARDS } from '../../../flow-control/cards'

import SortFab from './SortFab'
import Icon from '../../../Icon'

import styles from './styles'

const ACTIVE_OPACITY = 0.7;

import type { Shape as CardsShape } from '../../../flow-control/cards'

type Props = {
    dispatch: Dispatch,
    getScroller: () => null | *, // returns ref or null
    scrollToCard: number => void,
    cards: CardsShape
}

class FabsDumb extends PureComponent<Props> {
    render() {
        return (
            <View style={styles.wrap}>
                <TouchableOpacity activeOpacity={ACTIVE_OPACITY} style={styles.settings} onPress={this.addAccountCard}>
                    <View style={styles.backingSmall}>
                        <Icon name="attach_money" style={styles.labelSmall} />
                    </View>
                </TouchableOpacity>
                <SortFab activeOpacity={ACTIVE_OPACITY} />
                <View style={styles.row}>
                    <TouchableOpacity activeOpacity={ACTIVE_OPACITY} style={styles.searchNew} onPress={this.addEntityCard}>
                        <View style={styles.backingSmall}>
                            <Icon name="search" style={styles.labelSmall} />
                            <View style={styles.labelSubWrap}>
                                <Icon name="add" style={styles.labelSub} />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={ACTIVE_OPACITY} style={styles.search}>
                        <View style={styles.backingBig}>
                            <Icon name="search" style={styles.labelBig} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    addAccountCard = () => {
        const { cards, dispatch, getScroller, scrollToCard } = this.props;
        const ixAccountCard = cards.findIndex(card => card.kind === CARDS.ACCOUNT)
        if (ixAccountCard > -1) scrollToCard(ixAccountCard);
        else dispatch(addCard({ kind:CARDS.ACCOUNT }));
    }
    addEntityCard = () => {
        const { cards, dispatch, getScroller, scrollToCard } = this.props;
        const ixEmptyEntityCard = cards.findIndex(card => card.kind === CARDS.ENTITY && card.entityId === undefined)
        if (ixEmptyEntityCard > -1) scrollToCard(ixEmptyEntityCard);
        else dispatch(addCard({ kind:CARDS.ENTITY }));
    }
}

const FabsConnected = connect();

const Fabs = FabsConnected(FabsDumb)

export default Fabs
