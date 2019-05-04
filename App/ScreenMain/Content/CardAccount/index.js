import React, { PureComponent } from 'react'
import { Linking, ScrollView, Text, TouchableHighlight, View } from 'react-native'

import ButtonFlat from '../CardEntity/Entity/ButtonFlat'
import SettingsForm from './SettingsForm'
import Icon from '../../../Icon'

import styles from './styles'

type Props = {

}

class CardAccount extends PureComponent<Props> {
    render() {
        return (
            <View style={styles.main}>
                <View style={styles.header}>
                    <Icon style={styles.headerIcon} name="settings" />
                    <Text style={styles.headerLabel}>Settings</Text>
                </View>
                <ScrollView>
                    <SettingsForm />
                    <View style={styles.titleRow} onLayout={this.handleLayoutComments}>
                        <Icon style={styles.titleIcon} name="attach_money" />
                        <Text style={styles.title}>Support</Text>
                    </View>
                    <View style={styles.para}>
                        <Text style={styles.paraBody}>
                            Please support the development and server costs:
                            {'\n'} - Montly server costs for the comment/vote feature.
                            {'\n'} - Yearly Apple fee for listing in the store.
                            {'\n'} - Google Play one-time registration cost.
                            {'\n'} - IBM Watson for optional voice recognition feature.
                        </Text>
                        <View style={styles.rowButton}>
                            <ButtonFlat label="CONTRIBUTE WITH PAYPAL" onPress={this.gotoPaypal} />
                        </View>
                        {/* <View style={styles.paraHr} /> */}
                    </View>
                </ScrollView>
            </View>
        )
    }

    gotoPaypal = () => Linking.openURL('https://www.paypal.me/Noitidart')
}

export default CardAccount
