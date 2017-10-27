// @flow

import { StyleSheet } from 'react-native'

const FAB_BIG = 74;
const FAB_SMALL = 40;

const LABEL_SUB_SIZE = 9;

const backing = {
    backgroundColor: '#DE3D70',
    justifyContent: 'center',
    alignItems: 'center'
}

const label = {
    color: '#FFFFFF'
}

const styles = StyleSheet.create({
    wrap: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        // backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingBottom: 20 // to accomadate bottom transform of searchNew
    },
    backingBig: {
        ...backing,
        width: FAB_BIG,
        height: FAB_BIG,
        borderRadius: FAB_BIG / 2,
    },
    labelBig: {
        ...label,
        fontSize: 40
    },
    backingSmall: {
        ...backing,
        width: FAB_SMALL,
        height: FAB_SMALL,
        borderRadius: FAB_SMALL / 2,
    },
    labelSmall: {
        ...label,
        fontSize: 19
    },
    labelSub: {
        ...label,
        fontSize: LABEL_SUB_SIZE
    },
    labelSubWrap: {
        position: 'absolute',
        transform: [
            { translateX: -LABEL_SUB_SIZE/2 },
            { translateY: LABEL_SUB_SIZE/1.2 },
        ]
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    search: {
        transform: [
            { translateX: -3*5 },
        ]
    },
    searchNew: {
        transform: [
            { translateX: -10 + (-3*5) }, // + searchTransX
            { translateY: FAB_BIG / 2.5 }
        ]
    },
    settings: {
        transform: [
            { translateX: -3 },
            { translateY: -10*2 } // extra -10 due to sort
        ]
    },
    sort: {
        transform: [
            { translateX: -3*4 },
            { translateY: -10 }
        ]
    }
})

export default styles
