import React, { PureComponent } from 'react'
import { Image } from 'react-native'

type Props = {
    screen: { width:number, height:number },
    sourceWidth: number, // pixels
    sourceHeight: number, // pixels
    width?: number, // percent 0.01-1 // desired percent of screen width
    height?: number, // percent 0.01-1 // desired percent of screen height
    source: string,
    imageProps: {}
}

class ImageScaled extends PureComponent<Props> {
    render() {
        const { style:styleProp, screen, width, height, sourceWidth, sourceHeight, source, ...imageProps } = this.props;

        const factor = width ? (screen.width * width) / sourceWidth
                             : (screen.height * height) / sourceHeight;

        const styleSize = {
            width: sourceWidth * factor,
            height: sourceHeight * factor
        };

        const style = styleProp ? [ styleProp, styleSize ] : styleSize;

        return <Image source={source} style={style} {...imageProps} />
    }
}

export default ImageScaled
