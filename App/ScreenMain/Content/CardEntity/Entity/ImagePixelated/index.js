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
                function whenRNPostMessageReady(cb) {
                    if (postMessage.length === 1) cb();
                    else setTimeout(function() { whenRNPostMessageReady(cb) }, 1000);
                }

                function resizePixelated() {
                    var url = '%%%URL%%%';

                    var img = document.createElement('img');
                    document.body.appendChild(img);
                    img.addEventListener('load', handleImageLoad, false);
                    img.addEventListener('error', handleImageError, false);
                    img.setAttribute('id', 'image');
                    img.setAttribute('src', url);
                }

                function handleImageLoad(e) {
                    if (this.naturalHeight + this.naturalWidth === 0) {
                        this.onerror();
                        return;
                    }

                    var WANTED_HEIGHT = %%%HEIGHT%%%;
                    var WANTED_WIDTH = %%%WIDTH%%%;

                    var naturalHeight = this.naturalHeight;
                    var naturalWidth = this.naturalWidth;

                    postMessage('LOG:' + 'naturalHeight: ' + naturalHeight + ' naturalWidth: ' + naturalWidth);
                    postMessage('LOG:' + 'WANTED_HEIGHT: ' + WANTED_HEIGHT + ' WANTED_WIDTH: ' + WANTED_WIDTH);

                    var factorHeight = WANTED_HEIGHT / naturalHeight;
                    var factorWidth = WANTED_WIDTH / naturalWidth;

                    postMessage('LOG:' + 'factorHeight: ' + factorHeight + ' factorWidth: ' + factorWidth);

                    var byWidthHeight = naturalHeight * factorWidth;
                    var byHeightWidth = naturalWidth * factorHeight;
                    postMessage('LOG:' + 'byWidthHeight: ' + byWidthHeight + ' byHeightWidth: ' + byHeightWidth);

                    var sortable = [
                        { sorter:byWidthHeight, variable:'height', height:byWidthHeight, width:WANTED_WIDTH },
                        { sorter:byHeightWidth, variable:'width',  height:WANTED_HEIGHT, width:byHeightWidth }
                    ];

                    sortable.sort(function byDescSorter(a, b) {
                        return b.sorter - a.sorter;
                    });

                    postMessage('LOG:' + JSON.stringify(sortable));

                    for (var i=0; i<sortable.length; i++) {
                        var variable = sortable[i].variable;
                        var sorter = sortable[i].sorter;
                        if (variable == 'height') {
                            if (sorter < WANTED_HEIGHT) {
                                break;
                            }
                        } else if (variable == 'width') {
                            if (sorter < WANTED_WIDTH) {
                                break;
                            }
                        }
                    }

                    if (i >= sortable.length) {
                        postMessage('LOG: THIS SHOULD NEVER HAPPEN');
                    }

                    postMessage('LOG:' + i);

                    var drawWidth = Math.round(sortable[i].width);
                    var drawHeight = Math.round(sortable[i].height);

                    postMessage('LOG:will draw now at width: ' + drawWidth + ' drawHeight: ' + drawHeight);

                    var img = document.getElementById('image');
                    img.setAttribute('width', drawWidth);
                    img.setAttribute('height', drawHeight);

                    var dataurl = '';

                    postMessage('OK:' + drawWidth + '$' + drawHeight + '$' + dataurl);
                }

                function handleImageError() {
                    postMessage('Image failed to load.');
                }

                window.addEventListener('DOMContentLoaded', function() {
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

        const [action, payload] = data.split(/\:(.+)/); // split on first instance of colon
        // console.log('action:', action, 'payload:', payload);

        switch (action) {
            case 'LOG': {
                    console.log(payload);
                break;
            }
            case 'OK': {
                    let [ width, height, dataurl ] = data.substr('OK:'.length).split('$');
                    width = parseInt(width);
                    height = parseInt(height);
                    console.log('width:', width, 'height:', height, 'dataurl:', dataurl);
                    this.setState(()=>({status:STATUS.SUCCESS, dataurl, height, width}));
                break;
            }
            default:
                // FAILED // TODO:
                this.setState(()=>({status:STATUS.FAIL, reason:data}));
        }
    }
    getHtml() {
        const { height, width, url } = this.props;
        let html_propified = html.replace('%%%URL%%%', url);

        // because my scaling in WebView is to get max height while maintaining aspect ratio, if one (height or width) is not specificed, instead of setting to undefined, set the other to 1000

        if (isNaN(height) || height === undefined || height === null) html_propified = html_propified.replace('%%%HEIGHT%%%', '1000');
        else html_propified = html_propified.replace('%%%HEIGHT%%%', height);

        if (isNaN(width) || width === undefined || width === null) html_propified = html_propified.replace('%%%WIDTH%%%', '1000');
        else html_propified = html_propified.replace('%%%WIDTH%%%', width);

        return html_propified;
    }
    render() {
        const { status } = this.state;
        switch (status) {
            case STATUS.INIT: {
                const { height, width } = this.state;
                console.log('rendering webview');
                // android: transparent the background in webview here too, because when switch to success, where display is not none, we see a flash of white
                // android: the wrap of view is needed because WebView does not respect height as its a RN bug
                return (
                    <View style={{ display:'none' }}>
                        <WebView source={{ html:this.getHtml() }} style={{ display:'none', backgroundColor:'transparent' }} onMessage={this.handleMessage} />
                    </View>
                )
            }
            case STATUS.FAIL: {
                const { reason } = this.state;
                return (
                    <View>
                        <Text>{reason}</Text>
                    </View>
                )
            }
            case STATUS.SUCCESS: {
                // const { dataurl, height, width } = this.state;
                // return <Image source={{ uri:dataurl, height, width }}  />
                const { height, width } = this.state;
                return (
                    <View style={{ height, width }}>
                        <WebView source={{ html:this.getHtml() }} style={{ height, width, backgroundColor:'transparent' }} />
                    </View>
                )
            }
            // no-default
        }
    }
}

export default ImagePixelated
