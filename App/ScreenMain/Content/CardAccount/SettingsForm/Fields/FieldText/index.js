// @flow

import React, { PureComponent } from 'react'
import { ActivityIndicator, Text, TextInput, View } from 'react-native'

import styles from '../../styles'
import stylesThis from './styles'

import type { FieldProps } from 'redux-form'

type Props = {
    label: string,
    desc?: string | Element,
    isChecking: boolean,
    isTaken: boolean,
    ...FieldProps // below are the FieldProps i actually touch
}

class FieldText extends PureComponent<Props, void> {
    render() {
        const {meta:{ error, warning }, input, input:{ value, onChange }, label, isChecking, isTaken } = this.props;

        return (
            <View style={styles.setting}>
                <View style={styles.settingRow}>
                    <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>
                            {label}
                        </Text>
                    </View>
                    <View style={styles.settingRight}>
                        { isChecking && <ActivityIndicator color="#FFFFFF" size="small" /> }
                        <TextInput style={stylesThis.input} keyboardAppearance="dark" onChangeText={onChange} selectionColor="#5677FC" underlineColorAndroid="transparent" value={value} disableFullscreenUI />
                    </View>
                </View>
                {/* { !error && desc && <Text style={styles.settingDesc}>{desc}</Text> }
                { error && <Text style={styles.error}>{error}</Text> }
                { warning && <Text style={styles.warning}>{warning}</Text> } */}
                { isTaken && <Text style={stylesThis.taken}>This display name already exists. If you are sure this is yours, then ignore this warning, otherwise please change it.</Text> }
            </View>
        )
    }
}

export default FieldText
