import React, { PureComponent } from 'react'
import { TouchableOpacity, View, Platform } from 'react-native'
import { connect } from 'react-redux'

import store from '../../../flow-control'

import { addCard, focusOrAddCard, updateCard, CARDS } from '../../../flow-control/cards'

import SortFab from './SortFab'
import Icon from '../../../Icon'

import styles from './styles'

const ACTIVE_OPACITY = 0.7;

import type { Shape as CardsShape, Card } from '../../../flow-control/cards'

type Props = {
    dispatch: Dispatch,
    scrollToCard: number => void,
    getCurrentCardIndex: () => number,
    findCardIndex: (Card=>boolean) => number
}

class Fabs extends PureComponent<Props> {
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
                    <TouchableOpacity activeOpacity={ACTIVE_OPACITY} style={styles.search} onPress={this.updateToSearch}>
                        <View style={styles.backingBig}>
                            <Icon name="search" style={styles.labelBig} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    addAccountCard = () => {
        const { findCardIndex, dispatch, scrollToCard } = this.props;
        const ixCard = findCardIndex(card => card.kind === CARDS.ACCOUNT)
        if (ixCard > -1) scrollToCard(ixCard);
        else dispatch(addCard({ kind:CARDS.ACCOUNT }));
    }
    addEntityCard = () => {
        // return this.props.removeCurrentCard(); // DEBUG:
        const { findCardIndex, getCurrentCardIndex, dispatch, scrollToCard } = this.props;
        const ixCard = findCardIndex(card => card.kind === CARDS.ENTITY && card.entityId === undefined)
        if (ixCard > -1) scrollToCard(ixCard);
        else dispatch(addCard({ kind:CARDS.ENTITY }, getCurrentCardIndex()+1));
    }
    updateToSearch = () => {
        const { findCardIndex, getCurrentCardIndex, dispatch, scrollToCard } = this.props;
        const ixCard = findCardIndex(card => card.kind === CARDS.ENTITY && card.entityId === undefined)
        if (ixCard > -1) scrollToCard(ixCard);
        else {
            const currentCardIndex = getCurrentCardIndex();
            const currentCardId = store.getState().cards[currentCardIndex].id;
            dispatch(updateCard(currentCardId, { kind:CARDS.ENTITY, entityId:undefined }));
        }
    }
    addCounterCard = () => this.props.dispatch(addCard({ kind:CARDS.COUNTER }, this.props.getCurrentCardIndex()+1));
}

export default Fabs
