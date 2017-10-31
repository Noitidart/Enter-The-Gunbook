import React, { PureComponent } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'

import { updateCard } from '../../../../../flow-control/cards'

import styles from './styles'

import type { Entity } from '../../../flow-control/entitys/types'
import type { Card } from '../../../flow-control/cards'
import type { Shape as AppShape } from '../../../flow-control'
import type { Match } from '../'

type OwnProps = {
    ...Match,
    cardId: $PropertType<Card, 'id'>
}

type Props = {
    ...OwnProps,
    dispatch: Dispatch,
    entity: Entity
}

class SearchLinkDumb extends PureComponent<Props> {
    render() {
        const { entityId } = this.props;

        return <Text style={styles.link} onPress={this.setCardEntity}>{entityId}</Text>
    }

    setCardEntity = () => {
        const { dispatch, cardId, entityId } = this.props;
        dispatch(updateCard(cardId, { entityId }));
    }
}

const SearchLinkSmart = connect(
    function({ entitys }: AppShape, { entityId, kind }: OwnProps) {
        return {
            entity: entitys[kind][entityId]
        }
    }
)

const SearchLink = SearchLinkSmart(SearchLinkDumb)

export default SearchLink
