import React, { PureComponent } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'

import { CARDS } from '../../flow-control/cards'

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

        }
    }
    render() {
        const { screen, cards } = this.props;

        const cardWidth = this.props.screen.width - CARD_MARGIN - CARD_MARGIN;

        return (
            <View style={styles.content}>
                <ScrollView overScrollMode="never" style={styles.scroller} contentContainerStyle={styles.contentContainer} horizontal pagingEnabled ref={this.refScroller} onScroll={this.handleScroll} scrollEventThrottle={16} onLayout={this.handleLayout} onMomentumScrollEnd={this.handleScrollEnd}>
                    { cards.map( card => renderCard(card, cardWidth) ) }
                </ScrollView>
                <Fabs getScroller={this.getScroller} cards={cards} scrollToCard={this.scrollToCard} />
            </View>
        )
    }

    refScroller = el => this.scroller = el
    getScroller = () => this.scroller

    handleScroll = ({nativeEvent:{contentOffset:{ x:scrollX },layoutMeasurement:{ width:cardWidthWithMargins }}}: ScrollEvent) => {
        /* android
        {
            contentInset: { bottom:number, left:number, right:number, top:number },
            contentOffset: { x:number, y:number },
            contentSize: { height:number, width:number },
            layoutMeasurement: { height:number, width:number },
            responderIgnoreScroll: boolean,
            target: number,
            velocity: { x:number, y:number }
        }
        */
        // this.currentCardIndex = Math.round(scrollX / cardWidthWithMargins);
        // console.log('scrolled, currentCardIndex is now:', this.currentCardIndex);
    }
    handleScrollEnd = ({nativeEvent:{contentOffset:{ x:scrollX },layoutMeasurement:{ width:cardWidthWithMargins }}}: ScrollEvent) => {
        // onMomentumScrollEnd is triggering even when overScrollMode is "never" and it doesnt move, which is perfect, because i want to know when HUMAN scroll end, as onScroll gets triggered on onLayout
        this.currentCardIndex = Math.round(scrollX / cardWidthWithMargins);
        console.log('scrolled, currentCardIndex is now:', this.currentCardIndex);
    }
    // width is same as card_width
    handleLayout = ({nativeEvent:{layout:{ width }}}: LayoutEvent) => {
        console.log('scroller layouted:', width); // same as this.props.screen.width
        // this.currentScrollerWidth = width;
        this.scrollToCard(this.currentCardIndex);
    }
    scrollToCard = (index: number) => {
        if (index <= this.props.cards.length) {
            this.currentCardIndex = index; // need this as am setting this.currentCardIndex onMomentumScrollEnd now instead of onScroll
            this.scroller.scrollTo({ x:this.props.screen.width*index })
        }
    }
    getCurrentCardIndex = () => currentCardIndex
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
