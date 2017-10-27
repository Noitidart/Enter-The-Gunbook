import React, { PureComponent } from 'react'
import { TouchableOpacity, View } from 'react-native'

import Icon from '../../../Icon'

import styles from './styles'

const ACTIVE_OPACITY = 0.7;

type Props = {

}

class Fabs extends PureComponent<Props> {
    render() {
        return (
            <View style={styles.wrap}>
                <TouchableOpacity activeOpacity={ACTIVE_OPACITY} style={styles.settings}>
                    <View style={styles.backingSmall}>
                        <Icon name="attach_money" style={styles.labelSmall} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={ACTIVE_OPACITY} style={styles.sort}>
                    <View style={styles.backingSmall}>
                        <Icon name="sort" style={styles.labelSmall} />
                    </View>
                </TouchableOpacity>
                <View style={styles.row}>
                    <TouchableOpacity activeOpacity={ACTIVE_OPACITY} style={styles.searchNew}>
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
}

export default Fabs
