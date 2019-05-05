import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

import { fetchApi } from '../../../../../flow-control/utils'

import SearchLink from '../SearchLink'

import styles from './styles'

import type { Match } from '../'
import type { Card } from '../../../../flow-control/cards'

type Props = {|
    matchs: Match[],
    cardId: $PropertType<Card, 'id'>
|}

class MatchList extends React.PureComponent<Props> {
    render() {
        const { matchs, cardId, matchListRef } = this.props;

        return (
            <ScrollView keyboardShouldPersistTaps="handled" ref={matchListRef}>
                { matchs.map(match => <SearchLink key={match.entityId} entityId={match.entityId} cardId={cardId} />) }
            </ScrollView>
        )
    }
}

export default MatchList
