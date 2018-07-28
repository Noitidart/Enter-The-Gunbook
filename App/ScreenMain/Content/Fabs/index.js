import React, { PureComponent } from 'react'
import { Keyboard, Platform, TouchableOpacity, View } from 'react-native'
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

type State = {
    shouldHideFabs: boolean
}

class Fabs extends PureComponent<Props, State> {
    state = {
        shouldHideFabs: false
    }

    componentDidMount() {
        Keyboard.addListener('keyboardDidShow', this.hideFabs);
        Keyboard.addListener('keyboardDidHide', this.showFabs);
    }
    componentWillUnmount() {
        Keyboard.removeListener('keyboardDidShow', this.hideFabs);
        Keyboard.removeListener('keyboardDidHide', this.showFabs);
    }
    render() {
        const { shouldHideFabs } = this.state;
        return shouldHideFabs ? null : (
            <View style={styles.wrap} pointerEvents="box-none">
                <TouchableOpacity activeOpacity={ACTIVE_OPACITY} style={styles.settings} onPress={this.addAccountCard}>
                    <View style={styles.backingSmall}>
                        <Icon name="settings" style={styles.labelSmall} />
                    </View>
                </TouchableOpacity>
                <SortFab />
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
        const { findCardIndex, dispatch, scrollToCard, getCurrentCardIndex } = this.props;
        const ixCard = findCardIndex(card => card.kind === CARDS.ACCOUNT)
        if (ixCard > -1) scrollToCard(ixCard);
        else dispatch(addCard({ kind:CARDS.ACCOUNT }, getCurrentCardIndex()+1));
    }
    addEntityCard = () => {
        // return this.props.removeCurrentCard(); // DEBUG:
        const { findCardIndex, getCurrentCardIndex, dispatch, scrollToCard } = this.props;
        dispatch(addCard({ kind:CARDS.ENTITY }, getCurrentCardIndex()+1)); // for now just always add a card
        // const ixCard = findCardIndex(card => card.kind === CARDS.ENTITY && card.entityId === undefined)
        // if (ixCard > -1) scrollToCard(ixCard);
        // else dispatch(addCard({ kind:CARDS.ENTITY }, getCurrentCardIndex()+1));
    }
    updateToSearch = () => {
        const { getCurrentCardIndex, dispatch } = this.props;
        const currentCardIndex = getCurrentCardIndex();
        const currentCardId = store.getState().cards[currentCardIndex].id;
        dispatch(updateCard(currentCardId, { kind:CARDS.ENTITY, entityId:undefined }));
    }
    addCounterCard = () => this.props.dispatch(addCard({ kind:CARDS.COUNTER }, this.props.getCurrentCardIndex()+1));

    hideFabs = () => this.setState(() => ({ shouldHideFabs:true }))
    showFabs = () => this.setState(() => ({ shouldHideFabs:false }))
}

export default Fabs
