import React from 'react'
import { TouchableHighlight, View } from 'react-native'

import Text from '../Text'

import styles from './style.css'

const Button = ({children, style, ...rest}) => {
    // style - is style for the TouchableHighlight

    let children_render;
    if (typeof children === 'string') {
        children_render = <Text style={styles.text}>{children}</Text>;
    } else {
        children_render = children;
    }
    return (
        <TouchableHighlight style={[styles.button, style]} activeOpacity={0.7} underlayColor="#B06A80" {...rest}>
            <View>
                {children_render}
            </View>
        </TouchableHighlight>
    )
}

export default Button