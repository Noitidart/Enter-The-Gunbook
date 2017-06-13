import React, { Component } from 'react'
import { Image, Text, View, WebView } from 'react-native'

const html = `
    <html>
        <head>
            <style>
                body {
                    margin: 0;
                }
                img {
                    image-rendering: optimizeSpeed;
                    image-rendering: -moz-crisp-edges;
                    image-rendering: -o-crisp-edges;
                    image-rendering: -webkit-optimize-contrast;
                    image-rendering: optimize-contrast;
                    -ms-interpolation-mode: nearest-neighbor;
                    image-rendering: pixelated;
                }
            </style>
            <script>
                // https://github.com/facebook/react-native/issues/11594#issuecomment-304498894
                function whenRNPostMessageReady(cb) {
                    if (postMessage.length === 1) cb();
                    else setTimeout(function() { whenRNPostMessageReady(cb) }, 100);
                }

                function resizePixelated() {
                    var url = '%%%URL%%%';
                    var height = %%%HEIGHT%%%;
                    var width = %%%WIDTH%%%;

                    var img = document.createElement('img');
                    document.body.appendChild(img);
                    img.addEventListener('load', handleImageLoad, false);
                    img.addEventListener('error', handleImageError, false);
                    img.setAttribute('id', 'image');
                    if (height !== undefined) img.setAttribute('height', height);
                    if (width !== undefined) img.setAttribute('width', width);
                    img.setAttribute('src', url);
                }

                function handleImageLoad(e) {
                    // https://stackoverflow.com/a/9809055/1828637 - if load fired but it really failed
                    if (this.naturalHeight + this.naturalWidth === 0) {
                        this.onerror();
                        return;
                    }

                    var img = document.getElementById('image');
                    var width = img.offsetWidth;
                    var height = img.offsetHeight;

                    var can = document.createElement('canvas');
                    can.width = width;
                    can.height = height;
                    var ctx = can.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    // postMessage('can.toDataURL: ', Object.keys(can).toString());
                    // var dataurl = can.toDataURL();
                    var dataurl = '';

                    var info = '~!~' + width + ' ' + height + '$' + dataurl;
                    postMessage(info);
                }

                function handleImageError() {
                    // TODO: get more detailed error information
                    postMessage('Image failed to load.');
                }

                window.addEventListener('load', function() {
                    whenRNPostMessageReady(resizePixelated);
                }, false);
            </script>
        </head>
        <body></body>
    </html>
`;

const STATUS = {
    INIT: 'INIT',
    FAIL: 'FAIL',
    SUCCESS: 'SUCCESS'
}

class ImagePixelated extends Component {
    /* props
    url: dataURL or web url
    height?: number or undefined - set either height or width or both, but one must be set
    width?: number or undefined
    */
    state = {
        status: STATUS.INIT,
        reason: null, // set on STATUS.FAIL
        dataurl: null, // set on STATUS.SUCCESS
        height: null, // set on STATUS.SUCCESS
        width: null // set on STATUS.SUCCESS
    }
    handleMessage = e => {
        const {nativeEvent:{ data }} = e;



        if (data.startsWith('~!~')) {
            const width_stix = 3;
            const width_enix = data.indexOf(' ');
            const width = parseInt(data.substr(width_stix, width_enix - width_stix));

            const height_stix = width_enix + 1;
            const height_enix = data.indexOf('$', height_stix);
            const height = parseInt(data.substr(height_stix, height_enix - height_stix));

            const dataurl_stix = height_enix + 1;
            const dataurl = data.substr(dataurl_stix);

            this.setState(()=>({status:STATUS.SUCCESS, dataurl, height, width}));
        } else {
            // FAILED // TODO:
            this.setState(()=>({status:STATUS.FAIL, reason:data}));
        }
    }
    getHtml() {
        const { height, width, url } = this.props;
        let html_propified = html.replace('%%%URL%%%', url);

        if (isNaN(height) || height === undefined || height === null) html_propified = html_propified.replace('%%%HEIGHT%%%', 'undefined');
        else html_propified = html_propified.replace('%%%HEIGHT%%%', height);

        if (isNaN(width) || width === undefined || width === null) html_propified = html_propified.replace('%%%WIDTH%%%', 'undefined');
        else html_propified = html_propified.replace('%%%WIDTH%%%', width);

        return html_propified;
    }
    render() {
        const { status } = this.state;
        switch (status) {
            case STATUS.INIT: {
                const { height, width } = this.state;
                return <WebView source={{ html:this.getHtml() }} style={{height, width, backgroundColor:'transparent'}} onMessage={this.handleMessage} />;
            }
            case STATUS.FAIL: {
                const { reason } = this.state;
                return <View><Text>{reason}</Text></View>;
            }
            case STATUS.SUCCESS: {
                // const { dataurl, height, width } = this.state;
                // return <Image source={{ uri:dataurl, height, width }}  />
                const { height, width } = this.state;
                return <WebView source={{ html:this.getHtml() }} style={{height, width, backgroundColor:'transparent'}} />;
            }
            // no-default
        }
    }
}

export default ImagePixelated