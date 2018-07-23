// @flow

import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding: 20
    },
    subWrap: {
        margin: 10,
        // alignItems: 'center',
        flex: 1
    },
    sub: {
        color: '#FFFFFF',
        fontSize: 12,
        textAlign: 'center'
    },
    noMatches: {
        color: '#FFFFFF',
        fontSize: 17,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    link: {
      fontSize: 16,
      color: '#5677FC',
      textAlign: 'center',
      fontWeight: 'bold',
      paddingVertical: 5,
      paddingHorizontal: 20
    },
    input: {
        width: 200,
        color: '#FFFFFF',
        backgroundColor: '#2F2B31',
        borderRadius: 5,
        fontSize: 17,
        paddingTop: 8,
        paddingBottom: 10,
        paddingHorizontal: 10,
        alignSelf: 'center'
    }
})

export default styles
