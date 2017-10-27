import React, { PureComponent } from 'react'
import { TouchableOpacity, View, Platform } from 'react-native'
import { connect } from 'react-redux'

import { addCard, focusOrAddCard, CARDS } from '../../../flow-control/cards'

import SortFab from './SortFab'
import Icon from '../../../Icon'

import styles from './styles'

const ACTIVE_OPACITY = 0.7;

type Props = {
    dispatch: Dispatch
}

class FabsDumb extends PureComponent<Props> {
    render() {
        return (
            <View style={styles.wrap}>
                <TouchableOpacity activeOpacity={ACTIVE_OPACITY} style={styles.settings} onPress={this.focusOrAddAccount}>
                    <View style={styles.backingSmall}>
                        <Icon name="attach_money" style={styles.labelSmall} />
                    </View>
                </TouchableOpacity>
                <SortFab activeOpacity={ACTIVE_OPACITY} />
                <View style={styles.row}>
                    <TouchableOpacity activeOpacity={ACTIVE_OPACITY} style={styles.searchNew} onPress={this.addEntity}>
                        <View style={styles.backingSmall}>
                            <Icon name="search" style={styles.labelSmall} />
                            <View style={styles.labelSubWrap}>
                                <Icon name="add" style={styles.labelSub} />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={ACTIVE_OPACITY} style={styles.search}>
                        <View style={styles.backingBig}>
                            <Icon name="search" style={styles.labelBig} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    focusOrAddAccount = () => this.props.dispatch(focusOrAddCard({ kind:CARDS.ACCOUNT }))
    addEntity = () => this.props.dispatch(addCard({ kind:CARDS.ENTITY }))
}

const FabsConnected = connect();

const Fabs = FabsConnected(FabsDumb)

export default Fabs
