import React, { PureComponent } from 'react'
import { Text, View, TextInput } from 'react-native'

import Search from './Search'
import Entity from './Entity'

import styles from './styles'

import type { Card } from '../../../flow-control/cards'

type Props = {
    ...Card
}

class CardEntity extends PureComponent<Props> {
    render() {
        const { entityId, id } = this.props;

        return (
            <View style={styles.container}>
                { !entityId && <Search cardId={id} /> }
                { entityId && <Entity entityId={entityId} /> }
            </View>
        )
    }
}

export default CardEntity
