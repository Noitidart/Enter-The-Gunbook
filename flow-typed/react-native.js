// @flow

import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import type { Styles as StylesType, StyleSheet } from 'react-native/Libraries/StyleSheet/StyleSheet'

type Style = StyleObj;
type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
type FontStyle = 'normal' | 'italic';
type FontSize = number;
type StyleSheetStyle = number;
type Styles = StylesType;
type StyleSheetType = StyleSheet;

type TextProps = {};
type TouchableHighlightProps = {};

type AnimatedValue = *;
type AnimatedCallback = ({ finished:boolean }) => void

type LayoutEvent = { nativeEvent:{ layout:{ width:number, height:number, x:number, y:number } } };
type ImageLoadEvent = { nativeEvent:{ source:{ width:number, height:number } } };
type ScrollEvent = {
    nativeEvent: { // tested on android 6.0/23 for onScroll and onMomentScrollEnd on <ScrollView>
        contentInset: { bottom:number, left:number, right:number, top:number },
        contentOffset: { x:number, y:number },
        contentSize: { height:number, width:number },
        layoutMeasurement: { height:number, width:number },
        responderIgnoreScroll: boolean,
        target: number,
        velocity: { x:number, y:number }
    }
}

type KeyboardDidShowEvent = { // tested on android 6.0/23
    endCoodrinates: {
        height: number,
        screenX: number,
        screenY: number, // float
        width: number
    }
}

type KeyboardWillShowEvent = {| // ios - rn 0.49.3
    duration: number, // 250
    easing: string, // "keyboard"
    endCoodrinates: {
        height: number,
        screenX: number,
        screenY: number,
        width: number
    },
    startCoordinates: {
        height: number,
        screenX: number,
        screenY: number,
        width: number
    }
|}

type KeyboardWillHideEvent = {| // ios - rn 0.49.3
    duration: number, // 250
    easing: string, // "keyboard"
    endCoodrinates: {
        height: number,
        screenX: number,
        screenY: number,
        width: number
    },
    startCoordinates: {
        height: number,
        screenX: number,
        screenY: number,
        width: number
    }
|}

type KeyboardDidHideEvent = null;  // tested on android 6.0/23
