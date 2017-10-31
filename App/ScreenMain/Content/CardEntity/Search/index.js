import React, { PureComponent } from 'react'
import { Text, View, TextInput } from 'react-native'
import { connect } from 'react-redux'
import Fuse from 'fuse.js'

import SearchLink from './SearchLink'

import { updateCard } from '../../../../flow-control/cards'
import { ENTITYS } from '../../../../flow-control/entitys'

import styles from './styles'

import type { EntityKind } from '../../../flow-control/entitys/types'
import type { Card } from '../../../flow-control/cards'
import type { Shape as AppShape } from '../../../flow-control'
import type { Shape as EntitysShape } from '../../../flow-control/entitys'

const TEXT_INPUT_OPTIONS = {
    shouldSort: true,
    // tokenize: true,
    includeScore: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    keys: ['entityId']
}

type Match = {
    kind: EntityKind,
    entityId: string,
    score: number
}

type OwnProps = {
    cardId: $PropertType<Card, 'id'>
}

type Props = {
    ...OwnProps,
    // redux
    dispatch: Dispatch,
    entitys: EntitysShape
}

type State = {
    value: string,
    matchs: Match[]
}

class SearchDumb extends PureComponent<Props, State> {
    state = {
        value: '',
        matchs: []
    }

    render() {
        const { matchs, value } = this.state;
        const { cardId } = this.props;

        const hasValue = !!value;
        const hasMatchs = !!matchs.length;

        return (
            <View style={styles.main}>
                <TextInput style={styles.input} value={value} underlineColorAndroid="transparent" keyboardAppearance="dark" selectionColor="#5677FC" onChangeText={this.handleChangeText} onSubmitEditing={this.gotoFirstMatch} autoFocus />
                <View style={styles.subWrap}>
                    { !hasValue && <Text style={styles.sub}>(type a gun or item name)</Text> }
                    { hasValue && !hasMatchs && <Text style={styles.noMatches}>No matches found</Text> }
                    { hasValue && hasMatchs &&
                        matchs.map(match => <SearchLink key={match.entityId} {...match} cardId={cardId} />)
                    }
                </View>
            </View>
        )
    }

    gotoFirstMatch = () => {
        const {matchs:[{ entityId }={}]=[]} = this.state;
        const { dispatch, cardId } = this.props;
        if (entityId) dispatch(updateCard(cardId, { entityId }));
    }
    handleChangeText = value => {
        const { entitys } = this.props;
        this.setState(() => ({ value }));
        this.setState(({ value }) => {
            const entitysArray = [];
            for (const [kind, kindEntitys] of Object.entries(entitys)) {
                for (const [entityId, value] of Object.entries(kindEntitys)) {
                    entitysArray.push({ entityId, kind });
                }
            }
            // console.log('entitysArray:', entitysArray);
            const fuse = new Fuse(entitysArray, TEXT_INPUT_OPTIONS);
            const results = fuse.search(value);
            // console.log('results:', results);

            const matchs = results.slice(0, 10).map(result => ({
                ...result.item,
                score: result.score
            }));
            console.log('matchs:', matchs);
            return { matchs };
        })
    }
}

const SearchSmart = connect(
    function({ entitys }: AppShape) {
        return {
            entitys
        }
    }
)

const Search = SearchSmart(SearchDumb)

export type { Match }
export default Search
