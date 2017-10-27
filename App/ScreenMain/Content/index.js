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
    render() {
        const { screen, cards } = this.props;

        const cardWidth = screen.width - CARD_MARGIN - CARD_MARGIN;

        return (
            <View style={styles.content}>
                <ScrollView style={styles.scroller} contentContainerStyle={styles.contentContainer} horizontal pagingEnabled onLayout={this.handleLayoutScroller}>
                    { cards.map( card => renderCard(card, cardWidth) ) }
                </ScrollView>
                <Fabs />
            </View>
        )
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
