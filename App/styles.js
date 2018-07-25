// @flow

import { StyleSheet } from 'react-native'

const APP_BACKGROUND = '#F6F8FB';

const app = {
    flex: 1,
    height: '100%'
}
const styles = StyleSheet.create({
    app,
    appOpaque: {
        ...app,
        backgroundColor: APP_BACKGROUND // to hide splash in background - not working when keyboard view pushes it away though
    },

    appContent: {
        height: '100%'
    }
})

export { APP_BACKGROUND }
export default styles
