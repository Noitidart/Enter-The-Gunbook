// @flow

import React, { PureComponent } from 'react'
import { Button, Text, View } from 'react-native'
import { connect } from 'react-redux'

import { up, dn, upAsync } from '../flow-control/counter'

import type { Shape as CounterShape } from '../flow-control/counter'
import type { Shape as AppShape } from '../flow-control'

type Props = {
    counter: CounterShape,
    dispatch: Dispatch
}

class CounterDumb extends PureComponent<Props> {
    render() {
        const { counter } = this.props;

        return (
            <View>
                <Text>
                    Count: {counter}
                </Text>
                <Button onPress={this.handleUp} title="Up" />
                <Button onPress={this.handleDn} title="Down" />
                <Button onPress={this.handleUpAsync} title="Up Async x5" />
            </View>
        )
    }

    handleUp = () => this.props.dispatch(up())
    handleUpAsync = () => this.props.dispatch(upAsync(5))
    handleDn = () => this.props.dispatch(dn())
}

const CounterSmart = connect(
    function(state: AppShape) {
        return {
            counter: state.counter
        }
    }
)

const Counter = CounterSmart(CounterDumb)

export default Counter
