import React, { PureComponent } from 'react'
import { Text, View, TextInput } from 'react-native'

import Search from './Search'

import styles from './styles'

import type { Card } from '../../../flow-control/cards'

type Props = {
    ...Card
}

class CardEntity extends PureComponent<Props> {
    render() {
        const { entityId } = this.props;
        console.log('card props:', this.props);

        return (
            <View style={styles.container}>
                { !entityId && <Search /> }
                { entityId && <Text>{entityId}</Text> }
            </View>
        )
    }
}

export default CardEntity
