// @flow

import React from 'react'
import { Animated, View, } from 'react-native'
import { PanGestureHandler, FlingGestureHandler, Directions, State  } from 'react-native-gesture-handler'

import CardAccount from '../CardAccount'
import CardCounter from '../CardCounter'
import CardEntity from '../CardEntity'

import { CARDS } from '../../../flow-control/cards'

import styles, { CARD_MARGIN } from './styles'

type Props = {|
    card: {},
    hasMultipleCards: boolean,
    removeCurrentCard: () => void,
|}

class CardWrap extends React.Component<Props> {

    translateY = new Animated.Value(0);

    handleStateChange = ({ nativeEvent }) => {
        const { screen } = this.props;
        if (nativeEvent.state === State.END) {
            if (Math.abs(nativeEvent.velocityY) < 4000) {
                Animated.spring(this.translateY, {
                    toValue: 0,
                    useNativeDriver: true
                }).start();
            } else {
                Animated.timing(
                    this.translateY,
                    {
                        toValue: nativeEvent.velocityY < 0 ? -screen.height : screen.height,
                        duration: 100,
                        useNativeDriver: true
                    }
                ).start(() => {
                    this.props.removeCurrentCard();
                });
            }
        }
    };

    handleGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: this.translateY } }],
        { useNativeDriver: true }
    );

    matchListRef = React.createRef();

    render() {
        const { card, screen, hasMultipleCards } = this.props;
        const width = screen.width - CARD_MARGIN - CARD_MARGIN;
        const { translateY, matchListRef } = this;

        let CardContent;
        switch (card.kind) {
            case CARDS.ENTITY: CardContent = CardEntity; break;
            case CARDS.COUNTER: CardContent = CardCounter; break;
            case CARDS.ACCOUNT: CardContent = CardAccount; break;
            // no default
        }

        return (
            <PanGestureHandler
                onHandlerStateChange={this.handleStateChange}
                onGestureEvent={this.handleGestureEvent}
                enabled={hasMultipleCards}
                waitFor={matchListRef}
            >
                <Animated.View
                    style={[
                        styles.card,
                        { width },
                        {
                            transform: [
                                { translateY }
                            ]
                        }
                    ]}
                >
                    <CardContent {...card} matchListRef={matchListRef} />
                </Animated.View>
            </PanGestureHandler>
        )
    }
}


export default CardWrap
