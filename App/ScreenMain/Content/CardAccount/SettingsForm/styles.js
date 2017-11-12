// @flow

import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    settings: undefined,

    setting: {
        paddingVertical: 10,
        paddingHorizontal: 18,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    settingLeft: {
        // alignItems: 'flex-start',
    },
    settingRight: {
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    settingLabel: {
        color: '#FFFFFF',
        fontSize: 16
    },
    settingDesc: {
        color: '#D3DDE4',
        fontSize: 13,
        paddingHorizontal: 18
    }
})

export default styles
