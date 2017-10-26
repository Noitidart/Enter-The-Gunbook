// @flow

import { StyleSheet } from 'react-native'

const APP_BACKGROUND = '#F6F8FB';

const app = {
    flex: 1
}
const styles = StyleSheet.create({
    app,
    appOpaque: {
        ...app,
        backgroundColor: APP_BACKGROUND // to hide splash in background - not working when keyboard view pushes it away though
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    }
})

export { APP_BACKGROUND }
export default styles
