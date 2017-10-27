import React, { PureComponent } from 'react'
import { Image } from 'react-native'

type Props = {
    screen: { width:number, height:number },
    sourceWidth: number, // pixels
    sourceHeight: number, // pixels
    width?: number, // percent 0.01-1 // desired percent of screen width
    height?: number, // percent 0.01-1 // desired percent of screen height
    source: string
}

class ScaledImage extends PureComponent<Props> {
    render() {
        const { screen, width, height, sourceWidth, sourceHeight, source } = this.props;

        const factor = width ? (screen.width * width) / sourceWidth
                             : (screen.height * height) / sourceHeight;

        const style = {
            width: sourceWidth * factor,
            height: sourceHeight * factor
        };

        return <Image source={source} style={style} />
    }
}

export default ScaledImage
