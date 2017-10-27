import React, { PureComponent } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

import Counter from '../../Counter'
import Fabs from './Fabs'
import Icon from '../../Icon'

import styles, { CARD_MARGIN } from './styles'

type Props = {
    screen: { width:number, height:number }
}

class Content extends PureComponent<Props> {
    render() {
        const { screen } = this.props;

        const cardWidth = screen.width - CARD_MARGIN - CARD_MARGIN;

        return (
            <View style={styles.content}>
                <ScrollView style={styles.scroller} contentContainerStyle={styles.contentContainer} horizontal pagingEnabled onLayout={this.handleLayoutScroller}>
                    <View style={[styles.card, { width:cardWidth }]}>
                        <Text style={styles.welcome}>
                            Welcome to React Native!
                        </Text>
                        <Text style={styles.instructions}>
                            To get started, edit App.js
                        </Text>
                        <Text style={styles.instructions}>
                            Double tap R on your keyboard to reload,\nShake or press menu button for dev menu
                        </Text>
                        <Counter />
                    </View>
                    <View style={[styles.card, { width:cardWidth }]}>
                        <Text style={styles.text}>hi</Text>
                    </View>
                    <View style={[styles.card, { width:cardWidth }]}>
                        <Text style={styles.text}>hi</Text>
                        <Icon name="speaker" style={styles.text} />
                    </View>
                </ScrollView>
                <Fabs />
            </View>
        )
    }
}

export default Content
