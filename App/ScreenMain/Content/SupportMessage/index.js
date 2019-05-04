import React from 'react'
import { Linking, View, Text, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import ButtonFlat from '../CardEntity/Entity/ButtonFlat'

import styles from './styles'
import { updateAccount } from '../../../flow-control/account'

type Props = {|
    supportMessageShownAt: number
|}

class SupportMessageBase extends React.Component {

    openPaypal = () => {
        Linking.openURL('https://www.paypal.me/Noitidart');
        this.dismiss();
    }

    dismiss = () => {
        this.props.dispatch(updateAccount({
            supportMessageShownAt: Date.now()
        }));
    }

    render() {
        const { supportMessageShownAt } = this.props;

        // every 30 days
        const shouldShow = Date.now() - this.props.supportMessageShownAt > 30 * 24 * 60 * 60 * 1000;

        if (!shouldShow) return null;
        else return (
            <View style={styles.view}>
                <Text style={styles.text}>Please support the monthly costs.</Text>


                <View style={styles.links}>
                    <TouchableHighlight style={styles.cancelButton} onPress={this.dismiss}>
                        <Text style={styles.cancelLabel}>No, not now</Text>
                    </TouchableHighlight>
                    <ButtonFlat onPress={this.openPaypal} label="Donate with Paypal" />
                </View>
            </View>
        );
    }
}

const SupportMessageConnect = connect(state => ({
    supportMessageShownAt: state.account.supportMessageShownAt || 0
}));

const SupportMessage = SupportMessageConnect(SupportMessageBase);

export default SupportMessage
