import React, { PureComponent } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import shallowEqual from 'recompose/shallowEqual'

import { CARDS, removeCard, updateCard } from '../../flow-control/cards'

import CardAccount from './CardAccount'
import CardCounter from './CardCounter'
import CardEntity from './CardEntity'
import Fabs from './Fabs'

import styles, { CARD_MARGIN } from './styles'

import type { Shape as AppShape } from '../../flow-control'
import type { Shape as CardsShape } from '../../flow-control/cards'

type OwnProps = {
    screen: { width:number, height:number }
}

type Props = {
    ...OwnProps,
    // redux
    dispatch: Dispatch,
    cards: CardsShape
}

const renderCard = (card, width) => {
    let CardContent;
    switch (card.kind) {
        case CARDS.ENTITY: CardContent = CardEntity; break;
        case CARDS.COUNTER: CardContent = CardCounter; break;
        case CARDS.ACCOUNT: CardContent = CardAccount; break;
        // no default
    }
    return (
        <View style={[styles.card, { width }]} key={card.id}>
            <CardContent {...card} />
        </View>
    )
}

class ContentDumb extends PureComponent<Props> {
    scroller: null | *
    currentCardIndex: number = 0

    componentDidUpdate(propsOld) {
        const { cards } = this.props;
        const { cards:cardsOld } = propsOld;

        if (cards !== cardsOld) {
            // figure out if a card was removed or added
            const isAdd = cards.length > cardsOld.length;
            const isRemove = cards.length < cardsOld.length;
            console.log('isAdd:', isAdd, 'isRemove:', isRemove);
            if (isAdd) {
                const idsOld = cardsOld.map(card => card.id);
                const ids = cards.map(card => card.id);
                const addedIndex = ids.findIndex(id => !idsOld.includes(id));
                setTimeout(()=>this.scrollToCard(addedIndex), 0); // if i dont setTimeout it doesnt scroll
            } else if (isRemove) {
                const idsOld = cardsOld.map(card => card.id);
                const ids = cards.map(card => card.id);
                const removedIndex = idsOld.findIndex(idOld => !ids.includes(idOld));
                this.scrollToCard(removedIndex === 0 ? 0 : removedIndex - 1);
            } else { // else it was sorted maybe OR a card was updated (like entityId changed)
                let isSort;
                for (let i=0; i<cards.length; i++) {
                    const card = cards[i];
                    const cardOld = cardsOld[i];
                    if (card.id !== cardOld.id) {
                        isSort = true;
                        break;
                    } else {
                        if (!shallowEqual(card, cardOld)) {
                            // its a card update
                            isSort = false;
                            break;
                        }
                    }
                }
                if (isSort === undefined) isSort = true; // no card was updated, the sorter, sorted things to be in same order (we know this as reference changed but everything is in place)
                console.log('isSort:', isSort);
                if (isSort) {
                    this.scroller.scrollTo({ x:0 });
                    this.currentCardIndex = 0;
                }
            }

        }
    }
    render() {
        const { screen, cards, dispatch } = this.props;

        const cardWidth = this.props.screen.width - CARD_MARGIN - CARD_MARGIN;

        return (
            <View style={styles.content}>
                <ScrollView style={styles.scroller} contentContainerStyle={styles.contentContainer} horizontal pagingEnabled ref={this.refScroller} onScroll={this.handleScroll} scrollEventThrottle={16} onLayout={this.handleLayout} onMomentumScrollEnd={this.handleScrollEnd}>
                    { cards.map( card => renderCard(card, cardWidth) ) }
                </ScrollView>
                <Fabs dispatch={dispatch} findCardIndex={this.findCardIndex} scrollToCard={this.scrollToCard} getCurrentCardIndex={this.getCurrentCardIndex} removeCurrentCard={this.removeCurrentCard} />
            </View>
        )
    }

    refScroller = el => this.scroller = el

    handleScrollEnd = ({nativeEvent:{contentOffset:{ x:scrollX },layoutMeasurement:{ width:cardWidthWithMargins }}}: ScrollEvent) => {
        this.currentCardIndex = Math.round(scrollX / cardWidthWithMargins);
        // console.log('scroll end hapend, this.currentCardIndex is now:', this.currentCardIndex);
    }
    handleLayout = () => this.scrollToCard(this.currentCardIndex);
    scrollToCard = (index: number) => {
        // console.log('in scorllToCard, index:', index, 'cards.length:', this.props.cards.length);
        if (index > -1 && index < this.props.cards.length) {
            // console.log('ok scrolling, x:', this.props.screen.width*index);
            this.currentCardIndex = index; // need this as am setting this.currentCardIndex onMomentumScrollEnd now instead of onScroll
            if (this.scroller) this.scroller.scrollTo({ x:this.props.screen.width*index });
        }
    }
    getCurrentCardIndex = () => this.currentCardIndex
    findCardIndex = predicate => this.props.cards.findIndex(predicate)
    removeCurrentCard = () => {
        const { dispatch, cards } = this.props;
        const card = cards[this.currentCardIndex];
        console.log('current card:', card);
        if (cards.length === 1) {
            if (card.kind !== CARDS.ENTITY || card.entityId !== undefined) {
                dispatch(updateCard(card.id, { kind:CARDS.ENTITY, entityId:undefined }));
            } // else do nothing as i always want one card in the stack. and the least card it shoudl be is a no-entity entity card
        } else {
            dispatch(removeCard(card.id));
        }
    }
}

const ContentConnected = connect(
    function({ cards }: AppShape) {
        return {
            cards
        }
    }
)

const Content = ContentConnected(ContentDumb)

export default Content
